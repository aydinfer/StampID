# API Reference

Complete reference for all hooks, utilities, and components in this starter.

## Hooks

### useAuth

Authentication hook powered by Supabase.

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

const {
  user, // Current user or null
  session, // Session object
  isLoading, // Loading state
  error, // Error message
  signIn, // (email, password) => Promise<void>
  signUp, // (email, password) => Promise<void>
  signOut, // () => Promise<void>
  resetPassword, // (email) => Promise<void>
} = useAuth();
```

**Example:**

```tsx
const { user, signIn, signOut } = useAuth();

if (!user) {
  return <LoginButton onPress={() => signIn('email@example.com', 'password')} />;
}

return <LogoutButton onPress={signOut} />;
```

### useSubscription

RevenueCat subscription management.

```tsx
import { useSubscription } from '@/lib/hooks/useSubscription';

const {
  offerings, // Available packages
  activeSubscriptions, // Active subscription IDs
  isLoading, // Loading state
  error, // Error message
  purchasePackage, // (pkg) => Promise<void>
  restorePurchases, // () => Promise<void>
} = useSubscription();
```

**Example:**

```tsx
const { offerings, purchasePackage } = useSubscription();

const monthlyPackage = offerings?.current?.availablePackages[0];

<GlassButton title="Subscribe Monthly - $9.99" onPress={() => purchasePackage(monthlyPackage)} />;
```

### useData

React Query example hook.

```tsx
import { useData, useCreateData, useUpdateData, useDeleteData } from '@/lib/hooks/useData';

// Fetch data
const { data, isLoading, error } = useData();

// Create mutation
const createMutation = useCreateData();
createMutation.mutate({ name: 'New Item' });

// Update mutation
const updateMutation = useUpdateData();
updateMutation.mutate({ id: 1, name: 'Updated' });

// Delete mutation
const deleteMutation = useDeleteData();
deleteMutation.mutate(1);
```

## Stores

### useAppStore

Global app state using Zustand.

```tsx
import { useAppStore } from '@/lib/store/appStore';

// Get specific value (re-renders only when theme changes)
const theme = useAppStore((state) => state.theme);

// Get multiple values
const { theme, setTheme } = useAppStore((state) => ({
  theme: state.theme,
  setTheme: state.setTheme,
}));

// Get all state (re-renders on any change)
const store = useAppStore();
```

**State:**

```tsx
{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  onboardingCompleted: boolean;
  completeOnboarding: () => void;
}
```

## Utilities

### helpers.ts

Common utility functions.

```tsx
import { formatDate, formatCurrency, debounce, throttle, generateId } from '@/lib/utils/helpers';

// Format date
formatDate(new Date()); // "Nov 17, 2025"

// Format currency
formatCurrency(1234.56); // "$1,234.56"

// Debounce function
const debouncedSearch = debounce((query) => {
  search(query);
}, 500);

// Throttle function
const throttledScroll = throttle(() => {
  handleScroll();
}, 100);

// Generate unique ID
const id = generateId(); // "abc123xyz"
```

### colors.ts

Design tokens for React Native components.

```tsx
import { colors } from '@/lib/utils/colors';

<Tabs
  screenOptions={{
    tabBarActiveTintColor: colors.primary[600],
    tabBarInactiveTintColor: colors.gray[500],
  }}
/>;
```

**Available colors:**

```tsx
colors.primary[50 - 950]; // Blue scale
colors.success[50 - 950]; // Green scale
colors.warning[50 - 950]; // Yellow scale
colors.error[50 - 950]; // Red scale
colors.gray[50 - 950]; // Gray scale
```

### api.ts

HTTP client for external APIs.

```tsx
import { api } from '@/lib/utils/api';

// GET request
const data = await api.get('/users');

// POST request
const user = await api.post('/users', { name: 'John' });

// PUT request
const updated = await api.put('/users/1', { name: 'Jane' });

// DELETE request
await api.delete('/users/1');
```

## Glass Components

### GlassCard

Glassmorphic card component.

```tsx
import { GlassCard } from '@/components/ui/glass';

<GlassCard
  variant="default" | "premium" | "subtle"
  intensity={60}  // 0-100
  animated={true}
  className="p-6"
>
  <Text>Content</Text>
</GlassCard>
```

**Props:**

- `variant` - Card style preset
- `intensity` - Blur intensity (0-100)
- `tint` - iOS tint style
- `animated` - Fade-in animation on mount
- `className` - NativeWind classes
- All `ViewProps`

### GlassButton

Glassmorphic button with animations.

```tsx
import { GlassButton } from '@/components/ui/glass';

<GlassButton
  title="Click Me"
  variant="primary" | "secondary" | "ghost"
  size="sm" | "md" | "lg"
  loading={false}
  disabled={false}
  onPress={() => {}}
  className=""
/>
```

**Props:**

- `title` - Button text (required)
- `variant` - Button style
- `size` - Button size
- `loading` - Show loading spinner
- `disabled` - Disable button
- `intensity` - Blur intensity
- `className` - NativeWind classes
- All `PressableProps`

### GlassModal

Glassmorphic bottom sheet modal.

```tsx
import { GlassModal } from '@/components/ui/glass';

<GlassModal
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  title="Modal Title"
  intensity={80}
  showCloseButton={true}
>
  <Text>Modal content</Text>
</GlassModal>;
```

**Props:**

- `visible` - Modal visibility (required)
- `onClose` - Close handler (required)
- `title` - Modal title
- `intensity` - Blur intensity
- `showCloseButton` - Show close button
- All `ModalProps`

### GlassInput

Glassmorphic text input.

```tsx
import { GlassInput } from '@/components/ui/glass';

<GlassInput
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  intensity={30}
  className=""
/>;
```

**Props:**

- `label` - Input label
- `error` - Error message
- `intensity` - Blur intensity
- `className` - NativeWind classes
- All `TextInputProps`

## Supabase Client

### supabase

Configured Supabase client.

```tsx
import { supabase } from '@/lib/supabase/client';

// Query
const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

// Insert
const { data, error } = await supabase
  .from('profiles')
  .insert({ name: 'John', email: 'john@example.com' });

// Update
const { data, error } = await supabase.from('profiles').update({ name: 'Jane' }).eq('id', userId);

// Delete
const { data, error } = await supabase.from('profiles').delete().eq('id', userId);

// Real-time subscription
const channel = supabase
  .channel('posts')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts',
    },
    (payload) => {
      console.log('Change:', payload);
    }
  )
  .subscribe();
```

## Expo Router

### router

Navigation functions.

```tsx
import { router } from 'expo-router';

// Navigate
router.push('/profile');
router.push({ pathname: '/post/[id]', params: { id: '123' } });

// Replace
router.replace('/login');

// Go back
router.back();

// Set params
router.setParams({ tab: 'settings' });

// Can go back?
if (router.canGoBack()) {
  router.back();
}
```

### useLocalSearchParams

Get route parameters.

```tsx
import { useLocalSearchParams } from 'expo-router';

// app/post/[id].tsx
const { id, title } = useLocalSearchParams<{
  id: string;
  title?: string;
}>();
```

### usePathname

Get current route path.

```tsx
import { usePathname } from 'expo-router';

const pathname = usePathname();
// Returns: "/post/123"
```

### useSegments

Get current route segments.

```tsx
import { useSegments } from 'expo-router';

const segments = useSegments();
// Returns: ["post", "123"]
```

### Link

Declarative navigation.

```tsx
import { Link } from 'expo-router';

<Link href="/profile">
  <Text>Go to Profile</Text>
</Link>

<Link href={{ pathname: '/post/[id]', params: { id: '123' } }}>
  <GlassButton title="View Post" />
</Link>
```

## React Query

### useQuery

Fetch data.

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['profile', userId],
  queryFn: async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!userId,
});
```

### useMutation

Mutate data.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: async (newProfile) => {
    const { data } = await supabase.from('profiles').update(newProfile).eq('id', userId);
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile', userId] });
  },
});

// Usage
mutation.mutate({ name: 'New Name' });
```

### useQueryClient

Access query client.

```tsx
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate queries
queryClient.invalidateQueries({ queryKey: ['profile'] });

// Set query data
queryClient.setQueryData(['profile', userId], newData);

// Get query data
const data = queryClient.getQueryData(['profile', userId]);

// Prefetch
queryClient.prefetchQuery({
  queryKey: ['profile', userId],
  queryFn: fetchProfile,
});
```

## TypeScript Types

### Common Types

```tsx
// User type
interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

// Profile type
interface Profile {
  id: string;
  user_id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
}

// API Response
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

// Status
type Status = 'idle' | 'loading' | 'success' | 'error';
```

## Environment Variables

```tsx
// Available env vars (must start with EXPO_PUBLIC_)
process.env.EXPO_PUBLIC_SUPABASE_URL;
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS;
process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID;
```

## Resources

- [Full Example Code](../lib/)
- [Component Showcase](/components-demo)
- [Supabase Types](https://supabase.com/docs/reference/javascript/typescript-support)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/reference/useQuery)
