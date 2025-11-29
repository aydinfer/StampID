# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StampID is a production-ready Expo mobile app template with glassmorphic UI. Built with Expo SDK 54, React 19, TypeScript strict mode, and NativeWind (Tailwind CSS for React Native).

## Development Commands

```bash
# Install dependencies (CRITICAL: must use --legacy-peer-deps for React 19)
npm install --legacy-peer-deps

# Start development server
npm start

# Run on specific platform
npm run ios
npm run android
npm run web

# Type check
npx tsc --noEmit
```

## Architecture

### Directory Structure

- `/app` - Expo Router file-based screens (like Next.js)
  - `(tabs)/` - Tab navigation group (parentheses = route group without URL segment)
  - `(auth)/` - Auth screens group
  - `_layout.tsx` - Layout files wrap nested routes
- `/lib` - Business logic, separated from UI
  - `hooks/` - Custom React hooks (useAuth, useSubscription, useData)
  - `store/` - Zustand stores for client state
  - `supabase/` - Supabase client configuration
  - `utils/` - Helpers, colors, validation, formatting
  - `animations/` - Reanimated animation presets
- `/components` - Reusable UI components
  - `ui/glass/` - Glassmorphic components (GlassCard, GlassButton, GlassInput, GlassModal, etc.)

### State Management Pattern

- **Server state** → React Query (queries, mutations, caching)
- **Client state** → Zustand (UI state, preferences)
- **Local state** → useState (component-specific)

### Root Layout Provider Chain

`app/_layout.tsx` wraps the app with:

1. `GestureHandlerRootView` - Required for gestures
2. `QueryClientProvider` - React Query context

## Styling System

**Single source of truth**: `tailwind.config.js`

Use NativeWind classes everywhere:

```tsx
<View className="bg-primary-500 p-4 rounded-xl">
  <Text className="text-white dark:text-gray-900">Hello</Text>
</View>
```

For native components requiring JS colors, import from `@/lib/utils/colors`.

Design tokens: primary, success, warning, error color scales (50-950).

## Glass Components

Located in `components/ui/glass/`. Use expo-blur with intensity 60-80. Performance: limit to 2-3 BlurViews per screen, avoid nesting.

```tsx
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/glass';
```

## TypeScript Conventions

- Strict mode enabled, no `any` types ever
- Use `interface` over `type` for props
- Functional components with explicit prop interfaces (avoid React.FC)
- Use `unknown` with type guards instead of `any`

## Code Style

- Path aliases: `@/` maps to project root
- NativeWind for all styling, never inline styles
- Boolean variables: `isLoading`, `hasError`, `canSubmit` (auxiliary verbs)
- Functions: `fetchUserData`, `handleButtonPress` (verb + noun)
- Component files: one component per file, < 300 lines
- Extract to hooks when: reusable logic with state, side effects, used across components

## Commit Messages

Follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `test:`, `chore:`
