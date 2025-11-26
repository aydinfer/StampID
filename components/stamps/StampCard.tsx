import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { Stamp } from '@/lib/supabase/types';

interface StampCardProps {
  stamp: Stamp;
  onPress?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  index?: number;
}

export function StampCard({ stamp, onPress, onLongPress, selected, index = 0 }: StampCardProps) {
  const avgValue = ((stamp.estimated_value_low || 0) + (stamp.estimated_value_high || 0)) / 2;

  return (
    <Animated.View
      entering={FadeIn.delay(index * 50).duration(300)}
      className="w-[48%] mb-4"
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        className={`rounded-2xl overflow-hidden ${selected ? 'ring-2 ring-forest-900' : ''}`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <BlurView intensity={20} tint="light" className="bg-white/80">
          {/* Image */}
          <View className="aspect-square bg-cream-100">
            {stamp.image_url ? (
              <Image
                source={{ uri: stamp.thumbnail_url || stamp.image_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Text className="text-4xl">📮</Text>
              </View>
            )}

            {/* Favorite badge */}
            {stamp.is_favorite && (
              <View className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
                <Text className="text-sm">❤️</Text>
              </View>
            )}

            {/* Selection indicator */}
            {selected && (
              <View className="absolute top-2 left-2 w-6 h-6 bg-forest-900 rounded-full items-center justify-center">
                <Text className="text-white text-xs">✓</Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View className="p-3">
            <Text
              className="text-ink font-semibold text-sm"
              numberOfLines={1}
            >
              {stamp.name || 'Unknown Stamp'}
            </Text>

            <Text
              className="text-ink-light text-xs mt-0.5"
              numberOfLines={1}
            >
              {stamp.country || 'Unknown'} {stamp.year_issued ? `• ${stamp.year_issued}` : ''}
            </Text>

            {avgValue > 0 && (
              <View className="flex-row items-center mt-2">
                <View className="bg-forest-900/10 rounded-full px-2 py-0.5">
                  <Text className="text-forest-900 text-xs font-medium">
                    ${avgValue.toFixed(2)}
                  </Text>
                </View>

                {stamp.condition && (
                  <Text className="text-ink-muted text-xs ml-2 capitalize">
                    {stamp.condition.replace('_', ' ')}
                  </Text>
                )}
              </View>
            )}
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}
