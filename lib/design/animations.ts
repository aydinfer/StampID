/**
 * Animation Hooks for StampID
 *
 * Physics-based animations using react-native-reanimated
 * Following Apple's animation principles:
 * - Spring physics, not linear easing
 * - Responsive to user velocity
 * - Subtle scale feedback on press
 * - Staggered list animations
 */

import { useCallback, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  interpolate,
  Easing,
  SharedValue,
  WithSpringConfig,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { springs, durations, pressAnimation, rareDiscoveryAnimation } from './tokens';

// =============================================================================
// SPRING PRESS ANIMATION
// =============================================================================

/**
 * Hook for press feedback animation
 * Scale down to 0.97 on press, return to 1.0 on release
 */
export function useSpringPress(options?: { scale?: number; haptic?: boolean }) {
  const scale = options?.scale ?? pressAnimation.scale;
  const enableHaptic = options?.haptic ?? true;

  const pressed = useSharedValue(false);
  const animatedScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(animatedScale.value, {
          damping: springs.snappy.damping,
          stiffness: springs.snappy.stiffness,
        }),
      },
    ],
  }));

  const onPressIn = useCallback(() => {
    pressed.value = true;
    animatedScale.value = scale;
    if (enableHaptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [scale, enableHaptic]);

  const onPressOut = useCallback(() => {
    pressed.value = false;
    animatedScale.value = 1;
  }, []);

  return {
    animatedStyle,
    pressHandlers: {
      onPressIn,
      onPressOut,
    },
    pressed,
  };
}

// =============================================================================
// VALUE COUNTER ANIMATION
// =============================================================================

/**
 * Hook for animating numeric values (like prices)
 * Counts from 0 to target value with spring physics
 */
export function useValueCounter(targetValue: number, options?: {
  duration?: number;
  delay?: number;
  decimals?: number;
}) {
  const duration = options?.duration ?? durations.slower;
  const delay = options?.delay ?? 0;
  const decimals = options?.decimals ?? 2;

  const animatedValue = useSharedValue(0);
  const displayValue = useSharedValue('0.00');

  useEffect(() => {
    animatedValue.value = withDelay(
      delay,
      withTiming(targetValue, {
        duration,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [targetValue, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    // Update display value on UI thread
    const formatted = animatedValue.value.toFixed(decimals);
    displayValue.value = formatted;
    return {};
  });

  return {
    animatedValue,
    displayValue,
    animatedStyle,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

// =============================================================================
// STAGGERED LIST ANIMATION
// =============================================================================

/**
 * Hook for staggered entry animation of list items
 */
export function useStaggeredEntry(index: number, options?: {
  delay?: number;
  baseDelay?: number;
}) {
  const staggerDelay = options?.delay ?? 30;
  const baseDelay = options?.baseDelay ?? 0;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const itemDelay = baseDelay + index * staggerDelay;

    opacity.value = withDelay(
      itemDelay,
      withSpring(1, springs.smooth)
    );

    translateY.value = withDelay(
      itemDelay,
      withSpring(0, springs.smooth)
    );
  }, [index, baseDelay, staggerDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

// =============================================================================
// RARE DISCOVERY ANIMATION
// =============================================================================

/**
 * Hook for rare stamp discovery animation
 * Subtle glow + scale pulse
 */
export function useRareDiscovery() {
  const glowOpacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const isAnimating = useSharedValue(false);

  const triggerAnimation = useCallback((onComplete?: () => void) => {
    'worklet';
    if (isAnimating.value) return;

    isAnimating.value = true;

    // Glow fade in and out
    glowOpacity.value = withSequence(
      withTiming(rareDiscoveryAnimation.glowOpacity, { duration: 200 }),
      withDelay(400, withTiming(0, { duration: 300 }))
    );

    // Scale pulse
    scale.value = withSequence(
      withSpring(rareDiscoveryAnimation.scaleAmount, springs.bouncy),
      withSpring(1, springs.smooth)
    );

    // Haptic feedback
    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

    // Reset flag after animation
    setTimeout(() => {
      isAnimating.value = false;
      onComplete?.();
    }, rareDiscoveryAnimation.duration + 300);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    triggerAnimation,
    glowStyle,
    containerStyle,
    glowColor: rareDiscoveryAnimation.glowColor,
  };
}

// =============================================================================
// SCREEN TRANSITION HELPERS
// =============================================================================

/**
 * Fade up entry animation config for screens
 */
export const fadeUpEntry = {
  animation: 'spring',
  config: springs.smooth,
  delay: 0,
};

/**
 * Stagger children entering animation
 */
export function createStaggerConfig(itemCount: number, baseDelay = 0) {
  return Array.from({ length: itemCount }, (_, i) => ({
    delay: baseDelay + i * 30,
    spring: springs.smooth,
  }));
}

// =============================================================================
// GESTURE HANDLERS
// =============================================================================

/**
 * Create a pan gesture for swipeable cards
 */
export function useSwipeGesture(options: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}) {
  const threshold = options.threshold ?? 100;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5;
      rotation.value = interpolate(
        event.translationX,
        [-200, 0, 200],
        [-15, 0, 15]
      );
    })
    .onEnd((event) => {
      if (event.translationX > threshold) {
        // Swipe right
        translateX.value = withSpring(500, springs.stiff);
        opacity.value = withTiming(0, { duration: 200 });
        if (options.onSwipeRight) {
          runOnJS(options.onSwipeRight)();
        }
      } else if (event.translationX < -threshold) {
        // Swipe left
        translateX.value = withSpring(-500, springs.stiff);
        opacity.value = withTiming(0, { duration: 200 });
        if (options.onSwipeLeft) {
          runOnJS(options.onSwipeLeft)();
        }
      } else {
        // Snap back
        translateX.value = withSpring(0, springs.smooth);
        translateY.value = withSpring(0, springs.smooth);
        rotation.value = withSpring(0, springs.smooth);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const reset = useCallback(() => {
    translateX.value = 0;
    translateY.value = 0;
    rotation.value = 0;
    opacity.value = 1;
  }, []);

  return {
    gesture,
    animatedStyle,
    reset,
  };
}

// =============================================================================
// SHARED ELEMENT HELPERS
// =============================================================================

/**
 * Get spring config for shared element transitions
 */
export function getSharedElementSpring(): WithSpringConfig {
  return {
    damping: springs.smooth.damping,
    stiffness: springs.smooth.stiffness,
    mass: springs.smooth.mass,
  };
}

// =============================================================================
// HAPTIC FEEDBACK HELPERS
// =============================================================================

export const haptics = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  selection: () => Haptics.selectionAsync(),
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
  springs,
  durations,
  pressAnimation,
  rareDiscoveryAnimation,
} from './tokens';
