// API Configuration for StampID
// The AI endpoint should be your backend that securely calls OpenRouter
// NEVER put API keys in this file - they go in your backend only

export const API_CONFIG = {
  // ============================================
  // BACKEND URL - Point to your secure backend
  // ============================================
  // Options:
  // 1. Supabase Edge Function: https://your-project.supabase.co/functions/v1/identify-stamp
  // 2. Vercel Serverless: https://your-app.vercel.app/api/identify-stamp
  // 3. Railway/Render: https://your-api.railway.app/identify-stamp
  // 4. Your own server: https://api.yourdomain.com/identify-stamp

  IDENTIFY_STAMP_URL: process.env.EXPO_PUBLIC_AI_API_URL || '',

  // ============================================
  // MODEL SELECTION (passed to backend)
  // Change these 2 lines to switch models
  // ============================================
  AI_MODEL: 'google/gemini-2.0-flash-exp:free', // DEFAULT: Free Gemini
  // AI_MODEL: 'anthropic/claude-3.5-sonnet',   // QUALITY: Better accuracy

  // Available models via OpenRouter:
  // 'google/gemini-2.0-flash-exp:free'  - FREE, good for testing
  // 'google/gemini-flash-1.5'           - ~$0.075/1M tokens
  // 'anthropic/claude-3-haiku'          - $0.25/$1.25/1M, fast
  // 'anthropic/claude-3.5-sonnet'       - $3/$15/1M, excellent

  // ============================================
  // REQUEST SETTINGS
  // ============================================
  TIMEOUT_MS: 30000, // 30 seconds
  MAX_IMAGE_SIZE_MB: 4,
};

// Model display names for UI
export const MODEL_NAMES: Record<string, string> = {
  'google/gemini-2.0-flash-exp:free': 'Gemini Flash (Free)',
  'google/gemini-flash-1.5': 'Gemini Flash 1.5',
  'anthropic/claude-3-haiku': 'Claude Haiku',
  'anthropic/claude-3.5-sonnet': 'Claude Sonnet',
};
