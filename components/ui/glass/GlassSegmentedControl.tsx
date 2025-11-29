import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface GlassSegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  className?: string;
}

/**
 * GlassSegmentedControl - A glassmorphic segmented control
 *
 * @example
 * <GlassSegmentedControl
 *   options={['Day', 'Week', 'Month']}
 *   selectedIndex={selectedPeriod}
 *   onIndexChange={setSelectedPeriod}
 * />
 */
export function GlassSegmentedControl({
  options,
  selectedIndex,
  onIndexChange,
  className = '',
}: GlassSegmentedControlProps) {
  const position = useSharedValue(selectedIndex);

  React.useEffect(() => {
    position.value = withSpring(selectedIndex, {
      damping: 20,
      stiffness: 200,
    });
  }, [selectedIndex, position]);

  const segmentWidth = 100 / options.length;

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value * segmentWidth }],
      width: `${segmentWidth}%`,
    };
  });

  return (
    <BlurView intensity={40} tint="dark" className={`rounded-xl overflow-hidden ${className}`}>
      <View className="bg-white/5 border border-white/10 p-1">
        <View className="flex-row relative">
          {/* Animated indicator */}
          <Animated.View
            style={[indicatorStyle, { position: 'absolute', height: '100%' }]}
            className="bg-primary-500/80 rounded-lg"
          />

          {/* Segments */}
          {options.map((option, index) => (
            <Pressable
              key={option}
              onPress={() => onIndexChange(index)}
              className="flex-1 items-center justify-center py-2"
            >
              <Text
                className={`
                  text-sm font-semibold
                  ${selectedIndex === index ? 'text-white' : 'text-white/60'}
                `}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </BlurView>
  );
}
