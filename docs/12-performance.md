# Performance Optimization

Techniques to keep your app running at 60fps with optimal bundle size.

## Performance Principles

1. **Measure first** - Don't optimize without data
2. **60fps is the goal** - Smooth animations matter
3. **Bundle size impacts TTI** - Time to interactive
4. **Memory matters** - Especially on older devices

## React Native Performance

### Use React.memo for Heavy Components

```tsx
// ❌ Re-renders on every parent update
function ExpensiveComponent({ data }) {
  return <ComplexView data={data} />;
}

// ✅ Only re-renders when data changes
const ExpensiveComponent = React.memo(({ data }) => {
  return <ComplexView data={data} />;
});
```

### useMemo and useCallback

```tsx
function ProfileScreen({ userId }) {
  // ✅ Memoize expensive calculations
  const processedData = useMemo(() => {
    return expensiveCalculation(rawData);
  }, [rawData]);

  // ✅ Memoize callbacks for child components
  const handlePress = useCallback(() => {
    doSomething(userId);
  }, [userId]);

  return <Child onPress={handlePress} data={processedData} />;
}
```

### FlatList Optimization

```tsx
<FlatList
  data={items}
  renderItem={({ item }) => <ListItem item={item} />}
  keyExtractor={(item) => item.id}
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  updateCellsBatchingPeriod={50}
  // Optimization
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Image Optimization

```tsx
import { Image } from 'expo-image';

// ✅ Use expo-image (faster than RN Image)
<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>

// ✅ Resize images
<Image
  source={{ uri: 'https://example.com/large.jpg' }}
  style={{ width: 100, height: 100 }}
  contentFit="cover"
/>

// ❌ Don't use massive images
<Image
  source={{ uri: 'https://example.com/8k-image.jpg' }}
  style={{ width: 100, height: 100 }}
/>
```

## Animation Performance

### Use React Native Reanimated

```tsx
// ❌ Bad - Runs on JS thread
Animated.timing(value, {
  toValue: 100,
  duration: 300,
}).start();

// ✅ Good - Runs on UI thread
import Animated, { withTiming } from 'react-native-reanimated';

value.value = withTiming(100, { duration: 300 });
```

### Avoid Layout Animations

```tsx
// ❌ Bad - Causes layout recalculation
<Animated.View style={{ height: animatedHeight }}>
  <Text>Content</Text>
</Animated.View>

// ✅ Good - Use transform instead
<Animated.View style={{ transform: [{ scaleY: animatedScale }] }}>
  <Text>Content</Text>
</Animated.View>
```

### Use useAnimatedStyle

```tsx
// ✅ Optimized animated styles
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: position.value }],
    opacity: opacity.value,
  };
});

return <Animated.View style={animatedStyle} />;
```

## Bundle Size Optimization

### Analyze Bundle

```bash
# Analyze what's in your bundle
npx react-native-bundle-visualizer
```

### Import Only What You Need

```tsx
// ❌ Bad - Imports entire library
import _ from 'lodash';
const result = _.debounce(fn, 500);

// ✅ Good - Import specific function
import debounce from 'lodash/debounce';
const result = debounce(fn, 500);

// ✅ Better - Use native or write your own
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
```

### Code Splitting with Dynamic Imports

```tsx
// Lazy load heavy screens
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SettingsScreen />
    </Suspense>
  );
}
```

### Remove Development Code

```tsx
// Use __DEV__ flag
if (__DEV__) {
  console.log('Debug info');
}

// Or babel-plugin-transform-remove-console in production
```

## NativeWind Performance

### Limit className Usage

```tsx
// ❌ Bad - Too many classes
<View className="flex flex-row items-center justify-center p-4 mt-2 mb-4 mx-2 bg-primary-500 rounded-xl shadow-lg border border-white/10">

// ✅ Better - Extract to component
<GlassCard variant="premium" className="p-4">
```

### Use StyleSheet for Static Styles

```tsx
// ✅ Mix NativeWind with StyleSheet
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Static styles here
  },
});

<View style={styles.container} className="bg-primary-500">
```

## Glassmorphism Performance

### Limit BlurView Usage

```tsx
// ❌ Bad - Too many BlurViews
<ScrollView>
  {items.map(item => (
    <BlurView key={item.id}>...</BlurView>
  ))}
</ScrollView>

// ✅ Good - Single BlurView container
<BlurView>
  <ScrollView>
    {items.map(item => (
      <View key={item.id}>...</View>
    ))}
  </ScrollView>
</BlurView>
```

### Adjust Intensity

```tsx
// ❌ Bad - High intensity everywhere
<BlurView intensity={100} />

// ✅ Good - Lower intensity
<BlurView intensity={60} />

// ✅ Best - Adjust per platform
<BlurView
  intensity={Platform.select({
    ios: 80,
    android: 50, // Android blur is heavier
  })}
/>
```

## React Query Performance

### Set Appropriate staleTime

```tsx
// ❌ Bad - Refetches too often
useQuery({
  queryKey: ['profile'],
  queryFn: fetchProfile,
  // Default staleTime: 0 (always refetch)
});

// ✅ Good - Cache for 5 minutes
useQuery({
  queryKey: ['profile'],
  queryFn: fetchProfile,
  staleTime: 5 * 60 * 1000,
});
```

### Use Query Selectors

```tsx
// ❌ Bad - Re-renders for any data change
const { data } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
const completedCount = data?.filter((t) => t.completed).length;

// ✅ Good - Only re-renders when count changes
const completedCount = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  select: (data) => data.filter((t) => t.completed).length,
});
```

### Prefetch Data

```tsx
const queryClient = useQueryClient();

// Prefetch on hover/focus
const handleHover = () => {
  queryClient.prefetchQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
  });
};
```

## Zustand Performance

### Use Selectors

```tsx
// ❌ Bad - Re-renders on ANY store change
const store = useAppStore();

// ✅ Good - Only re-renders when theme changes
const theme = useAppStore((state) => state.theme);
```

### Split Large Stores

```tsx
// ❌ Bad - One giant store
const useStore = create((set) => ({
  user: null,
  theme: 'dark',
  cart: [],
  notifications: [],
  // ... 50 more fields
}));

// ✅ Good - Multiple focused stores
const useAuthStore = create((set) => ({ user: null, ... }));
const useThemeStore = create((set) => ({ theme: 'dark', ... }));
const useCartStore = create((set) => ({ items: [], ... }));
```

## Profiling Tools

### React DevTools Profiler

```tsx
import { Profiler } from 'react';

<Profiler
  id="ProfileScreen"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} took ${actualDuration}ms`);
  }}
>
  <ProfileScreen />
</Profiler>;
```

### Flipper

1. Install Flipper desktop app
2. Enable React DevTools plugin
3. Profile renders and network requests

### Performance Monitor

```tsx
import { PerformanceObserver } from 'react-native';

if (__DEV__) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`);
    });
  });

  observer.observe({ entryTypes: ['measure'] });
}
```

## Memory Optimization

### Clean Up Effects

```tsx
useEffect(() => {
  const subscription = supabase.channel('posts').on('*', handleChange).subscribe();

  // ✅ Always clean up
  return () => {
    supabase.removeChannel(subscription);
  };
}, []);
```

### Avoid Memory Leaks

```tsx
// ❌ Bad - setState after unmount
useEffect(() => {
  fetchData().then((data) => {
    setData(data); // Component might be unmounted!
  });
}, []);

// ✅ Good - Check if mounted
useEffect(() => {
  let isMounted = true;

  fetchData().then((data) => {
    if (isMounted) {
      setData(data);
    }
  });

  return () => {
    isMounted = false;
  };
}, []);

// ✅ Better - Use React Query (handles this automatically)
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
});
```

## Network Performance

### Batch Requests

```tsx
// ❌ Bad - Multiple requests
const user = await fetchUser(userId);
const posts = await fetchPosts(userId);
const comments = await fetchComments(userId);

// ✅ Good - Single request
const { user, posts, comments } = await fetchUserData(userId);
```

### Use Pagination

```tsx
// ✅ Infinite scroll with React Query
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
});
```

### Cache API Responses

React Query handles this automatically! But for custom API:

```tsx
const cache = new Map();

async function fetchWithCache(key, fetcher) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await fetcher();
  cache.set(key, data);

  setTimeout(() => cache.delete(key), 5 * 60 * 1000); // 5min TTL

  return data;
}
```

## Startup Time Optimization

### Lazy Load Heavy Imports

```tsx
// ❌ Bad - Loads on startup
import { HeavyLibrary } from 'heavy-library';

// ✅ Good - Loads when needed
const loadHeavyLibrary = async () => {
  const { HeavyLibrary } = await import('heavy-library');
  return HeavyLibrary;
};
```

### Defer Non-Critical Work

```tsx
useEffect(() => {
  // ✅ Run after render
  InteractionManager.runAfterInteractions(() => {
    // Non-critical work here
    analytics.track('screen_view');
  });
}, []);
```

## Checklist

### Before Every Release

- [ ] Run bundle analyzer
- [ ] Test on low-end device
- [ ] Check FlatList scroll performance
- [ ] Verify animations at 60fps
- [ ] Test BlurView performance
- [ ] Check memory usage (< 200MB)
- [ ] Verify app size (< 50MB)
- [ ] Test cold start time (< 3s)

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Reanimated Performance](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#ui-thread)
- [React Query Performance](https://tanstack.com/query/latest/docs/react/guides/render-optimizations)
- [Flipper](https://fbflipper.com/)
