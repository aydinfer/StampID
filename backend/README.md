# StampID Backend API

This folder contains example backend code for the StampID AI identification endpoint.

## Why a Separate Backend?

**API keys must NEVER be in the mobile app.** Anyone can decompile an app and steal keys.

The backend:
1. Receives image from mobile app
2. Calls OpenRouter API with your secret key
3. Returns result to mobile app

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

Edit line 2 in `identify-stamp.ts`:

```typescript
const MODEL = 'google/gemini-2.0-flash-exp:free';  // Free
// const MODEL = 'anthropic/claude-3.5-sonnet';    // Better quality
```

## Mobile App Configuration

Set in your `.env`:

```
EXPO_PUBLIC_AI_API_URL=https://your-backend.vercel.app/api/identify-stamp
```
