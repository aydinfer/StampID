# Troubleshooting

Common issues and solutions when building with this starter.

## Installation Issues

### ⚠️ CRITICAL: React 19 Peer Dependency Issues

**Symptoms:**

```
npm ERR! ERESOLVE could not resolve
npm ERR! peer react@"^19.2.0" from react-dom@19.2.0
npm ERR! Conflicting peer dependency: react@19.2.0
```

**Root Cause:**
Expo SDK 54 requires **React 19.1.0** specifically. The React ecosystem is still catching up to React 19, causing peer dependency conflicts during installation.

**❌ WRONG Solution (DO NOT DO THIS):**

```bash
# DO NOT downgrade to React 18!
npm install react@18.3.1  # ❌ Wrong! Expo 54 expects React 19
```

**✅ CORRECT Solution:**

Use `--legacy-peer-deps` to install with React 19.1.0 (the version Expo 54 expects):

```bash
# Clean install with correct dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

If you accidentally downgraded, reinstall the correct versions:

```bash
npm install react@19.1.0 react-dom@19.1.0 react-native@0.81.5 --legacy-peer-deps
```

**Why `--legacy-peer-deps`?**

- Expo 54 was released with React 19 support
- Some ecosystem packages haven't updated their peer dependencies yet
- The flag allows npm to proceed despite peer dependency warnings
- This is **normal** for cutting-edge Expo versions

**Metro Warning After Install:**
If you see this warning, it confirms React 19 is correct:

```
⚠️  The following packages should be updated for best compatibility:
   react@19.1.0 - expected version: 19.1.0 ✅
```

**Key Principle:**

> Always use the **latest compatible dependencies** for your Expo SDK version.
> Never downgrade major versions (React 19 → 18) to fix peer dependency warnings.
> Use `--legacy-peer-deps` when the ecosystem is catching up.

### Missing babel-preset-expo

**Symptoms:**

```
ERROR node_modules/expo-router/entry.js: Cannot find module 'babel-preset-expo'
```

**Solution:**

```bash
npm install --save-dev babel-preset-expo --legacy-peer-deps
npx expo start --clear
```

This is a required dev dependency for Expo projects that's sometimes missing after installation.

### Missing react-native-worklets-core (Reanimated Issue)

**Symptoms:**

```
ERROR Cannot find module 'react-native-worklets/plugin'
Require stack:
- /path/to/react-native-reanimated/plugin/index.js
```

**Root Cause:**
React Native Reanimated 4.x requires `react-native-worklets-core` but it's not always installed as a peer dependency with React 19.

**Solution:**

```bash
npm install react-native-worklets-core --legacy-peer-deps
npx expo start --clear
```

This is another React 19 ecosystem catch-up issue. The worklets plugin is required for Reanimated's UI thread execution.

### Metro Bundler Won't Start

**Symptoms:**

```
Error: ENOSPC: System limit for number of file watchers reached
```

**Solution (Linux):**

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

**Solution (macOS/Windows):**

```bash
# Clear cache and restart
npx expo start --clear
```

### Dependency Conflicts

**Symptoms:**

```
npm ERR! ERESOLVE could not resolve
```

**Solution:**

```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force
npm install --force

# Or use Yarn
yarn install
```

### TypeScript Errors After Install

**Symptoms:**

```
Cannot find module '@/lib/...' or its corresponding type declarations
```

**Solution:**

```bash
# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or rebuild
npx tsc --build --clean
npx tsc --noEmit
```

## Runtime Issues

### White Screen on Startup

**Possible Causes:**

1. JavaScript error before render
2. Missing font loading
3. Expo Router misconfiguration

**Debug Steps:**

```bash
# 1. Check Metro logs
npx expo start

# 2. Enable remote debugging
# Shake device → Enable Remote JS Debugging

# 3. Check for errors in console
```

**Common Fix:**

```tsx
// app/_layout.tsx
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Your fonts
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <Stack />;
}
```

### NativeWind Styles Not Applying

**Symptoms:**

```tsx
<View className="bg-primary-500" /> // No background color
```

**Checklist:**

1. Is `global.css` imported in `_layout.tsx`?
2. Is `metro.config.js` configured with NativeWind plugin?
3. Is `babel.config.js` using NativeWind preset?
4. Did you restart Metro after config changes?

**Solution:**

```bash
# 1. Clear cache
npx expo start --clear

# 2. Check babel.config.js
module.exports = {
  presets: [
    ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    "nativewind/babel",
  ],
};

# 3. Check metro.config.js
const { withNativeWind } = require('nativewind/metro');
module.exports = withNativeWind(config, { input: './global.css' });

# 4. Import in app/_layout.tsx
import '../global.css';
```

### BlurView Not Working

**Symptoms:**

```tsx
<BlurView intensity={80} /> // No blur effect
```

**Common Issues:**

1. **Missing `overflow-hidden`:**

```tsx
// ❌ Bad
<BlurView intensity={80} className="rounded-2xl">

// ✅ Good
<BlurView intensity={80} className="rounded-2xl overflow-hidden">
```

2. **No content behind blur:**

```tsx
// ❌ Bad - Nothing to blur
<BlurView intensity={80}>
  <Text>Content</Text>
</BlurView>

// ✅ Good - Background to blur
<ImageBackground source={...}>
  <BlurView intensity={80}>
    <Text>Content</Text>
  </BlurView>
</ImageBackground>
```

3. **Missing background color:**

```tsx
<BlurView intensity={80} className="overflow-hidden">
  <View className="bg-white/5">
    {' '}
    {/* Add this! */}
    <Text>Content</Text>
  </View>
</BlurView>
```

## Supabase Issues

### Authentication Not Persisting

**Symptoms:**
User logs in but session is lost on app restart.

**Solution:**

```tsx
// lib/supabase/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage, // Make sure this is set!
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### CORS Errors on Web

**Symptoms:**

```
Access to fetch at 'https://xxx.supabase.co' has been blocked by CORS policy
```

**Solution:**
Add your web URL to Supabase allowed origins:

1. Go to Supabase Dashboard
2. Settings → API
3. Add `http://localhost:8081` to allowed origins

### RLS Policies Blocking Queries

**Symptoms:**

```
Row level security policy violation
```

**Debug:**

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Temporarily disable for testing (DON'T DO IN PRODUCTION!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**Solution:**
Create proper RLS policies:

```sql
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## React Query Issues

### Infinite Refetching Loop

**Symptoms:**
Network tab shows continuous refetching.

**Cause:**
Query key changes on every render.

**Solution:**

```tsx
// ❌ Bad - New array every render
useQuery({
  queryKey: ['todos', { status: filter }], // New object!
  queryFn: fetchTodos,
});

// ✅ Good - Stable query key
useQuery({
  queryKey: ['todos', filter], // Primitive value
  queryFn: fetchTodos,
});
```

### Stale Data Not Updating

**Symptoms:**
UI shows old data even after mutation.

**Solution:**

```tsx
const mutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    // Invalidate query to refetch
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  },
});
```

## Build Errors

### TypeScript Build Fails

**Symptoms:**

```
error TS2304: Cannot find name 'View'
```

**Solution:**

```bash
# Check tsconfig.json has correct types
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}

# Install React Native types
npm install --save-dev @types/react @types/react-native
```

### EAS Build Fails

**Common Errors:**

1. **Missing credentials:**

```bash
eas credentials
# Follow prompts to set up Apple/Google credentials
```

2. **Environment variables not set:**

```bash
eas secret:list
eas secret:create --name SUPABASE_URL --value https://...
```

3. **Out of memory:**

```json
// eas.json
{
  "build": {
    "production": {
      "node": "18",
      "env": {
        "NODE_OPTIONS": "--max-old-space-size=4096"
      }
    }
  }
}
```

## Expo Router Issues

### 404 on Navigation

**Symptoms:**

```tsx
router.push('/profile'); // Shows "Unmatched Route"
```

**Solution:**
Check file exists at correct path:

```
app/
└── profile.tsx  ← Must exist!
```

### Params Not Received

**Symptoms:**

```tsx
const { id } = useLocalSearchParams(); // id is undefined
```

**Solution:**

```tsx
// Make sure file is named correctly
// app/post/[id].tsx  ← Must have brackets!

// And navigate with params
router.push({
  pathname: '/post/[id]',
  params: { id: '123' },
});
```

### Layout Not Applied

**Symptoms:**
Tabs/Stack not showing.

**Solution:**

```tsx
// app/(tabs)/_layout.tsx must export default
export default function TabLayout() {
  return <Tabs>...</Tabs>;
}

// And screens must be registered
<Tabs>
  <Tabs.Screen name="home" /> {/* app/(tabs)/home.tsx */}
  <Tabs.Screen name="explore" /> {/* app/(tabs)/explore.tsx */}
</Tabs>;
```

## Performance Issues

### Slow FlatList Scrolling

**Solution:**

```tsx
<FlatList
  data={items}
  renderItem={({ item }) => <MemoizedItem item={item} />}
  keyExtractor={(item) => item.id}
  // Add these performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>;

// Memoize list items
const MemoizedItem = React.memo(ListItem);
```

### Animations Janky

**Solution:**

```tsx
// Use Reanimated instead of Animated API
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: withTiming(position.value) }],
}));

return <Animated.View style={animatedStyle} />;
```

### Too Many BlurViews

**Symptoms:**
App lags with multiple glassmorphic components.

**Solution:**
Limit to 2-3 BlurViews per screen. Use single container:

```tsx
// ❌ Bad
<FlatList
  data={items}
  renderItem={() => <BlurView>...</BlurView>}
/>

// ✅ Good
<BlurView>
  <FlatList
    data={items}
    renderItem={() => <View>...</View>}
  />
</BlurView>
```

## Debugging Tips

### Enable Debug Mode

```bash
# Start with debugging
npx expo start --dev-client

# In app: Shake device or Cmd+D (iOS) / Cmd+M (Android)
# → Enable Remote JS Debugging
```

### React DevTools

```bash
npm install -g react-devtools
react-devtools
```

### Network Inspector (Flipper)

1. Install Flipper desktop
2. Enable Network plugin
3. View all API requests

### Console Logs

```tsx
// Debug renders
useEffect(() => {
  console.log('Component rendered', props);
});

// Debug state changes
useEffect(() => {
  console.log('State changed:', state);
}, [state]);
```

## Getting Help

1. **Check logs first:**
   - Metro bundler output
   - Device console (Xcode/Android Studio)
   - Browser console (for web)

2. **Search GitHub Issues:**
   - [Expo Router Issues](https://github.com/expo/expo/issues)
   - [NativeWind Issues](https://github.com/marklawlor/nativewind/issues)
   - [Supabase Issues](https://github.com/supabase/supabase/issues)

3. **Ask for help:**
   - [Expo Discord](https://chat.expo.dev/)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
   - This repo's [Discussions](https://github.com/aydinfer/Expo-Starter/discussions)

## Common Error Messages

| Error                                                          | Cause                              | Solution                                            |
| -------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------- |
| `Invariant Violation: "main" has not been registered`          | Entry point misconfigured          | Check `"main": "expo-router/entry"` in package.json |
| `Unable to resolve module`                                     | Missing dependency                 | `npm install <module>`                              |
| `Unexpected token '<'`                                         | Wrong file extension               | Rename `.js` to `.tsx` for JSX                      |
| `Objects are not valid as a React child`                       | Rendering object instead of string | Use `JSON.stringify()` or extract value             |
| `Maximum update depth exceeded`                                | setState in render                 | Move to useEffect or event handler                  |
| `Can't perform a React state update on an unmounted component` | Async operation after unmount      | Use cleanup function or React Query                 |

## Reset Everything

When all else fails:

```bash
# Nuclear option
rm -rf node_modules
rm package-lock.json
npm install

# Clear all caches
npx expo start --clear
rm -rf .expo
rm -rf ios/build
rm -rf android/build

# Reset Metro
watchman watch-del-all
```

## Resources

- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Supabase Debugging](https://supabase.com/docs/guides/getting-started/debugging)
