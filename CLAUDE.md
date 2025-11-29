# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo SDK 54 starter template featuring a **glassmorphic UI design system**. Built with React 19.1.0, NativeWind v4, and 13 pre-built glass components using expo-blur for native blur effects.

## Critical Installation Requirements

**ALWAYS use `--legacy-peer-deps` when installing packages:**

```bash
npm install --legacy-peer-deps
```

This project requires React 19.1.0 (required by Expo SDK 54). The React ecosystem is catching up to React 19, so peer dependency warnings are expected but the packages work correctly. **NEVER downgrade to React 18** - it will break Expo 54.

## Development Commands

```bash
# Start development server
npm start
npx expo start

# Platform-specific
npm run ios              # Run on iOS simulator
npm run android          # Run on Android emulator
npm run web             # Run in web browser

# Clear cache if needed
npx expo start --clear
```

No test or lint commands are currently configured.

## Architecture

### File-based Routing (Expo Router)

Uses Next.js-style file-based routing. Route structure:

- `app/_layout.tsx` - Root layout, wraps entire app with QueryClientProvider
- `app/(tabs)/` - Tab navigation group (parentheses = route group, doesn't affect URL)
- `app/(auth)/` - Auth screens group
- `app/[param].tsx` - Dynamic routes

**Navigation:**

```tsx
import { router, Link } from 'expo-router';

// Programmatic
router.push('/path');
router.replace('/path');
router.back();

// Component
<Link href="/path">Link</Link>;
```

### Directory Structure

```
app/                    # Expo Router screens (file-based routing)
├── _layout.tsx         # Root layout with providers
├── (tabs)/             # Tab navigation
└── (auth)/             # Auth screens

lib/                    # Business logic (separated from UI)
├── supabase/           # Supabase client & config
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useData.ts      # React Query data hooks
│   └── useSubscription.ts  # RevenueCat hook
├── store/              # Zustand stores
└── utils/              # Helper functions

components/
├── ui/glass/           # 13 glassmorphic components
└── ErrorBoundary.tsx

docs/                   # Comprehensive documentation
```

### Path Aliases

TypeScript is configured with `@/*` path alias pointing to root:

```tsx
import { supabase } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/glass';
import { useAuth } from '@/lib/hooks/useAuth';
```

## Tech Stack

### Core

- **Expo SDK 54** - React Native framework (DO NOT downgrade)
- **React 19.1.0** - Required by Expo 54 (DO NOT downgrade)
- **TypeScript** - Strict mode enabled
- **React Native 0.81.5**

### UI & Styling

- **NativeWind v4** - Tailwind CSS for React Native
- **expo-blur** - Native blur effects for glassmorphism
- **react-native-reanimated** - 60fps animations

### Backend & State

- **Supabase** - Auth, database, storage
- **React Query (@tanstack/react-query)** - Server state management
- **Zustand** - Client state management
- **RevenueCat** - In-app purchases

### Key Dependencies

- `@react-native-async-storage/async-storage` - Supabase session persistence
- `react-native-gesture-handler` - Touch gestures
- `react-native-url-polyfill` - Required for Supabase

## Design System

### Single Source of Truth

All design tokens live in `tailwind.config.js`:

- Color scales: primary, success, warning, error
- Each color has 50-900 shades
- Use NativeWind classes: `className="bg-primary-500 text-white"`

### Using Colors in Native Components

For components that don't support className (like Tab Bar):

```tsx
import { colors } from '@/lib/utils/colors';

<Tabs
  screenOptions={{
    tabBarActiveTintColor: colors.primary[600],
  }}
/>;
```

## Glassmorphic UI System

### 13 Pre-built Glass Components

Located in `components/ui/glass/`:

1. **GlassCard** - Containers with 3 variants (default, premium, subtle)
2. **GlassButton** - Interactive buttons with loading states
3. **GlassInput** - Form inputs with floating labels
4. **GlassModal** - Full-screen animated modals
5. **GlassSwitch** - Toggle switches
6. **GlassSegmentedControl** - Tab selectors
7. **GlassSheet** - Draggable bottom sheets
8. **GlassAvatar** - Avatar components with groups
9. **GlassBadge** - Badge variants
10. **GlassSkeleton** - Loading skeletons
11. **GlassEmptyState** - Empty state variants
12. **GlassLoadingSpinner** - Loading indicators

All exported from `@/components/ui/glass`.

### Glass Component Architecture

All glass components use:

- `expo-blur`'s `BlurView` for native blur effects
- NativeWind classes for styling
- react-native-reanimated for animations
- Consistent API (variant, intensity, className props)

**Example:**

```tsx
import { GlassCard, GlassButton } from '@/components/ui/glass';

<GlassCard variant="premium" intensity={80}>
  <Text className="text-white">Content</Text>
  <GlassButton title="Action" variant="primary" loading={isLoading} onPress={handlePress} />
</GlassCard>;
```

### Performance Considerations

**IMPORTANT:** `BlurView` is GPU-intensive. Limit to **2-3 per screen**.

```tsx
// ❌ BAD - Multiple blurs in list
{
  items.map((item) => <BlurView>...</BlurView>);
}

// ✅ GOOD - Single blur container
<BlurView>
  {items.map((item) => (
    <View>...</View>
  ))}
</BlurView>;
```

## State Management

### Two-tier Strategy

**Server State (React Query)** - For data from APIs:

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['users', userId],
  queryFn: async () => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    return data;
  },
});
```

**Client State (Zustand)** - For UI state:

```tsx
import { create } from 'zustand';

const useAppStore = create((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
}));
```

React Query client configured in `app/_layout.tsx` with:

- 2 retries
- 5 minute stale time

## Authentication (Supabase)

Supabase client: `lib/supabase/client.ts`
Auth hook: `lib/hooks/useAuth.ts`

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

const { user, session, loading, signIn, signUp, signOut } = useAuth();
```

Features:

- AsyncStorage session persistence
- Auto-refresh tokens
- Auth state listener
- Email/password auth methods

Environment variables required:

```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
```

## Important Configuration Details

### babel.config.js

**CRITICAL:** `react-native-reanimated/plugin` MUST be last in plugins array:

```js
plugins: [
  'react-native-reanimated/plugin',  // Must be last!
],
```

Moving this plugin will break animations.

### metro.config.js

Configured with `withNativeWind` wrapper to process CSS:

```js
const { withNativeWind } = require('nativewind/metro');
module.exports = withNativeWind(config, { input: './global.css' });
```

### global.css

Tailwind CSS entry point, imported in `app/_layout.tsx`.

## Common Patterns

### Protected Routes

```tsx
const { user, loading } = useAuth();

if (loading) return <LoadingScreen />;
if (!user) {
  router.replace('/sign-in');
  return null;
}
```

### Animated Glass Components

```tsx
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.duration(600).springify()}>
  <GlassCard variant="premium">
    <Text className="text-white">Animated!</Text>
  </GlassCard>
</Animated.View>;
```

### React Query Mutations

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

## Documentation

Comprehensive docs in `docs/`:

- `01-getting-started.md` - Installation
- `02-project-structure.md` - Architecture details
- `03-design-system.md` - Theming and colors
- `04-components.md` - Component API reference
- `06-glassmorphism.md` - Glass UI guide
- `06-supabase-setup.md` - Backend setup
- `13-troubleshooting.md` - Common issues

See `/app/components-demo.tsx` for interactive component demos.

## Key Principles

1. **Strict separation of concerns** - UI in `app/` and `components/`, logic in `lib/`
2. **TypeScript strict mode** - All code is fully typed
3. **NativeWind for styling** - Use className prop with Tailwind classes
4. **Path aliases** - Always use `@/` imports
5. **React Query for server state** - Never store server data in Zustand
6. **Limit BlurViews** - Maximum 2-3 per screen for performance
7. **Reanimated plugin last** - In babel.config.js plugins array
