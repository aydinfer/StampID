import React from 'react';
import { Modal, View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.9;

interface GlassSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[]; // e.g., [0.5, 0.9] for 50% and 90% of screen
  initialSnapPoint?: number;
}

/**
 * GlassSheet - A draggable glassmorphic bottom sheet
 *
 * @example
 * <GlassSheet
 *   visible={isVisible}
 *   onClose={() => setIsVisible(false)}
 *   title="Filters"
 *   snapPoints={[0.5, 0.9]}
 * >
 *   <Text className="text-white">Sheet content</Text>
 * </GlassSheet>
 */
export function GlassSheet({
  visible,
  onClose,
  title,
  children,
  snapPoints = [0.6, 0.9],
  initialSnapPoint = 0,
}: GlassSheetProps) {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const snapToPoint = React.useCallback(
    (point: number) => {
      'worklet';
      translateY.value = withSpring(-SCREEN_HEIGHT * point, {
        damping: 50,
        stiffness: 400,
      });
    },
    [translateY]
  );

  React.useEffect(() => {
    if (visible) {
      snapToPoint(snapPoints[initialSnapPoint]);
    }
  }, [visible, snapToPoint, snapPoints, initialSnapPoint]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      // Snap to nearest point or close
      if (translateY.value > -SCREEN_HEIGHT * 0.2) {
        runOnJS(onClose)();
      } else {
        // Find nearest snap point
        let nearestPoint = snapPoints[0];
        let minDistance = Math.abs(translateY.value + SCREEN_HEIGHT * snapPoints[0]);

        snapPoints.forEach((point) => {
          const distance = Math.abs(translateY.value + SCREEN_HEIGHT * point);
          if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = point;
          }
        });

        snapToPoint(nearestPoint);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50">
        {/* Backdrop */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Sheet */}
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[rBottomSheetStyle, { height: SCREEN_HEIGHT }]}
            className="absolute bottom-0 left-0 right-0"
          >
            <BlurView
              intensity={80}
              tint="systemMaterialDark"
              className="flex-1 rounded-t-3xl overflow-hidden border-t border-white/10"
            >
              <View className="bg-white/5 flex-1">
                {/* Handle */}
                <View className="items-center py-3">
                  <View className="w-12 h-1 bg-white/30 rounded-full" />
                </View>

                {/* Header */}
                {title && (
                  <View className="px-6 pb-4 border-b border-white/10">
                    <Text className="text-xl font-bold text-white">{title}</Text>
                  </View>
                )}

                {/* Content */}
                <ScrollView className="flex-1 px-6 py-4" bounces={false}>
                  {children}
                </ScrollView>
              </View>
            </BlurView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}
