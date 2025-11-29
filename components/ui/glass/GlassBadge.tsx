/**
 * GlassBadge Component
 *
 * Badge component with glassmorphic design for:
 * - Notification counts
 * - Status indicators
 * - Labels and tags
 * - Animated pulse effect
 */

import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export interface GlassBadgeProps {
  /** Badge content (number or text) */
  content?: string | number;
  /** Badge variant */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Show as dot only (no content) */
  dot?: boolean;
  /** Show pulse animation */
  pulse?: boolean;
  /** Maximum number to display (shows "99+" if exceeded) */
  max?: number;
  /** Show zero count */
  showZero?: boolean;
}

const variantConfig = {
  primary: {
    bg: 'bg-primary-500/80',
    text: 'text-white',
    blur: 40,
  },
  success: {
    bg: 'bg-green-500/80',
    text: 'text-white',
    blur: 40,
  },
  warning: {
    bg: 'bg-yellow-500/80',
    text: 'text-white',
    blur: 40,
  },
  error: {
    bg: 'bg-red-500/80',
    text: 'text-white',
    blur: 40,
  },
  info: {
    bg: 'bg-blue-500/80',
    text: 'text-white',
    blur: 40,
  },
  neutral: {
    bg: 'bg-gray-500/80',
    text: 'text-white',
    blur: 40,
  },
};

const sizeConfig = {
  sm: {
    container: 'min-w-[16px] h-4 px-1',
    text: 'text-[10px]',
    dot: 'w-2 h-2',
  },
  md: {
    container: 'min-w-[20px] h-5 px-1.5',
    text: 'text-xs',
    dot: 'w-2.5 h-2.5',
  },
  lg: {
    container: 'min-w-[24px] h-6 px-2',
    text: 'text-sm',
    dot: 'w-3 h-3',
  },
};

/**
 * GlassBadge Component
 *
 * @example Basic badge with count
 * ```tsx
 * <GlassBadge content={5} variant="primary" />
 * ```
 *
 * @example Dot badge with pulse
 * ```tsx
 * <GlassBadge dot pulse variant="success" />
 * ```
 *
 * @example Text badge
 * ```tsx
 * <GlassBadge content="NEW" variant="warning" size="lg" />
 * ```
 *
 * @example Max count
 * ```tsx
 * <GlassBadge content={150} max={99} variant="error" />
 * // Shows "99+"
 * ```
 */
export function GlassBadge({
  content,
  variant = 'primary',
  size = 'md',
  dot = false,
  pulse = false,
  max = 99,
  showZero = false,
}: GlassBadgeProps) {
  const variantStyle = variantConfig[variant];
  const sizeStyle = sizeConfig[size];

  // Pulse animation - hooks must be called before any early returns
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 600 }), withTiming(1, { duration: 600 })),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [pulse, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, [scale]);

  // Don't render if content is 0 and showZero is false
  if (!showZero && content === 0) {
    return null;
  }

  // Format content
  let displayContent = content;
  if (typeof content === 'number' && content > max) {
    displayContent = `${max}+`;
  }

  if (dot) {
    return (
      <Animated.View style={pulse ? animatedStyle : undefined}>
        <View className={`${sizeStyle.dot} rounded-full ${variantStyle.bg}`} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={pulse ? animatedStyle : undefined}>
      <View
        className={`${sizeStyle.container} rounded-full overflow-hidden items-center justify-center`}
      >
        <BlurView
          intensity={variantStyle.blur}
          tint="dark"
          className={`absolute inset-0 ${variantStyle.bg}`}
        />
        <Text className={`${sizeStyle.text} font-bold ${variantStyle.text}`} numberOfLines={1}>
          {displayContent}
        </Text>
      </View>
    </Animated.View>
  );
}

/**
 * GlassBadgedIcon Component
 *
 * Wraps a component (like an icon) with a badge
 *
 * @example
 * ```tsx
 * <GlassBadgedIcon badge={{ content: 5, variant: 'error' }}>
 *   <Text className="text-white text-2xl">🔔</Text>
 * </GlassBadgedIcon>
 * ```
 */
export interface GlassBadgedIconProps {
  /** Child component to wrap */
  children: React.ReactNode;
  /** Badge props */
  badge: GlassBadgeProps;
  /** Badge position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const positionConfig = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
};

export function GlassBadgedIcon({ children, badge, position = 'top-right' }: GlassBadgedIconProps) {
  const positionStyle = positionConfig[position];

  return (
    <View className="relative">
      {children}
      <View className={`absolute ${positionStyle}`}>
        <GlassBadge {...badge} />
      </View>
    </View>
  );
}

/**
 * GlassStatusBadge Component
 *
 * Specialized badge for status display (e.g., "Active", "Pending", "Completed")
 *
 * @example
 * ```tsx
 * <GlassStatusBadge status="active" />
 * <GlassStatusBadge status="pending" />
 * <GlassStatusBadge status="error" label="Failed" />
 * ```
 */
export interface GlassStatusBadgeProps {
  /** Status type */
  status: 'active' | 'inactive' | 'pending' | 'success' | 'error' | 'warning';
  /** Custom label (defaults to status) */
  label?: string;
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

const statusMap = {
  active: { variant: 'success' as const, label: 'Active' },
  inactive: { variant: 'neutral' as const, label: 'Inactive' },
  pending: { variant: 'warning' as const, label: 'Pending' },
  success: { variant: 'success' as const, label: 'Success' },
  error: { variant: 'error' as const, label: 'Error' },
  warning: { variant: 'warning' as const, label: 'Warning' },
};

export function GlassStatusBadge({ status, label, size = 'md' }: GlassStatusBadgeProps) {
  const config = statusMap[status];
  const displayLabel = label || config.label;

  return <GlassBadge content={displayLabel} variant={config.variant} size={size} />;
}
