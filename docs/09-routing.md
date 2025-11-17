# Routing with Expo Router

Master file-based routing, navigation patterns, deep linking, and protected routes.

## File-Based Routing

Your file structure defines your app's navigation:

```
app/
├── index.tsx              → "/" (home)
├── profile.tsx            → "/profile"
├── settings.tsx           → "/settings"
├── post/[id].tsx          → "/post/:id" (dynamic)
├── (tabs)/                → Group (doesn't affect URL)
│   ├── _layout.tsx        → Tab navigator config
│   ├── home.tsx           → "/home"
│   └── explore.tsx        → "/explore"
└── (auth)/                → Group for auth screens
    ├── _layout.tsx        → Auth stack config
    ├── login.tsx          → "/login"
    └── signup.tsx         → "/signup"
```

## Navigation Basics

### Using `router`

```tsx
import { router } from 'expo-router';

// Navigate to a route
router.push('/profile');

// Replace current screen
router.replace('/login');

// Go back
router.back();

// Navigate with params
router.push({
  pathname: '/post/[id]',
  params: { id: '123', title: 'Hello' }
});

// Set params on current route
router.setParams({ filter: 'new' });
```

### Using `<Link>`

```tsx
import { Link } from 'expo-router';

<Link href="/profile">
  <GlassButton title="View Profile" />
</Link>

// With params
<Link href={{ pathname: '/post/[id]', params: { id: '123' } }}>
  <Text>Read Post</Text>
</Link>

// Replace instead of push
<Link href="/login" replace>
  <Text>Login</Text>
</Link>
```

## Dynamic Routes

### Single Parameter

```tsx
// app/post/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>Post ID: {id}</Text>;
}

// Navigate: router.push('/post/123')
```

### Multiple Parameters

```tsx
// app/user/[userId]/post/[postId].tsx
export default function UserPostScreen() {
  const { userId, postId } = useLocalSearchParams<{
    userId: string;
    postId: string;
  }>();

  return <Text>User {userId}, Post {postId}</Text>;
}

// Navigate: router.push('/user/456/post/789')
```

### Catch-All Routes

```tsx
// app/blog/[...slug].tsx
export default function BlogPost() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();

  // /blog/2025/11/post-title
  // slug = ['2025', '11', 'post-title']

  return <Text>{slug.join('/')}</Text>;
}
```

## Layouts

### Stack Navigator

```tsx
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen
        name="forgot-password"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Reset Password',
        }}
      />
    </Stack>
  );
}
```

### Tab Navigator

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/lib/utils/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.gray[900],
          borderTopColor: colors.gray[800],
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

## Protected Routes

### Auth Guard Pattern

```tsx
// app/(protected)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/login" />;
  }

  // User is authenticated
  return (
    <Stack>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
```

### Redirect After Login

```tsx
// app/login.tsx
import { router, useLocalSearchParams } from 'expo-router';

export default function LoginScreen() {
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();

  const handleLogin = async () => {
    await signIn();
    // Redirect to intended page or default
    router.replace(redirect || '/(tabs)/home');
  };

  return <GlassButton title="Login" onPress={handleLogin} />;
}

// To redirect: router.push('/login?redirect=/profile')
```

## Modals

### Modal Presentation

```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen
    name="settings-modal"
    options={{
      presentation: 'modal',
      headerTitle: 'Settings',
    }}
  />
</Stack>

// Navigate: router.push('/settings-modal')
```

### Custom Modal with BlurView

```tsx
// app/share-modal.tsx
import { GlassModal } from '@/components/ui/glass';
import { router } from 'expo-router';

export default function ShareModal() {
  return (
    <GlassModal
      visible={true}
      onClose={() => router.back()}
      title="Share"
    >
      <Text className="text-white">Share content here</Text>
    </GlassModal>
  );
}
```

## Deep Linking

### Automatic Deep Links

File-based routing creates deep links automatically:

```bash
# These work out of the box:
myapp://
myapp://profile
myapp://post/123
myapp://user/456/post/789

# Web URLs (if deployed):
https://myapp.com/
https://myapp.com/profile
https://myapp.com/post/123
```

### Custom URL Scheme

```json
// app.json
{
  "expo": {
    "scheme": "myapp",
    "web": {
      "bundler": "metro"
    }
  }
}
```

### Universal Links (iOS/Android)

```json
// app.json
{
  "expo": {
    "ios": {
      "associatedDomains": ["applinks:myapp.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "https",
              "host": "myapp.com"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### Handling Deep Links

```tsx
// app/post/[id].tsx
import { useLocalSearchParams, useGlobalSearchParams } from 'expo-router';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Get all URL params (including query strings)
  const allParams = useGlobalSearchParams();

  useEffect(() => {
    // Handle deep link
    if (allParams.comment) {
      scrollToComment(allParams.comment);
    }
  }, [allParams.comment]);

  return <PostView id={id} />;
}

// URL: myapp://post/123?comment=456
```

## Navigation State

### Get Current Route

```tsx
import { usePathname, useSegments } from 'expo-router';

function MyComponent() {
  const pathname = usePathname();
  // Returns: "/post/123"

  const segments = useSegments();
  // Returns: ["post", "123"]

  return <Text>Current: {pathname}</Text>;
}
```

### Navigation Events

```tsx
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

function AnalyticsTracker() {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      // Track screen views
      console.log('Navigation state:', e.data.state);
    });

    return unsubscribe;
  }, [navigation]);

  return null;
}
```

## Advanced Patterns

### Nested Navigators

```tsx
// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Feed' }} />
      <Stack.Screen name="post/[id]" options={{ title: 'Post' }} />
    </Stack>
  );
}

// Structure:
// (tabs)/home/index.tsx        → Feed in home tab
// (tabs)/home/post/[id].tsx    → Post detail in home tab
```

### Conditional Navigation

```tsx
function WelcomeScreen() {
  const { user } = useAuth();
  const { onboardingCompleted } = useAppStore();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (!onboardingCompleted) {
      router.replace('/onboarding');
    } else {
      router.replace('/(tabs)/home');
    }
  }, [user, onboardingCompleted]);

  return <LoadingScreen />;
}
```

### Drawer Navigator

```tsx
// Install: npx expo install @react-navigation/drawer

// app/_layout.tsx
import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="profile" options={{ drawerLabel: 'Profile' }} />
    </Drawer>
  );
}
```

## TypeScript Support

### Typed Routes

```tsx
import { router } from 'expo-router';

// Type-safe navigation
router.push('/post/123');  // ✅ Valid route
router.push('/invalid');   // ❌ TypeScript error (if configured)
```

### Typed Params

```tsx
import { useLocalSearchParams } from 'expo-router';

type Params = {
  id: string;
  title?: string;
  category?: string;
};

function PostScreen() {
  const params = useLocalSearchParams<Params>();

  // params.id is string
  // params.title is string | undefined
  // params.category is string | undefined
}
```

## Best Practices

1. **Use groups** - `(auth)`, `(tabs)` for organization without affecting URLs
2. **Colocate related screens** - Keep related screens in same folder
3. **Protect routes** - Use `_layout.tsx` for auth guards
4. **Type params** - Always type `useLocalSearchParams`
5. **Handle redirects** - Save intended route before login redirect
6. **Test deep links** - Test all routes work via deep links

## Common Patterns

### Bottom Sheet Navigation

```tsx
import { router } from 'expo-router';

<GlassButton
  title="Open Options"
  onPress={() => router.push('/options-sheet')}
/>

// app/options-sheet.tsx with presentation: 'modal'
```

### Tab Press to Scroll Top

```tsx
import { useNavigation } from 'expo-router';

function HomeTab() {
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
    return unsubscribe;
  }, [navigation]);

  return <ScrollView ref={scrollRef}>...</ScrollView>;
}
```

## Resources

- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Navigation Patterns](https://docs.expo.dev/router/advanced/root-layout/)
- [Deep Linking Guide](https://docs.expo.dev/guides/linking/)
