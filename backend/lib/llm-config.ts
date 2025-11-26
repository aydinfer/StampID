// LLM Router - Switch providers in 2 lines
// Supports: Qwen, DeepSeek, Pixtral, Google, OpenAI

export type LLMProvider = 'qwen' | 'deepseek' | 'pixtral' | 'google' | 'openai';

// ============================================
// CHANGE MODEL HERE (2 lines)
// ============================================
export const ACTIVE_PROVIDER: LLMProvider = 'qwen';
export const ACTIVE_MODEL = 'qwen-vl-max'; // or qwen2.5-vl-72b-instruct

// Provider configurations
export const PROVIDERS = {
  qwen: {
    name: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: {
      'qwen-vl-max': { cost: 0.41, description: 'Flagship vision model' },
      'qwen2.5-vl-72b-instruct': { cost: 0.15, description: 'Best open-weight VLM' },
      'qwen2.5-vl-7b-instruct': { cost: 0.05, description: 'Lightweight, fast' },
    },
    envKey: 'QWEN_API_KEY',
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: {
      'deepseek-vl2': { cost: 0.15, description: 'Best for charts/diagrams' },
      'deepseek-vl': { cost: 0.15, description: 'General vision' },
    },
    envKey: 'DEEPSEEK_API_KEY',
  },
  pixtral: {
    name: 'Pixtral (Mistral)',
    baseUrl: 'https://api.mistral.ai/v1',
    models: {
      'pixtral-12b-2409': { cost: 0.10, description: 'Lightweight, Apache 2.0' },
      'pixtral-large-latest': { cost: 0.50, description: '124B params, best quality' },
    },
    envKey: 'MISTRAL_API_KEY',
  },
  google: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: {
      'gemini-2.5-flash': { cost: 0.10, description: 'Fast, good quality' },
      'gemini-2.5-pro': { cost: 1.25, description: 'Best quality' },
    },
    envKey: 'GOOGLE_API_KEY',
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: {
      'gpt-4o-mini': { cost: 0.15, description: 'Cheapest OpenAI vision' },
      'gpt-4o': { cost: 2.50, description: 'Best OpenAI vision' },
    },
    envKey: 'OPENAI_API_KEY',
  },
} as const;

export function getProviderConfig() {
  const provider = PROVIDERS[ACTIVE_PROVIDER];
  return {
    ...provider,
    model: ACTIVE_MODEL,
    apiKey: process.env[provider.envKey] || '',
  };
}

export function getModelInfo() {
  const provider = PROVIDERS[ACTIVE_PROVIDER];
  const model = provider.models[ACTIVE_MODEL as keyof typeof provider.models];
  return {
    provider: ACTIVE_PROVIDER,
    model: ACTIVE_MODEL,
    cost: model?.cost || 0,
    description: model?.description || '',
  };
}
