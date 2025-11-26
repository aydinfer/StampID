# StampID Backend API

Secure backend for stamp identification. API keys stay on the server.

## LLM Router

Switch providers by editing `lib/llm-config.ts`:

```typescript
// Change these 2 lines to switch providers
export const ACTIVE_PROVIDER: LLMProvider = 'qwen';
export const ACTIVE_MODEL = 'qwen-vl-max';
```

### Supported Providers

| Provider | Model | Cost (per 1M tokens) | Notes |
|----------|-------|---------------------|-------|
| **Qwen** | qwen-vl-max | $0.41 | Flagship, best accuracy |
| **Qwen** | qwen2.5-vl-72b | $0.15 | Best value |
| **DeepSeek** | deepseek-vl2 | $0.15 | Best for charts |
| **Pixtral** | pixtral-12b | $0.10 | Lightweight, Apache 2.0 |
| **Google** | gemini-2.5-flash | $0.10 | Fast |
| **OpenAI** | gpt-4o-mini | $0.15 | Cheapest OpenAI |

### Recommended: Qwen2.5-VL

Best price/performance. Set `QWEN_API_KEY` environment variable.

## Deployment

### Vercel (Recommended)

```bash
cd backend
vercel deploy
```

Set environment variable for your chosen provider:
- `QWEN_API_KEY` - Get from [DashScope](https://dashscope.aliyun.com/)
- `DEEPSEEK_API_KEY` - Get from [DeepSeek](https://platform.deepseek.com/)
- `MISTRAL_API_KEY` - Get from [Mistral](https://console.mistral.ai/)
- `GOOGLE_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/)
- `OPENAI_API_KEY` - Get from [OpenAI](https://platform.openai.com/)

## API Response

```json
{
  "stamps": [
    {
      "identified": true,
      "confidence": 85,
      "name": "Stamp name",
      "country": "Country",
      "year_issued": 1950,
      "estimated_value_low": 1.00,
      "estimated_value_high": 5.00,
      "bounding_box": { "x": 0.1, "y": 0.2, "width": 0.3, "height": 0.4, "normalized": true }
    }
  ],
  "total_stamps_detected": 1,
  "image_quality": "good",
  "model": "qwen-vl-max",
  "provider": "qwen"
}
```

## Mobile App Config

Set in `.env`:

```
EXPO_PUBLIC_AI_API_URL=https://your-backend.vercel.app/api/identify-stamp
```
