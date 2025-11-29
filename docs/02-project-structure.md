# Project Structure

Understanding the architecture of this Expo starter template.

## Directory Overview

### `/app` - Expo Router Screens

Expo Router uses file-based routing (like Next.js). Every file in this directory becomes a route.

```
app/
├── _layout.tsx           # Root layout (wraps all screens)
├── (tabs)/              # Tab navigation group
│   ├── _layout.tsx      # Tabs layout
│   ├── index.tsx        # / (Home)
│   └── explore.tsx      # /explore
├── (auth)/              # Auth screens (hidden from tabs)
│   ├── _layout.tsx      # Auth layout
│   ├── sign-in.tsx      # /sign-in
│   └── sign-up.tsx      # /sign-up
└── +not-found.tsx       # 404 catch-all
```

**Key concepts:**

- Folders in parentheses `(tabs)` create route groups without adding to URL
- `_layout.tsx` files define layouts for nested routes
- `index.tsx` is the default route for that directory

### `/lib` - Business Logic

All your business logic lives here, separate from UI.

```
lib/
├── supabase/
│   └── client.ts        # Supabase client configuration
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   ├── useSubscription.ts  # RevenueCat hook
│   └── useData.ts       # React Query data hooks
├── store/
│   └── appStore.ts      # Zustand global state
└── utils/
    ├── helpers.ts       # Utility functions
    └── api.ts           # HTTP client for external APIs
```

**Best practices:**

- Keep hooks focused on a single responsibility
- Use React Query for server state
- Use Zustand for client state
- Keep utilities pure and tested

### `/components` - Reusable Components

Create reusable UI components here.

```
components/
├── ui/                  # Generic UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── features/            # Feature-specific components
│   ├── UserProfile.tsx
│   └── SubscriptionCard.tsx
└── layout/              # Layout components
    ├── Header.tsx
    └── Container.tsx
```

**Component guidelines:**

- Use NativeWind for styling: `className="bg-primary-500"`
- Export as named exports: `export function Button()`
- Keep components small and focused
- Use TypeScript for props

### `/assets` - Static Files

```
assets/
├── images/             # Images
├── fonts/              # Custom fonts
└── icons/              # Icons
```

### `/docs` - Documentation

This folder! All project documentation.

## Configuration Files

### `tailwind.config.js`

Single source of truth for your design system.

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          /* blue scale */
        },
        success: {
          /* green scale */
        },
        warning: {
          /* yellow scale */
        },
        error: {
          /* red scale */
        },
      },
    },
  },
};
```

### `metro.config.js`

Configures Metro bundler to process NativeWind CSS.

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

### `babel.config.js`

Configures Babel for NativeWind and Reanimated.

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last!
    ],
  };
};
```

### `app.json`

Expo configuration.

```json
{
  "expo": {
    "name": "clean-build",
    "slug": "clean-build",
    "scheme": "myapp",
    "platforms": ["ios", "android"]
  }
}
```

## Routing Examples

### Basic Navigation

```tsx
import { Link, router } from 'expo-router';

// Using Link component
<Link href="/explore">Go to Explore</Link>;

// Using router programmatically
router.push('/explore');
router.replace('/sign-in');
router.back();
```

### Dynamic Routes

Create a file like `app/user/[id].tsx`:

```tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams();
  return <Text>User ID: {id}</Text>;
}
```

Navigate: `router.push('/user/123')`

### Passing Data

```tsx
// Push with params
router.push({
  pathname: '/details',
  params: { id: '123', name: 'John' },
});

// Access params
const { id, name } = useLocalSearchParams();
```

## State Management

### Server State (React Query)

Use for data from APIs:

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await supabase.from('users').select('*').eq('id', userId).single();
      return data;
    },
  });
}
```

### Client State (Zustand)

Use for UI state:

```tsx
import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

## Import Aliases

Configure TypeScript path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Usage:

```tsx
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
```

## Best Practices

1. **Separate UI from Logic**: Keep business logic in `/lib`, UI in `/app` and `/components`
2. **Use TypeScript**: Define interfaces for all data structures
3. **Single Responsibility**: Each file should do one thing well
4. **Co-locate related code**: Keep related files together
5. **Use path aliases**: Import with `@/` instead of `../../`
