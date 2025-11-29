import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '@/lib/utils/colors';

interface GlassSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * GlassSwitch - A glassmorphic toggle switch
 *
 * @example
 * <GlassSwitch
 *   value={enabled}
 *   onValueChange={setEnabled}
 *   label="Dark Mode"
 * />
 */
export function GlassSwitch({
  value,
  onValueChange,
  label,
  disabled = false,
  className = '',
}: GlassSwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0);
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.1)', colors.primary[500]]
    );

    return { backgroundColor };
  });

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = withSpring(progress.value * 20);

    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <View className={`flex-row items-center ${className}`}>
      {label && <Text className="text-white text-base mr-3 flex-1">{label}</Text>}

      <Pressable onPress={handlePress} disabled={disabled}>
        <Animated.View
          style={trackStyle}
          className={`
            w-[52px] h-8 rounded-full justify-center px-1
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          <Animated.View style={thumbStyle} className="w-6 h-6 bg-white rounded-full shadow-lg" />
        </Animated.View>
      </Pressable>
    </View>
  );
}
