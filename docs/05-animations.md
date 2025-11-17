# Animations Guide

How to create smooth 60fps animations with React Native Reanimated.

## Why Reanimated?

React Native Reanimated runs animations on the **UI thread**, not the JavaScript thread. This means:
- ✅ 60fps smooth animations
- ✅ Animations continue even if JS is busy
- ✅ Gestures feel native
- ✅ Better performance than Animated API

## Basic Animations

### Fade In

```tsx
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

export function FadeIn() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text>I fade in!</Text>
    </Animated.View>
  );
}
```

### Slide In

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

export function SlideIn() {
  const translateY = useSharedValue(100);

  useEffect(() => {
    translateY.value = withSpring(0);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="p-4 bg-white rounded-lg">
      <Text>I slide in from bottom!</Text>
    </Animated.View>
  );
}
```

### Scale Animation

```tsx
export function ScaleButton() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={animatedStyle} className="bg-primary-500 p-4 rounded-lg">
        <Text className="text-white font-bold">Press Me</Text>
      </Animated.View>
    </Pressable>
  );
}
```

## Animation Timing

### withTiming (Linear)

```tsx
// Smooth linear animation
opacity.value = withTiming(1, {
  duration: 300,
  easing: Easing.inOut(Easing.ease)
});
```

### withSpring (Bouncy)

```tsx
// Natural spring physics
translateY.value = withSpring(0, {
  damping: 15,
  stiffness: 150,
});
```

### withDelay

```tsx
// Wait before animating
opacity.value = withDelay(500, withTiming(1));
```

### withSequence

```tsx
// Chain animations
scale.value = withSequence(
  withTiming(1.2, { duration: 200 }),
  withTiming(1, { duration: 200 })
);
```

## Gestures

### Draggable Component

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

export function Draggable() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = startX.value + e.translationX;
      translateY.value = startY.value + e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={animatedStyle}
        className="w-24 h-24 bg-primary-500 rounded-xl items-center justify-center"
      >
        <Text className="text-white font-bold">Drag me!</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

### Swipeable Card

```tsx
export function SwipeableCard({ onSwipeLeft, onSwipeRight }) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        // Swiped left
        translateX.value = withTiming(-500, {}, () => {
          runOnJS(onSwipeLeft)();
        });
      } else if (e.translationX > 100) {
        // Swiped right
        translateX.value = withTiming(500, {}, () => {
          runOnJS(onSwipeRight)();
        });
      } else {
        // Return to center
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle} className="bg-white p-6 rounded-2xl">
        <Text>Swipe me left or right!</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

## Layout Animations

Animate layout changes automatically:

```tsx
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

export function AnimatedList({ items }) {
  return (
    <View>
      {items.map((item) => (
        <Animated.View
          key={item.id}
          entering={FadeIn}
          exiting={FadeOut}
          layout={Layout.springify()}
          className="p-4 bg-white rounded-lg mb-2"
        >
          <Text>{item.title}</Text>
        </Animated.View>
      ))}
    </View>
  );
}
```

## Common Patterns

### Loading Spinner

```tsx
export function LoadingSpinner() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1 // Infinite
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      {/* Your spinner icon */}
    </Animated.View>
  );
}
```

### Skeleton Loader

```tsx
export function Skeleton() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
    />
  );
}
```

### Bottom Sheet

```tsx
export function BottomSheet({ isOpen, onClose, children }) {
  const translateY = useSharedValue(500);

  useEffect(() => {
    translateY.value = withSpring(isOpen ? 0 : 500);
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <>
      {isOpen && (
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={onClose}
        />
      )}
      <Animated.View
        style={animatedStyle}
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6"
      >
        {children}
      </Animated.View>
    </>
  );
}
```

## Performance Tips

### 1. Use worklets for derived values

```tsx
// ✅ Good - Runs on UI thread
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return {
    opacity: opacity.value,
  };
});

// ❌ Bad - Accesses JS thread
const animatedStyle = useAnimatedStyle(() => {
  return {
    opacity: someJSVariable, // Don't do this
  };
});
```

### 2. Avoid re-renders

```tsx
// ✅ Good - No re-renders
const opacity = useSharedValue(0);
opacity.value = 1; // Doesn't cause re-render

// ❌ Bad - Causes re-renders
const [opacity, setOpacity] = useState(0);
setOpacity(1); // Causes re-render
```

### 3. Use runOnJS sparingly

```tsx
// Only when you need to call JS functions
.onEnd(() => {
  runOnJS(handleComplete)();
});
```

## Combining with NativeWind

You can mix Reanimated styles with NativeWind classes:

```tsx
<Animated.View
  style={animatedStyle}
  className="bg-white dark:bg-gray-800 p-4 rounded-xl"
>
  <Text className="text-gray-900 dark:text-white">Content</Text>
</Animated.View>
```

## Next Steps

- Read [Components Guide](./04-components.md) to build animated components
- Check [Best Practices](./14-best-practices.md) for performance optimization
