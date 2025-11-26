// Vercel Serverless Function for Stamp Identification
// Deploy to Vercel and set OPENROUTER_API_KEY environment variable

// ============================================
// CHANGE MODEL HERE (2 lines to switch)
// ============================================
const MODEL = 'google/gemini-2.5-flash-preview-05-20'; // RECOMMENDED - Best price/performance
// const MODEL = 'google/gemini-2.0-flash-exp:free';   // FREE - Decent quality
// const MODEL = 'anthropic/claude-3.5-sonnet';        // PREMIUM - Best quality

const SYSTEM_PROMPT = `You are an expert philatelist (stamp expert) with deep knowledge of stamps from around the world.
Analyze the stamp image provided. The image may contain ONE or MULTIPLE stamps.

IMPORTANT: If you detect MULTIPLE stamps in the image, return an array of stamp objects.
If you detect only ONE stamp, still return an array with one object.

Return a JSON response with this exact structure:
{
  "stamps": [
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
      "rarity": "common|uncommon|rare|very_rare",
      "bounding_box": {
        "x": 0,
        "y": 0,
        "width": 100,
        "height": 100,
        "normalized": true
      }
    }
  ],
  "total_stamps_detected": 1,
  "image_quality": "good|fair|poor",
  "suggestions": "Optional tips for better identification"
}

The bounding_box should contain normalized coordinates (0-1 range) indicating where each stamp is located in the image.
Set "normalized": true and provide x, y (top-left corner) and width, height as percentages.

If no stamp is detected, return:
{
  "stamps": [],
  "total_stamps_detected": 0,
  "image_quality": "poor",
  "suggestions": "Please capture a clearer image of the stamp"
}

IMPORTANT: Return ONLY valid JSON, no markdown code blocks, no explanation.`;

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
              {
                type: 'text',
                text: 'Identify all stamps in this image. Detect each stamp separately and provide bounding boxes.'
              },
              {
                type: 'image_url',
                image_url: { url: image_url || imageData },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      return new Response(
        JSON.stringify({
          error: 'AI service error',
          stamps: [],
          total_stamps_detected: 0
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    // Parse AI response
    let result;
    try {
      const clean = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      result = JSON.parse(clean);

      // Handle legacy single-stamp response format
      if (result.identified !== undefined && !result.stamps) {
        result = {
          stamps: [result],
          total_stamps_detected: 1,
          image_quality: 'good',
        };
      }
    } catch {
      result = {
        stamps: [],
        total_stamps_detected: 0,
        image_quality: 'unknown',
        parse_error: true,
        raw: content
      };
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
      JSON.stringify({
        error: error.message,
        stamps: [],
        total_stamps_detected: 0
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
