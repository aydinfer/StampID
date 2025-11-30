-- StampID AI Identification via Database Function
-- Uses pg_net extension to call OpenRouter API securely
-- API key stored in vault, never exposed to client

-- ============================================
-- ENABLE REQUIRED EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;

-- ============================================
-- STORE API KEY IN VAULT (Run manually in SQL Editor)
-- ============================================
-- SELECT vault.create_secret('OPENROUTER_API_KEY', 'your-api-key-here');

-- ============================================
-- MODEL CONFIGURATION TABLE
-- Change model by updating this table - no code changes needed!
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Single row table
  model TEXT NOT NULL DEFAULT 'google/gemini-2.0-flash-exp:free',
  -- Available models (uncomment to switch):
  -- 'google/gemini-2.0-flash-exp:free'    -- FREE - good for testing
  -- 'google/gemini-flash-1.5'             -- ~$0.075/1M tokens
  -- 'anthropic/claude-3-haiku'            -- $0.25/$1.25 per 1M - fast & cheap
  -- 'anthropic/claude-3.5-sonnet'         -- $3/$15 per 1M - excellent quality
  max_tokens INTEGER DEFAULT 1000,
  temperature NUMERIC(3,2) DEFAULT 0.3,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default config
INSERT INTO public.ai_config (model)
VALUES ('google/gemini-2.0-flash-exp:free')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SYSTEM PROMPT FOR STAMP IDENTIFICATION
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_prompts (
  id TEXT PRIMARY KEY,
  prompt TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.ai_prompts (id, prompt) VALUES (
  'stamp_identification',
  'You are an expert philatelist (stamp expert) with deep knowledge of stamps from around the world.
Analyze the stamp image provided and return a JSON response with the following information:

{
  "identified": true,
  "confidence": 85,
  "name": "Stamp name/description",
  "country": "Country of origin",
  "year_issued": 1950,
  "catalog_number": "Scott/Stanley Gibbons number if identifiable",
  "denomination": "Face value (e.g., 5 cents, 1 pound)",
  "category": "definitive|commemorative|airmail|special|other",
  "theme": "Subject theme (e.g., wildlife, historical figure, architecture)",
  "condition": "mint|mint_hinged|used|damaged",
  "condition_notes": "Brief notes on condition",
  "estimated_value_low": 1.00,
  "estimated_value_high": 5.00,
  "currency": "USD",
  "description": "Brief historical context or interesting facts about this stamp",
  "rarity": "common|uncommon|rare|very_rare"
}

Guidelines:
- Be conservative with value estimates
- If you cannot identify the stamp with confidence, set identified to false
- Always provide your best guess even if confidence is low
- Use USD for currency unless the stamp is clearly from a specific region
- Condition should be assessed from the image quality
- Include catalog numbers only if you are reasonably certain

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation, just the JSON object.'
) ON CONFLICT (id) DO UPDATE SET prompt = EXCLUDED.prompt;

-- ============================================
-- IDENTIFY STAMP FUNCTION
-- Called via supabase.rpc('identify_stamp', { image_base64: '...' })
-- ============================================
CREATE OR REPLACE FUNCTION public.identify_stamp(
  image_base64 TEXT,
  user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault, extensions
AS $$
DECLARE
  api_key TEXT;
  model_name TEXT;
  max_tok INTEGER;
  temp NUMERIC;
  system_prompt TEXT;
  request_body JSONB;
  response_id BIGINT;
  response_body JSONB;
  result JSONB;
  image_data TEXT;
BEGIN
  -- Get API key from vault
  SELECT decrypted_secret INTO api_key
  FROM vault.decrypted_secrets
  WHERE name = 'OPENROUTER_API_KEY'
  LIMIT 1;

  IF api_key IS NULL THEN
    RETURN jsonb_build_object(
      'error', 'API key not configured',
      'identified', false
    );
  END IF;

  -- Get model configuration
  SELECT model, max_tokens, temperature
  INTO model_name, max_tok, temp
  FROM public.ai_config
  WHERE id = 1;

  -- Get system prompt
  SELECT prompt INTO system_prompt
  FROM public.ai_prompts
  WHERE id = 'stamp_identification';

  -- Ensure base64 has proper prefix
  IF image_base64 NOT LIKE 'data:%' THEN
    image_data := 'data:image/jpeg;base64,' || image_base64;
  ELSE
    image_data := image_base64;
  END IF;

  -- Build request body
  request_body := jsonb_build_object(
    'model', model_name,
    'messages', jsonb_build_array(
      jsonb_build_object(
        'role', 'system',
        'content', system_prompt
      ),
      jsonb_build_object(
        'role', 'user',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'text', 'text', 'Please identify this stamp and provide details in JSON format:'),
          jsonb_build_object(
            'type', 'image_url',
            'image_url', jsonb_build_object('url', image_data)
          )
        )
      )
    ),
    'max_tokens', max_tok,
    'temperature', temp
  );

  -- Make HTTP request via pg_net
  SELECT net.http_post(
    url := 'https://openrouter.ai/api/v1/chat/completions',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || api_key,
      'Content-Type', 'application/json',
      'HTTP-Referer', 'https://stampid.app',
      'X-Title', 'StampID'
    ),
    body := request_body
  ) INTO response_id;

  -- Note: pg_net is async, so we need to poll for result
  -- For sync behavior, consider using http extension instead
  -- or handle the response_id in the client

  RETURN jsonb_build_object(
    'request_id', response_id,
    'model', model_name,
    'status', 'processing',
    'message', 'Request submitted. Poll for results using the request_id.'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'identified', false
  );
END;
$$;

-- ============================================
-- SIMPLER SYNC VERSION USING HTTP EXTENSION
-- (If you prefer synchronous calls)
-- ============================================
-- First enable: CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- CREATE OR REPLACE FUNCTION public.identify_stamp_sync(
--   image_base64 TEXT
-- )
-- RETURNS JSONB
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- DECLARE
--   api_key TEXT;
--   response extensions.http_response;
--   result JSONB;
-- BEGIN
--   SELECT decrypted_secret INTO api_key
--   FROM vault.decrypted_secrets
--   WHERE name = 'OPENROUTER_API_KEY';
--
--   SELECT * INTO response FROM extensions.http((
--     'POST',
--     'https://openrouter.ai/api/v1/chat/completions',
--     ARRAY[
--       extensions.http_header('Authorization', 'Bearer ' || api_key),
--       extensions.http_header('Content-Type', 'application/json')
--     ],
--     'application/json',
--     '{"model": "google/gemini-2.0-flash-exp:free", ...}'
--   )::extensions.http_request);
--
--   RETURN response.content::jsonb;
-- END;
-- $$;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT EXECUTE ON FUNCTION public.identify_stamp TO authenticated;
GRANT SELECT ON public.ai_config TO authenticated;
GRANT SELECT ON public.ai_prompts TO authenticated;
