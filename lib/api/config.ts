// API Configuration for StampID
// Model selection is handled by the backend LLM router
// NEVER put API keys in this file

export const API_CONFIG = {
  // Backend URL - Point to your secure backend
  // Options:
  // - Vercel: https://your-app.vercel.app/api/identify-stamp
  // - Railway: https://your-api.railway.app/identify-stamp
  // - Your server: https://api.yourdomain.com/identify-stamp
  IDENTIFY_STAMP_URL: process.env.EXPO_PUBLIC_AI_API_URL || '',

  // Request settings
  TIMEOUT_MS: 30000,
  MAX_IMAGE_SIZE_MB: 4,
};
