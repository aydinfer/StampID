import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import type { Stamp } from '@/lib/supabase/types';
import { RarityBadge } from '@/components/stamps/RarityBadge';
import { ConditionBadge } from '@/components/stamps/ConditionBadge';
import { ValueBadge } from '@/components/stamps/ValueDisplay';
import type { RarityTier } from '@/lib/stamps/catalog';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;

interface SwipeableStampCardProps {
  stamp: Stamp;
  onSwipeLeft: (stamp: Stamp) => void;
  onSwipeRight: (stamp: Stamp) => void;
  isFirst: boolean;
}

export function SwipeableStampCard({
  stamp,
  onSwipeLeft,
  onSwipeRight,
  isFirst,
}: SwipeableStampCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardScale = useSharedValue(isFirst ? 1 : 0.95);
  const cardOpacity = useSharedValue(isFirst ? 1 : 0.7);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isFirst) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5; // Dampen vertical movement
    })
    .onEnd((event) => {
      if (!isFirst) return;

      const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
      const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;

      if (shouldSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          runOnJS(onSwipeRight)(stamp);
        });
      } else if (shouldSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          runOnJS(onSwipeLeft)(stamp);
        });
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: cardScale.value },
      ],
      opacity: cardOpacity.value,
    };
  });

  // Like/Skip indicator opacity
  const likeIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const skipIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const avgValue = ((stamp.estimated_value_low || 0) + (stamp.estimated_value_high || 0)) / 2;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.cardContainer,
          cardStyle,
          { zIndex: isFirst ? 1 : 0 },
        ]}
      >
        <BlurView intensity={20} tint="light" style={styles.card}>
          <View className="flex-1 bg-white/80 rounded-3xl overflow-hidden">
            {/* Image */}
            <View className="flex-1 bg-cream-100">
              {stamp.image_url ? (
                <Image
                  source={{ uri: stamp.image_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Text className="text-ink-muted text-lg">No Image</Text>
                </View>
              )}

              {/* Like Indicator */}
              <Animated.View
                style={[styles.indicator, styles.likeIndicator, likeIndicatorStyle]}
              >
                <View className="bg-green-500 px-6 py-3 rounded-xl rotate-12">
                  <Text className="text-white font-bold text-2xl">LIKE</Text>
                </View>
              </Animated.View>

              {/* Skip Indicator */}
              <Animated.View
                style={[styles.indicator, styles.skipIndicator, skipIndicatorStyle]}
              >
                <View className="bg-red-500 px-6 py-3 rounded-xl -rotate-12">
                  <Text className="text-white font-bold text-2xl">SKIP</Text>
                </View>
              </Animated.View>
            </View>

            {/* Info */}
            <View className="p-5">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                  <Text className="text-2xl font-bold text-ink" numberOfLines={2}>
                    {stamp.name || 'Unknown Stamp'}
                  </Text>
                  <Text className="text-ink-muted text-base mt-1">
                    {stamp.country || 'Unknown'} {stamp.year_issued ? `• ${stamp.year_issued}` : ''}
                  </Text>
                </View>

                {avgValue > 0 && (
                  <View className="bg-forest-900 rounded-xl px-4 py-2">
                    <Text className="text-white font-bold text-lg">
                      ${avgValue.toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Badges */}
              <View className="flex-row items-center gap-2 mt-3">
                {stamp.condition && (
                  <ConditionBadge condition={stamp.condition} size="md" />
                )}
                {stamp.rarity && (
                  <RarityBadge rarity={stamp.rarity as RarityTier} size="md" />
                )}
                {stamp.catalog_number && (
                  <View className="bg-ink-muted/10 rounded-full px-2 py-1">
                    <Text className="text-ink-muted text-xs font-medium">
                      #{stamp.catalog_number}
                    </Text>
                  </View>
                )}
              </View>

              {/* Description preview */}
              {stamp.description && (
                <Text className="text-ink-light text-sm mt-3" numberOfLines={2}>
                  {stamp.description}
                </Text>
              )}
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  indicator: {
    position: 'absolute',
    top: 40,
  },
  likeIndicator: {
    left: 20,
  },
  skipIndicator: {
    right: 20,
  },
});
