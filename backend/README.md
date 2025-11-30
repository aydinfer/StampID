# StampID Backend API

Secure backend for stamp identification. API keys stay on the server.

## LLM Router

Switch providers by editing `lib/llm-config.ts`:

```typescript
// Change these 2 lines to switch providers
export const ACTIVE_PROVIDER: LLMProvider = 'google';
export const ACTIVE_MODEL = 'gemini-2.5-flash';
```

### Supported Providers (sorted by cost)

| Provider | Model | Cost (per 1M tokens) | Notes |
|----------|-------|---------------------|-------|
| **Google** | gemini-2.5-flash | **$0.10** | Cheapest, best multi-object |
| **Pixtral** | pixtral-12b | $0.10 | Lightweight, Apache 2.0 |
| **DeepSeek** | deepseek-vl2 | $0.15 | Best for charts |
| **Qwen** | qwen2.5-vl-72b | $0.15 | Good open-weight |
| **OpenAI** | gpt-4o-mini | $0.15 | |

### Recommended: Gemini 2.5 Flash

Cheapest + excellent multi-object detection. Set `GOOGLE_API_KEY`.

## Deployment

```bash
cd backend && vercel deploy
```

Set environment variable:
- `GOOGLE_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/)

## API Response

```json
{
  "stamps": [...],
  "total_stamps_detected": 1,
  "model": "gemini-2.5-flash",
  "provider": "google"
}
```

## Mobile App Config

```
EXPO_PUBLIC_AI_API_URL=https://your-backend.vercel.app/api/identify-stamp
```
