import React from 'react';
import { Modal, View, Text, Pressable, ModalProps } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface GlassModalProps extends Omit<ModalProps, 'children'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  intensity?: number;
  showCloseButton?: boolean;
}

/**
 * GlassModal - A glassmorphic modal with smooth animations
 *
 * @example
 * <GlassModal
 *   visible={isVisible}
 *   onClose={() => setIsVisible(false)}
 *   title="Settings"
 * >
 *   <Text className="text-white">Modal content</Text>
 * </GlassModal>
 */
export function GlassModal({
  visible,
  onClose,
  title,
  children,
  intensity = 80,
  showCloseButton = true,
  ...props
}: GlassModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      {...props}
    >
      <View className="flex-1 justify-end bg-black/50">
        {/* Backdrop - dismisses modal */}
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="absolute inset-0"
        >
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          entering={SlideInDown.springify().damping(20)}
          exiting={SlideOutDown}
          className="max-h-[90%]"
        >
          <BlurView
            intensity={intensity}
            tint="systemMaterialDark"
            className="rounded-t-3xl overflow-hidden border-t border-white/10"
          >
            <View className="bg-white/5">
              {/* Header */}
              {(title || showCloseButton) && (
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/10">
                  {title ? (
                    <Text className="text-xl font-bold text-white">{title}</Text>
                  ) : (
                    <View />
                  )}
                  {showCloseButton && (
                    <Pressable
                      onPress={onClose}
                      className="w-8 h-8 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
                    >
                      <Text className="text-white text-lg font-bold">×</Text>
                    </Pressable>
                  )}
                </View>
              )}

              {/* Content */}
              <View className="px-6 py-6">{children}</View>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}
