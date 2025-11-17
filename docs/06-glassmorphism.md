# Glassmorphism & Liquid Glass Effects

Learn how to create beautiful glassmorphic UI components with blur effects, transparency, and Apple-style Liquid Glass designs.

## What is Glassmorphism?

Glassmorphism is a design trend featuring:
- **Frosted glass appearance** with background blur
- **Semi-transparent layers** with subtle borders
- **Depth and hierarchy** through layering
- **Modern, premium aesthetic** popularized by Apple

## Libraries We Use

### expo-blur
Native blur component for iOS and Android.

```bash
npx expo install expo-blur
```

Already installed in this starter!

### react-native-reanimated
For smooth 60fps animations (already installed).

## Basic Usage

### Simple Glass Card

```tsx
import { BlurView } from 'expo-blur';

function GlassCard() {
  return (
    <BlurView
      intensity={60}
      tint="systemMaterialDark"
      className="rounded-2xl overflow-hidden border border-white/10"
    >
      <View className="p-6 bg-white/5">
        <Text className="text-white font-bold">Glass Effect</Text>
      </View>
    </BlurView>
  );
}
```

### BlurView Props

| Prop | Type | Description |
|------|------|-------------|
| `intensity` | number | Blur strength (0-100) |
| `tint` | string | `'light'`, `'dark'`, `'default'`, `'systemMaterialDark'`, etc. |
| `className` | string | NativeWind classes |

## Pre-built Glass Components

We've created reusable glass components in `components/ui/glass/`.

### GlassCard

```tsx
import { GlassCard } from '@/components/ui/glass';

<GlassCard variant="premium" intensity={80}>
  <Text className="text-white">Content goes here</Text>
</GlassCard>
```

**Variants:**
- `default` - Standard glass effect
- `premium` - Enhanced blur and rounded corners
- `subtle` - Minimal glass effect

### GlassButton

```tsx
import { GlassButton } from '@/components/ui/glass';

<GlassButton
  title="Get Started"
  variant="primary"
  size="lg"
  onPress={handlePress}
  loading={isLoading}
/>
```

**Features:**
- Press animations with spring physics
- Loading state with spinner
- Three variants: `primary`, `secondary`, `ghost`
- Three sizes: `sm`, `md`, `lg`

### GlassInput

```tsx
import { GlassInput } from '@/components/ui/glass';

<GlassInput
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>
```

### GlassModal

```tsx
import { GlassModal } from '@/components/ui/glass';

const [visible, setVisible] = useState(false);

<GlassModal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Settings"
  intensity={80}
>
  <Text className="text-white">Modal content</Text>
</GlassModal>
```

**Features:**
- Smooth slide-in/slide-out animations
- Backdrop blur with dismissal
- Auto-closes on backdrop tap
- Optional close button

## Interactive Demo

Navigate to the **Components Demo** page to see all glass components in action:

```tsx
// In your app
import { router } from 'expo-router';

router.push('/components-demo');
```

Or run the app and navigate to `/components-demo` in Expo Go.

## Styling with NativeWind

Glass components work seamlessly with NativeWind classes:

```tsx
<GlassCard className="mx-4 my-2 shadow-2xl">
  <View className="p-6">
    <Text className="text-white text-2xl font-bold mb-2">
      Combine with Tailwind
    </Text>
    <Text className="text-white/70">
      Use all your familiar Tailwind classes!
    </Text>
  </View>
</GlassCard>
```

## Animations

### Animated Glass Card

```tsx
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.duration(600).springify()}>
  <GlassCard variant="premium">
    <Text className="text-white">Animated entrance!</Text>
  </GlassCard>
</Animated.View>
```

### Press Animations

```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedGlassCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = 0.95)}
      onPressOut={() => (scale.value = 1)}
      style={animatedStyle}
    >
      <GlassCard>
        <Text className="text-white">Press me!</Text>
      </GlassCard>
    </AnimatedPressable>
  );
}
```

## Performance Tips

### 1. Limit Blur Views

BlurView uses GPU resources. Limit to **2-3 per screen**.

```tsx
// ❌ Too many blurs - slow!
<ScrollView>
  {items.map(item => (
    <BlurView key={item.id}>...</BlurView>
  ))}
</ScrollView>

// ✅ Better - single blur container
<BlurView>
  <ScrollView>
    {items.map(item => (
      <View key={item.id}>...</View>
    ))}
  </ScrollView>
</BlurView>
```

### 2. Adjust Intensity for Devices

Lower intensity on older devices:

```tsx
import { Platform } from 'react-native';

const intensity = Platform.select({
  ios: 80,
  android: 60, // Android blur is heavier
});

<BlurView intensity={intensity} />
```

### 3. Avoid Nesting BlurViews

```tsx
// ❌ Bad - nested blurs
<BlurView intensity={80}>
  <BlurView intensity={60}>
    <Text>Content</Text>
  </BlurView>
</BlurView>

// ✅ Good - single blur
<BlurView intensity={80}>
  <View className="bg-white/5">
    <Text>Content</Text>
  </View>
</BlurView>
```

## Apple Liquid Glass (iOS 26+)

For the latest iOS Liquid Glass effect:

```bash
npm install @callstack/liquid-glass
```

```tsx
import { LiquidGlass } from '@callstack/liquid-glass';

<LiquidGlass style={{ borderRadius: 20 }}>
  <View className="p-6">
    <Text className="text-white">iOS 26+ Liquid Glass</Text>
  </View>
</LiquidGlass>
```

**Features:**
- Real-time GPU-accelerated blur
- Reflection and refraction effects
- iOS 26+ only (gracefully degrades to BlurView on older versions)

## Complete Example

```tsx
import { ImageBackground, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/glass';
import { useState } from 'react';

export default function GlassExample() {
  const [email, setEmail] = useState('');

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
      className="flex-1"
    >
      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/40" />

      <SafeAreaView className="flex-1 p-4 justify-center">
        <GlassCard variant="premium" intensity={80} className="p-6">
          <Text className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </Text>
          <Text className="text-white/70 mb-6">
            Sign in to your account
          </Text>

          <GlassInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className="mb-4"
          />

          <GlassInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            className="mb-6"
          />

          <GlassButton
            title="Sign In"
            variant="primary"
            size="lg"
            onPress={() => console.log('Sign in')}
          />
        </GlassCard>
      </SafeAreaView>
    </ImageBackground>
  );
}
```

## Tint Options

| Tint | Description | Best For |
|------|-------------|----------|
| `systemMaterialDark` | iOS system dark blur | Dark backgrounds |
| `systemMaterialLight` | iOS system light blur | Light backgrounds |
| `dark` | Dark tint | Photos, videos |
| `light` | Light tint | Bright images |
| `default` | Adaptive | Auto light/dark |

## Common Patterns

### Card with Header

```tsx
<GlassCard variant="premium">
  <View className="p-6 border-b border-white/10">
    <Text className="text-white text-xl font-bold">Header</Text>
  </View>
  <View className="p-6">
    <Text className="text-white/70">Content goes here</Text>
  </View>
</GlassCard>
```

### Stats Dashboard

```tsx
<View className="flex-row gap-3">
  <GlassCard className="flex-1 p-4 items-center">
    <Text className="text-3xl font-bold text-white">1.2K</Text>
    <Text className="text-white/70 text-sm">Followers</Text>
  </GlassCard>

  <GlassCard className="flex-1 p-4 items-center">
    <Text className="text-3xl font-bold text-white">342</Text>
    <Text className="text-white/70 text-sm">Posts</Text>
  </GlassCard>
</View>
```

### Bottom Sheet

```tsx
<GlassModal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Options"
>
  <View className="gap-3">
    <GlassButton title="Edit" variant="secondary" />
    <GlassButton title="Share" variant="secondary" />
    <GlassButton title="Delete" variant="ghost" />
  </View>
</GlassModal>
```

## Troubleshooting

### Blur not visible

1. Ensure `overflow-hidden` is set on BlurView
2. Add background color: `bg-white/5`
3. Check that content behind blur exists

### Performance issues

1. Reduce number of BlurViews
2. Lower intensity value
3. Use `intensity={Platform.select({ ios: 80, android: 60 })}`

### Border not showing

```tsx
// ✅ Add border with alpha
className="border border-white/10"

// ❌ Solid borders don't work well
className="border border-white"
```

## Next Steps

- See all components in action: [/components-demo](/components-demo)
- Learn animations: [Animations Guide](./05-animations.md)
- Build your UI: [Components Guide](./04-components.md)

## Resources

- [expo-blur docs](https://docs.expo.dev/versions/latest/sdk/blur-view/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Callstack Liquid Glass Guide](https://www.callstack.com/blog/how-to-use-liquid-glass-in-react-native)
