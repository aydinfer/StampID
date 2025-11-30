// LLM Router - Unified interface for all vision LLM providers

import { ACTIVE_PROVIDER, getProviderConfig, getModelInfo } from './llm-config';

interface VisionRequest {
  imageBase64: string;
  prompt: string;
  systemPrompt?: string;
}

interface VisionResponse {
  content: string;
  model: string;
  provider: string;
}

// Unified vision API call
export async function callVisionLLM(request: VisionRequest): Promise<VisionResponse> {
  const config = getProviderConfig();

  if (!config.apiKey) {
    throw new Error(`API key not configured for ${config.name}. Set ${ACTIVE_PROVIDER.toUpperCase()}_API_KEY`);
  }

  switch (ACTIVE_PROVIDER) {
    case 'qwen':
      return callQwen(request, config);
    case 'deepseek':
      return callDeepSeek(request, config);
    case 'pixtral':
      return callPixtral(request, config);
    case 'google':
      return callGoogle(request, config);
    case 'openai':
      return callOpenAI(request, config);
    default:
      throw new Error(`Unknown provider: ${ACTIVE_PROVIDER}`);
  }
}

// Qwen (Alibaba) - OpenAI-compatible API
async function callQwen(request: VisionRequest, config: ReturnType<typeof getProviderConfig>): Promise<VisionResponse> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
        {
          role: 'user',
          content: [
            { type: 'text', text: request.prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${request.imageBase64}` } },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Qwen API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    model: config.model,
    provider: 'qwen',
  };
}

// DeepSeek - OpenAI-compatible API
async function callDeepSeek(request: VisionRequest, config: ReturnType<typeof getProviderConfig>): Promise<VisionResponse> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
        {
          role: 'user',
          content: [
            { type: 'text', text: request.prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${request.imageBase64}` } },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    model: config.model,
    provider: 'deepseek',
  };
}

// Pixtral (Mistral) - OpenAI-compatible API
async function callPixtral(request: VisionRequest, config: ReturnType<typeof getProviderConfig>): Promise<VisionResponse> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
        {
          role: 'user',
          content: [
            { type: 'text', text: request.prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${request.imageBase64}` } },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Pixtral API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    model: config.model,
    provider: 'pixtral',
  };
}

// Google Gemini - Native API
async function callGoogle(request: VisionRequest, config: ReturnType<typeof getProviderConfig>): Promise<VisionResponse> {
  const url = `${config.baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            ...(request.systemPrompt ? [{ text: request.systemPrompt }] : []),
            { text: request.prompt },
            { inline_data: { mime_type: 'image/jpeg', data: request.imageBase64 } },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.2,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Google API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    model: config.model,
    provider: 'google',
  };
}

// OpenAI - Native API
async function callOpenAI(request: VisionRequest, config: ReturnType<typeof getProviderConfig>): Promise<VisionResponse> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
        {
          role: 'user',
          content: [
            { type: 'text', text: request.prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${request.imageBase64}` } },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    model: config.model,
    provider: 'openai',
  };
}

export { getModelInfo };
