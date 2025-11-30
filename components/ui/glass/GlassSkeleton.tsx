/**
 * GlassSkeleton Component
 *
 * Skeleton loader with glassmorphic design and shimmer animation
 * for displaying loading states
 */

import React from 'react';
import { View, DimensionValue } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export interface GlassSkeletonProps {
  /** Width of skeleton (can be number or string with units) */
  width?: number | string;
  /** Height of skeleton */
  height?: number | string;
  /** Border radius */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Disable shimmer animation */
  noAnimation?: boolean;
  /** Variant style */
  variant?: 'default' | 'light' | 'dark';
}

const borderRadiusConfig = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

const variantConfig = {
  default: {
    bg: 'bg-white/10',
    shimmer: 'bg-white/20',
    intensity: 20,
  },
  light: {
    bg: 'bg-white/20',
    shimmer: 'bg-white/30',
    intensity: 30,
  },
  dark: {
    bg: 'bg-white/5',
    shimmer: 'bg-white/10',
    intensity: 10,
  },
};

/**
 * GlassSkeleton Component
 *
 * @example Basic skeleton
 * ```tsx
 * <GlassSkeleton width={200} height={20} borderRadius="md" />
 * ```
 *
 * @example Circle skeleton
 * ```tsx
 * <GlassSkeleton width={50} height={50} borderRadius="full" />
 * ```
 *
 * @example Without animation
 * ```tsx
 * <GlassSkeleton width="100%" height={100} noAnimation />
 * ```
 */
export function GlassSkeleton({
  width = '100%',
  height = 20,
  borderRadius = 'md',
  noAnimation = false,
  variant = 'default',
}: GlassSkeletonProps) {
  const progress = useSharedValue(0);
  const radiusStyle = borderRadiusConfig[borderRadius];
  const variantStyle = variantConfig[variant];

  React.useEffect(() => {
    if (!noAnimation) {
      progress.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        false
      );
    }
  }, [noAnimation]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-200, 200]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      className={`overflow-hidden ${radiusStyle}`}
      style={{ width: width as DimensionValue, height: height as DimensionValue }}
    >
      <BlurView
        intensity={variantStyle.intensity}
        tint="dark"
        className={`w-full h-full ${variantStyle.bg}`}
      >
        {!noAnimation && (
          <Animated.View
            style={[animatedStyle]}
            className={`w-1/2 h-full ${variantStyle.shimmer}`}
          />
        )}
      </BlurView>
    </View>
  );
}

/**
 * GlassSkeletonGroup Component
 *
 * Convenience component for multiple skeletons with consistent spacing
 *
 * @example Skeleton list
 * ```tsx
 * <GlassSkeletonGroup count={3} spacing={12}>
 *   <GlassSkeleton width="100%" height={60} borderRadius="lg" />
 * </GlassSkeletonGroup>
 * ```
 */
export interface GlassSkeletonGroupProps {
  /** Number of skeleton items to render */
  count?: number;
  /** Spacing between items */
  spacing?: number;
  /** Skeleton configuration */
  children: React.ReactElement<GlassSkeletonProps>;
}

export function GlassSkeletonGroup({
  count = 3,
  spacing = 12,
  children,
}: GlassSkeletonGroupProps) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={{ marginBottom: index < count - 1 ? spacing : 0 }}
        >
          {React.cloneElement(children)}
        </View>
      ))}
    </View>
  );
}

/**
 * Predefined skeleton layouts
 */

/**
 * Skeleton for list item with avatar
 */
export function GlassSkeletonListItem() {
  return (
    <View className="flex-row items-center gap-3">
      <GlassSkeleton width={48} height={48} borderRadius="full" />
      <View className="flex-1 gap-2">
        <GlassSkeleton width="60%" height={16} borderRadius="md" />
        <GlassSkeleton width="40%" height={12} borderRadius="md" />
      </View>
    </View>
  );
}

/**
 * Skeleton for card with image
 */
export function GlassSkeletonCard() {
  return (
    <View className="gap-3">
      <GlassSkeleton width="100%" height={200} borderRadius="lg" />
      <View className="gap-2">
        <GlassSkeleton width="80%" height={20} borderRadius="md" />
        <GlassSkeleton width="60%" height={16} borderRadius="md" />
        <GlassSkeleton width="40%" height={16} borderRadius="md" />
      </View>
    </View>
  );
}

/**
 * Skeleton for text paragraph
 */
export function GlassSkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View className="gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <GlassSkeleton
          key={index}
          width={index === lines - 1 ? '70%' : '100%'}
          height={14}
          borderRadius="md"
        />
      ))}
    </View>
  );
}

/**
 * Skeleton for profile header
 */
export function GlassSkeletonProfile() {
  return (
    <View className="items-center gap-4">
      <GlassSkeleton width={100} height={100} borderRadius="full" />
      <View className="items-center gap-2 w-full">
        <GlassSkeleton width="50%" height={24} borderRadius="md" />
        <GlassSkeleton width="70%" height={16} borderRadius="md" />
      </View>
    </View>
  );
}
