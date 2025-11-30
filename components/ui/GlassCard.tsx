/**
 * GlassCard Component
 *
 * A reusable frosted glass card component using the design token system.
 * Supports multiple variants: card, modal, sheet, subtle
 */

import React from 'react';
import { View, ViewStyle, StyleSheet, Pressable, PressableProps } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';
import { glass, shadows, radius } from '@/lib/design/tokens';
import { useSpringPress } from '@/lib/design/animations';

type GlassVariant = 'card' | 'modal' | 'sheet' | 'subtle';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassVariant;
  style?: ViewStyle;
  className?: string;
  /** Make the card pressable with spring animation */
  pressable?: boolean;
  /** Called when card is pressed (only if pressable=true) */
  onPress?: () => void;
  /** Disable press animation even if pressable */
  disabled?: boolean;
  /** Additional padding inside the card */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Border radius override */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const paddingMap = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

const roundedMap = {
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  xl: radius.xl,
  '2xl': radius['2xl'],
  full: radius.full,
};

export function GlassCard({
  children,
  variant = 'card',
  style,
  className,
  pressable = false,
  onPress,
  disabled = false,
  padding = 'md',
  rounded = 'xl',
}: GlassCardProps) {
  const config = glass[variant];
  const { animatedStyle, pressHandlers } = useSpringPress({
    haptic: !disabled,
  });

  const containerStyle: ViewStyle = {
    borderRadius: roundedMap[rounded],
    overflow: 'hidden',
    ...(config.borderWidth > 0 && {
      borderWidth: config.borderWidth,
      borderColor: config.border,
    }),
    ...(config.shadow && {
      shadowColor: config.shadow.color,
      shadowOffset: config.shadow.offset,
      shadowRadius: config.shadow.radius,
      elevation: config.shadow.elevation,
      shadowOpacity: 1,
    }),
    ...style,
  };

  const contentStyle: ViewStyle = {
    backgroundColor: config.background,
    padding: paddingMap[padding],
  };

  const content = (
    <View style={containerStyle}>
      <BlurView
        intensity={config.blur}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );

  if (pressable && onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        disabled={disabled}
        style={animatedStyle}
        {...pressHandlers}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
}

/**
 * GlassCardHeader - Header section for glass cards
 */
interface GlassCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
  return (
    <View className={`mb-3 ${className || ''}`}>
      {children}
    </View>
  );
}

/**
 * GlassCardContent - Main content section
 */
interface GlassCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return (
    <View className={className}>
      {children}
    </View>
  );
}

/**
 * GlassCardFooter - Footer section for glass cards
 */
interface GlassCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <View className={`mt-3 pt-3 border-t border-zinc-200 ${className || ''}`}>
      {children}
    </View>
  );
}

/**
 * GlassDivider - Divider line for glass cards
 */
export function GlassDivider() {
  return <View className="h-px bg-zinc-200 my-3" />;
}

// Export all components
export default GlassCard;
