# StampID Backend API

This folder contains example backend code for the StampID AI identification endpoint.

## Why a Separate Backend?

**API keys must NEVER be in the mobile app.** Anyone can decompile an app and steal keys.

The backend:
1. Receives image from mobile app
2. Calls OpenRouter API with your secret key
3. Returns result to mobile app

## Features

- **Multi-stamp detection**: Detects and identifies multiple stamps in a single image
- **Bounding boxes**: Returns location data for each stamp in the image
- **Image quality assessment**: Reports on image quality for better user feedback
- **Flexible model switching**: Change AI model in 2 lines

## Deployment Options

### Option 1: Vercel (Recommended - Free tier)

1. Create `api/identify-stamp.ts` in a Vercel project
2. Deploy with `vercel deploy`
3. Set environment variable: `OPENROUTER_API_KEY`

### Option 2: Railway

1. Deploy `server.ts` as a Node.js service
2. Set environment variable: `OPENROUTER_API_KEY`

### Option 3: Any Node.js Host

1. Run `server.ts` on any Node.js hosting
2. Set environment variable: `OPENROUTER_API_KEY`

## Environment Variables

```
OPENROUTER_API_KEY=sk-or-v1-xxxxx  # Get from openrouter.ai
```

## Change AI Model

Edit line 7 in `api/identify-stamp.ts`:

```typescript
// RECOMMENDED - Best price/performance for multi-stamp detection
const MODEL = 'google/gemini-2.5-flash-preview-05-20';

// FREE - Decent quality (uncomment to use)
// const MODEL = 'google/gemini-2.0-flash-exp:free';

// PREMIUM - Best quality (uncomment to use)
// const MODEL = 'anthropic/claude-3.5-sonnet';
```

### Model Comparison (Nov 2025)

| Model | Cost | Multi-Object | Quality |
|-------|------|--------------|---------|
| Gemini 2.5 Flash | ~$0.10/1M input | Excellent | High |
| Gemini 2.0 Flash (free) | Free | Good | Medium |
| Claude 3.5 Sonnet | ~$3/1M input | Good | Very High |

## API Response Format

The API returns a multi-stamp response:

```json
{
  "stamps": [
    {
      "identified": true,
      "confidence": 85,
      "name": "Stamp name",
      "country": "Country",
      "year_issued": 1950,
      "catalog_number": "Scott #123",
      "denomination": "5 cents",
      "category": "commemorative",
      "theme": "Historical",
      "condition": "mint",
      "condition_notes": "Excellent centering",
      "estimated_value_low": 1.00,
      "estimated_value_high": 5.00,
      "currency": "USD",
      "description": "Brief description",
      "rarity": "common",
      "bounding_box": {
        "x": 0.1,
        "y": 0.2,
        "width": 0.3,
        "height": 0.4,
        "normalized": true
      }
    }
  ],
  "total_stamps_detected": 1,
  "image_quality": "good",
  "suggestions": "Optional tips",
  "model_used": "google/gemini-2.5-flash-preview-05-20"
}
```

## Mobile App Configuration

Set in your `.env`:

```
EXPO_PUBLIC_AI_API_URL=https://your-backend.vercel.app/api/identify-stamp
```
