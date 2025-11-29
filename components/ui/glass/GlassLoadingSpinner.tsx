/**
 * GlassLoadingSpinner Component
 *
 * Loading spinner with glassmorphic design for:
 * - Full-screen loading overlays
 * - Inline loading indicators
 * - Button loading states
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export interface GlassLoadingSpinnerProps {
  /** Size of spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Loading text */
  text?: string;
  /** Show as full-screen overlay */
  fullScreen?: boolean;
  /** Color of spinner */
  color?: string;
  /** Use custom animated spinner (default: ActivityIndicator) */
  useCustomSpinner?: boolean;
}

const sizeConfig = {
  sm: {
    spinner: 'small' as const,
    container: 'p-4',
    text: 'text-sm',
    customSize: 24,
  },
  md: {
    spinner: 'large' as const,
    container: 'p-6',
    text: 'text-base',
    customSize: 40,
  },
  lg: {
    spinner: 'large' as const,
    container: 'p-8',
    text: 'text-lg',
    customSize: 56,
  },
};

/**
 * GlassLoadingSpinner Component
 *
 * @example Inline spinner
 * ```tsx
 * <GlassLoadingSpinner size="md" text="Loading..." />
 * ```
 *
 * @example Full-screen overlay
 * ```tsx
 * <GlassLoadingSpinner
 *   fullScreen
 *   size="lg"
 *   text="Please wait..."
 * />
 * ```
 *
 * @example Custom color
 * ```tsx
 * <GlassLoadingSpinner
 *   size="md"
 *   color="#60A5FA"
 *   text="Processing..."
 * />
 * ```
 */
export function GlassLoadingSpinner({
  size = 'md',
  text,
  fullScreen = false,
  color = '#FFFFFF',
  useCustomSpinner = false,
}: GlassLoadingSpinnerProps) {
  const sizeStyle = sizeConfig[size];

  const SpinnerContent = () => (
    <View className={`items-center justify-center ${sizeStyle.container}`}>
      {useCustomSpinner ? (
        <CustomSpinner size={sizeStyle.customSize} color={color} />
      ) : (
        <ActivityIndicator size={sizeStyle.spinner} color={color} />
      )}
      {text && (
        <Text className={`${sizeStyle.text} text-white font-medium mt-3 text-center`}>{text}</Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="absolute inset-0 items-center justify-center z-50">
        <BlurView intensity={60} tint="dark" className="absolute inset-0 bg-black/50" />
        <View className="bg-white/10 rounded-2xl overflow-hidden border border-white/20">
          <BlurView intensity={40} tint="dark">
            <SpinnerContent />
          </BlurView>
        </View>
      </View>
    );
  }

  return (
    <View className="items-center justify-center">
      <SpinnerContent />
    </View>
  );
}

/**
 * Custom animated spinner (circles)
 */
function CustomSpinner({ size, color }: { size: number; color: string }) {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <View
        className="w-full h-full rounded-full border-4"
        style={{
          borderColor: 'transparent',
          borderTopColor: color,
          borderRightColor: color,
        }}
      />
    </Animated.View>
  );
}

/**
 * Button loading spinner (inline)
 */
export function GlassLoadingButtonSpinner({ color = '#FFFFFF' }: { color?: string }) {
  return <ActivityIndicator size="small" color={color} />;
}

/**
 * Inline text with spinner
 */
export function GlassLoadingInline({
  text = 'Loading...',
  color = '#FFFFFF',
}: {
  text?: string;
  color?: string;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <ActivityIndicator size="small" color={color} />
      <Text className="text-white text-sm">{text}</Text>
    </View>
  );
}

/**
 * Loading dots animation
 */
export function GlassLoadingDots({ color = '#FFFFFF' }: { color?: string }) {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  React.useEffect(() => {
    dot1.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    setTimeout(() => {
      dot2.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    }, 200);
    setTimeout(() => {
      dot3.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
    }, 400);
  }, [dot1, dot2, dot3]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
  }));

  return (
    <View className="flex-row items-center gap-1">
      <Animated.View
        style={[dot1Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: color }]}
      />
      <Animated.View
        style={[dot2Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: color }]}
      />
      <Animated.View
        style={[dot3Style, { width: 8, height: 8, borderRadius: 4, backgroundColor: color }]}
      />
    </View>
  );
}
