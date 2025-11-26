// Stamp Identification API - Vercel Serverless Function
// Uses LLM Router for provider flexibility

import { callVisionLLM, getModelInfo } from '../lib/llm-router';

const SYSTEM_PROMPT = `You are an expert philatelist (stamp expert) with deep knowledge of stamps worldwide.
Analyze the stamp image. The image may contain ONE or MULTIPLE stamps.

Return a JSON response with this structure:
{
  "stamps": [
    {
      "identified": true,
      "confidence": 85,
      "name": "Stamp name/description",
      "country": "Country of origin",
      "year_issued": 1950,
      "catalog_number": "Scott/Stanley Gibbons number",
      "denomination": "Face value",
      "category": "definitive|commemorative|airmail|special|other",
      "theme": "Subject theme",
      "condition": "mint|mint_hinged|used|damaged",
      "condition_notes": "Brief notes",
      "estimated_value_low": 1.00,
      "estimated_value_high": 5.00,
      "currency": "USD",
      "description": "Brief historical context",
      "rarity": "common|uncommon|rare|very_rare",
      "bounding_box": { "x": 0, "y": 0, "width": 100, "height": 100, "normalized": true }
    }
  ],
  "total_stamps_detected": 1,
  "image_quality": "good|fair|poor",
  "suggestions": "Optional tips"
}

Bounding box uses normalized coordinates (0-1 range).
If no stamp detected, return: { "stamps": [], "total_stamps_detected": 0, "image_quality": "poor" }
Return ONLY valid JSON, no markdown.`;

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
    const { image_base64 } = await request.json();

    if (!image_base64) {
      return new Response(
        JSON.stringify({ error: 'image_base64 required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Clean base64 if it has data URL prefix
    const cleanBase64 = image_base64.replace(/^data:image\/\w+;base64,/, '');

    // Call LLM via router
    const modelInfo = getModelInfo();
    const llmResponse = await callVisionLLM({
      imageBase64: cleanBase64,
      prompt: 'Identify all stamps in this image. Detect each stamp separately.',
      systemPrompt: SYSTEM_PROMPT,
    });

    // Parse response
    let result;
    try {
      const clean = llmResponse.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      result = JSON.parse(clean);

      // Handle single-stamp response format
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
        raw: llmResponse.content,
      };
    }

    return new Response(
      JSON.stringify({
        ...result,
        model: modelInfo.model,
        provider: modelInfo.provider,
      }),
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
        total_stamps_detected: 0,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
