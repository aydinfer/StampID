import React from 'react';
import { Pressable, Text, View, PressableProps, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
  className?: string;
}

/**
 * GlassButton - A glassmorphic button with press animations
 *
 * @example
 * <GlassButton
 *   title="Get Started"
 *   variant="primary"
 *   onPress={() => console.log('Pressed')}
 * />
 */
export function GlassButton({
  title,
  loading = false,
  variant = 'primary',
  size = 'md',
  intensity = 40,
  className = '',
  disabled,
  onPress,
  ...props
}: GlassButtonProps) {
  const pressed = useSharedValue(0);

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-5',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantStyles = {
    primary: 'bg-primary-500/90 border border-primary-400/30',
    secondary: 'bg-white/10 border border-white/20',
    ghost: 'bg-white/5 border border-white/10',
  };

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.95]);
    const opacity = interpolate(pressed.value, [0, 1], [1, 0.8]);

    return {
      transform: [{ scale: withSpring(scale) }],
      opacity: withSpring(opacity),
    };
  });

  const handlePressIn = () => {
    pressed.value = 1;
  };

  const handlePressOut = () => {
    pressed.value = 0;
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || loading}
      style={animatedStyle}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        className={`rounded-xl overflow-hidden ${className}`}
      >
        <View
          className={`
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            ${disabled ? 'opacity-50' : ''}
            flex-row items-center justify-center
          `}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className={`${textSizes[size]} font-semibold text-white text-center`}>
              {title}
            </Text>
          )}
        </View>
      </BlurView>
    </AnimatedPressable>
  );
}
