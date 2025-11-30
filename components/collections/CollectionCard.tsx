import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { CollectionWithStats } from '@/lib/hooks/useCollections';

interface CollectionCardProps {
  collection: CollectionWithStats;
  onPress?: () => void;
  index?: number;
}

export function CollectionCard({ collection, onPress, index = 0 }: CollectionCardProps) {
  return (
    <Animated.View
      entering={FadeIn.delay(index * 50).duration(300)}
      className="mb-4 mx-4"
    >
      <Pressable
        onPress={onPress}
        className="rounded-2xl overflow-hidden active:opacity-95"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <BlurView intensity={20} tint="light" className="bg-white/80">
          <View className="flex-row">
            {/* Cover Image */}
            <View className="w-24 h-24 bg-cream-100">
              {collection.cover_image_url ? (
                <Image
                  source={{ uri: collection.cover_image_url }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-forest-900/5">
                  <Text className="text-3xl">📚</Text>
                </View>
              )}
            </View>

            {/* Info */}
            <View className="flex-1 p-3 justify-center">
              <Text className="text-ink font-semibold text-base" numberOfLines={1}>
                {collection.name}
              </Text>

              {collection.description && (
                <Text className="text-ink-light text-sm mt-0.5" numberOfLines={1}>
                  {collection.description}
                </Text>
              )}

              <View className="flex-row items-center mt-2 gap-3">
                <View className="flex-row items-center">
                  <Text className="text-ink-muted text-xs">📮</Text>
                  <Text className="text-ink-light text-xs ml-1">
                    {collection.stamp_count} stamps
                  </Text>
                </View>

                {collection.total_value > 0 && (
                  <View className="bg-forest-900/10 rounded-full px-2 py-0.5">
                    <Text className="text-forest-900 text-xs font-medium">
                      ${collection.total_value.toFixed(2)}
                    </Text>
                  </View>
                )}

                {collection.is_public && (
                  <Text className="text-ink-muted text-xs">🌐 Public</Text>
                )}
              </View>
            </View>

            {/* Arrow */}
            <View className="justify-center pr-3">
              <Text className="text-ink-muted">›</Text>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
}
