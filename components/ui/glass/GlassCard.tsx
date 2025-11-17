import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | 'systemMaterialLight' | 'systemMaterialDark';
  animated?: boolean;
  variant?: 'default' | 'premium' | 'subtle';
  className?: string;
}

/**
 * GlassCard - A glassmorphic card component
 *
 * @example
 * <GlassCard variant="premium" intensity={80}>
 *   <Text className="text-white">Content</Text>
 * </GlassCard>
 */
export function GlassCard({
  children,
  intensity = 60,
  tint = 'systemMaterialDark',
  animated = true,
  variant = 'default',
  className = '',
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: 'rounded-2xl border border-white/10',
    premium: 'rounded-3xl border border-white/20 shadow-2xl',
    subtle: 'rounded-xl border border-white/5',
  };

  const content = (
    <BlurView
      intensity={intensity}
      tint={tint}
      className={`overflow-hidden ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <View className="bg-white/5">{children}</View>
    </BlurView>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.duration(600).springify()}>
        {content}
      </Animated.View>
    );
  }

  return content;
}
