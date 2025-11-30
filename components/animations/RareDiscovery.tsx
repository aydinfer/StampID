/**
 * RareDiscovery Animation Component
 *
 * Displays a subtle glow effect and scale pulse when a rare stamp is discovered.
 * Apple-style: understated but noticeable.
 */

import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, springs, rareDiscoveryAnimation } from '@/lib/design/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type RarityLevel = 'rare' | 'veryRare';

interface RareDiscoveryProps {
  children: React.ReactNode;
  /** Rarity level affects glow color */
  rarity?: RarityLevel;
  /** Auto-trigger animation on mount */
  autoPlay?: boolean;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
}

export interface RareDiscoveryRef {
  trigger: () => void;
}

const rarityColors: Record<RarityLevel, string[]> = {
  rare: [colors.violet[500], colors.violet[400], 'transparent'],
  veryRare: [colors.violet[600], colors.indigo[500], 'transparent'],
};

export const RareDiscovery = forwardRef<RareDiscoveryRef, RareDiscoveryProps>(
  ({ children, rarity = 'rare', autoPlay = false, onAnimationComplete }, ref) => {
    const glowOpacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const glowScale = useSharedValue(0.8);

    const triggerAnimation = () => {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Glow animation
      glowOpacity.value = withSequence(
        withTiming(rareDiscoveryAnimation.glowOpacity, { duration: 150 }),
        withDelay(300, withTiming(0, { duration: 400 }))
      );

      glowScale.value = withSequence(
        withSpring(1.2, springs.bouncy),
        withSpring(1.5, { ...springs.gentle, stiffness: 40 })
      );

      // Content scale pulse
      scale.value = withSequence(
        withSpring(rareDiscoveryAnimation.scaleAmount, springs.bouncy),
        withSpring(1, springs.smooth)
      );

      // Callback after animation
      if (onAnimationComplete) {
        setTimeout(() => {
          runOnJS(onAnimationComplete)();
        }, 800);
      }
    };

    // Expose trigger method via ref
    useImperativeHandle(ref, () => ({
      trigger: triggerAnimation,
    }));

    // Auto-play on mount if enabled
    useEffect(() => {
      if (autoPlay) {
        const timer = setTimeout(triggerAnimation, 100);
        return () => clearTimeout(timer);
      }
    }, [autoPlay]);

    const glowStyle = useAnimatedStyle(() => ({
      opacity: glowOpacity.value,
      transform: [{ scale: glowScale.value }],
    }));

    const contentStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const gradientColors = rarityColors[rarity];

    return (
      <View style={styles.container}>
        {/* Glow effect layer */}
        <Animated.View style={[styles.glowContainer, glowStyle]}>
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            style={styles.gradient}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 0.5, y: 0 }}
          />
        </Animated.View>

        {/* Content with scale animation */}
        <Animated.View style={contentStyle}>
          {children}
        </Animated.View>
      </View>
    );
  }
);

RareDiscovery.displayName = 'RareDiscovery';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  gradient: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    borderRadius: SCREEN_WIDTH / 2,
  },
});

/**
 * ValueReveal Component
 *
 * Animated counter for revealing stamp values
 */
interface ValueRevealProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  style?: object;
  className?: string;
}

export function ValueReveal({
  value,
  prefix = '$',
  suffix = '',
  duration = 800,
  delay = 0,
  style,
  className,
}: ValueRevealProps) {
  const animatedValue = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    // Fade in and slide up
    opacity.value = withDelay(delay, withSpring(1, springs.smooth));
    translateY.value = withDelay(delay, withSpring(0, springs.smooth));

    // Animate value
    animatedValue.value = withDelay(
      delay,
      withTiming(value, { duration })
    );
  }, [value, delay, duration]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // Note: For actual value display, you'd need to use a Text component
  // that reads from a derived value. This is a simplified version.
  return (
    <Animated.Text
      style={[containerStyle, style]}
      className={`font-mono text-2xl font-bold text-zinc-900 ${className || ''}`}
    >
      {prefix}{value.toFixed(2)}{suffix}
    </Animated.Text>
  );
}

export default RareDiscovery;
