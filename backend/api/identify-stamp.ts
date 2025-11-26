// Vercel Serverless Function for Stamp Identification
// Deploy to Vercel and set OPENROUTER_API_KEY environment variable

// ============================================
// CHANGE MODEL HERE (2 lines to switch)
// ============================================
const MODEL = 'google/gemini-2.0-flash-exp:free'; // FREE - Default
// const MODEL = 'anthropic/claude-3.5-sonnet';   // QUALITY - Uncomment for better results

const SYSTEM_PROMPT = `You are an expert philatelist (stamp expert) with deep knowledge of stamps from around the world.
Analyze the stamp image provided and return a JSON response with the following information:

{
  "identified": true,
  "confidence": 85,
  "name": "Stamp name/description",
  "country": "Country of origin",
  "year_issued": 1950,
  "catalog_number": "Scott/Stanley Gibbons number if identifiable",
  "denomination": "Face value",
  "category": "definitive|commemorative|airmail|special|other",
  "theme": "Subject theme",
  "condition": "mint|mint_hinged|used|damaged",
  "condition_notes": "Brief notes on condition",
  "estimated_value_low": 1.00,
  "estimated_value_high": 5.00,
  "currency": "USD",
  "description": "Brief historical context",
  "rarity": "common|uncommon|rare|very_rare"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanation.`;

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // CORS
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { image_base64, image_url } = await request.json();

    if (!image_base64 && !image_url) {
      return new Response(
        JSON.stringify({ error: 'image_base64 or image_url required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare image
    let imageData = image_base64;
    if (imageData && !imageData.startsWith('data:')) {
      imageData = `data:image/jpeg;base64,${imageData}`;
    }

    // Call OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://stampid.app',
        'X-Title': 'StampID',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Identify this stamp:' },
              {
                type: 'image_url',
                image_url: { url: image_url || imageData },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      return new Response(
        JSON.stringify({ error: 'AI service error', identified: false }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse AI response
    let result;
    try {
      const clean = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(clean);
    } catch {
      result = { identified: false, confidence: 0, name: 'Parse error', raw: content };
    }

    return new Response(
      JSON.stringify({ ...result, model_used: MODEL }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, identified: false }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
