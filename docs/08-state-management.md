# State Management

Learn when and how to use React Query for server state and Zustand for client state.

## Philosophy: Two-Library Approach

We use **two specialized libraries** instead of one do-it-all solution:

| Library         | Use For                 | Why                                     |
| --------------- | ----------------------- | --------------------------------------- |
| **React Query** | Server state (API data) | Caching, refetching, optimistic updates |
| **Zustand**     | Client state (UI state) | Simple, fast, no boilerplate            |

## React Query (Server State)

### What is Server State?

Data that lives on a server:

- User profiles
- Posts, comments
- Real-time data
- Database records

**Key characteristics:**

- Asynchronous
- Can be stale
- Shared across users
- Needs caching

### Basic Usage

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

function ProfileScreen() {
  // Fetch data
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').single();
      return data;
    },
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return <Text>{profile.name}</Text>;
}
```

### Mutations (Updates)

```tsx
function UpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newProfile: Profile) => {
      const { data } = await supabase.from('profiles').update(newProfile).eq('id', user.id);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return (
    <GlassButton
      title="Update"
      loading={mutation.isPending}
      onPress={() => mutation.mutate({ name: 'New Name' })}
    />
  );
}
```

### Optimistic Updates

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update UI
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);

    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  onSettled: () => {
    // Always refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

### Custom Hook Pattern

```tsx
// lib/hooks/useProfile.ts
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Partial<Profile>) => {
      const { data, error } = await supabase.from('profiles').update(profile).eq('id', profile.id);

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.id] });
    },
  });
}

// Usage in component
function Profile() {
  const { data: profile } = useProfile(userId);
  const updateProfile = useUpdateProfile();

  return <GlassButton title="Update" onPress={() => updateProfile.mutate({ name: 'New Name' })} />;
}
```

## Zustand (Client State)

### What is Client State?

UI state that doesn't need to persist on server:

- Theme (dark/light mode)
- Modals open/closed
- Selected tab
- Form state
- Onboarding completed

### Basic Store

```tsx
// lib/store/appStore.ts
import { create } from 'zustand';

interface AppStore {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;

  modalVisible: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  modalVisible: false,
  openModal: () => set({ modalVisible: true }),
  closeModal: () => set({ modalVisible: false }),
}));

// Usage
function ThemeToggle() {
  const { theme, setTheme } = useAppStore();

  return (
    <GlassButton
      title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    />
  );
}
```

### Persistence with AsyncStorage

```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAppStore = create(
  persist<AppStore>(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      onboardingCompleted: false,
      completeOnboarding: () => set({ onboardingCompleted: true }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### Selector Pattern (Performance)

```tsx
// ❌ Bad - Re-renders on ANY store change
function Counter() {
  const store = useAppStore();
  return <Text>{store.count}</Text>;
}

// ✅ Good - Only re-renders when count changes
function Counter() {
  const count = useAppStore((state) => state.count);
  return <Text>{count}</Text>;
}
```

### Multiple Stores

```tsx
// lib/store/authStore.ts
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// lib/store/cartStore.ts
export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
```

## When to Use Which?

### Use React Query for:

- ✅ API data (GET, POST, PUT, DELETE)
- ✅ Database queries
- ✅ Data that can be stale
- ✅ Pagination, infinite scroll
- ✅ Real-time subscriptions (with Supabase)
- ✅ Shared data across screens

### Use Zustand for:

- ✅ UI state (modals, selected items)
- ✅ Theme/preferences
- ✅ Form state (complex forms)
- ✅ App-wide flags (onboarding, first launch)
- ✅ Shopping cart (before checkout)
- ✅ Local-only data

### ❌ Don't Use Either for:

- Simple component state → `useState`
- Parent-child communication → Props
- Form libraries → React Hook Form

## Common Patterns

### Protected Routes with Zustand

```tsx
// app/(protected)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProtectedLayout() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Stack />;
}
```

### Infinite Scroll with React Query

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

function FeedScreen() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .range(pageParam, pageParam + 9);
      return data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length * 10 : undefined;
    },
  });

  return (
    <FlatList
      data={data?.pages.flat()}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
    />
  );
}
```

### Real-time with Supabase + React Query

```tsx
function useRealtimePosts() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
}
```

## Setup (Already Done!)

Both libraries are already configured in this starter:

```tsx
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
    </QueryClientProvider>
  );
}
```

Zustand works out of the box - no provider needed!

## Best Practices

1. **Colocate hooks** - Keep query hooks near components that use them
2. **Use queryKey consistently** - Same key for same data
3. **Destructure selectively** - Only select what you need from Zustand
4. **Avoid nested stores** - Keep Zustand flat
5. **Separate concerns** - Server state in React Query, UI state in Zustand

## Resources

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Our useData.ts example](../lib/hooks/useData.ts)
- [Our appStore.ts example](../lib/store/appStore.ts)
