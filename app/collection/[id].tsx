import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useCollection } from '@/lib/hooks/useCollections';
import { StampGrid } from '@/components/stamps/StampGrid';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: collection, isLoading, refetch } = useCollection(id!);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </SafeAreaView>
    );
  }

  if (!collection) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <Text className="text-ink-light">Collection not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-forest-900 font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <Animated.View entering={FadeIn.duration(400)} className="px-4 pb-4">
      {/* Stats */}
      <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
        <View className="bg-forest-900/5 p-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-ink-light text-sm">Stamps</Text>
              <Text className="text-2xl font-bold text-forest-900">
                {collection.stamp_count}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-ink-light text-sm">Total Value</Text>
              <Text className="text-2xl font-bold text-forest-900">
                ${collection.total_value?.toFixed(2) || '0.00'}
              </Text>
            </View>
          </View>
        </View>
      </BlurView>

      {/* Description */}
      {collection.description && (
        <Text className="text-ink-light mb-4">{collection.description}</Text>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()} className="py-2">
          <Text className="text-forest-900 font-medium">← Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-ink flex-1 text-center" numberOfLines={1}>
          {collection.name}
        </Text>
        <Pressable className="py-2 px-2">
          <Text className="text-forest-900">Edit</Text>
        </Pressable>
      </View>

      {/* Stamps Grid */}
      <StampGrid
        stamps={collection.stamps || []}
        loading={isLoading}
        onRefresh={refetch}
        ListHeaderComponent={renderHeader()}
        emptyMessage="No stamps in this collection yet"
      />

      {/* Add Stamp FAB */}
      <View className="absolute bottom-6 right-6">
        <Pressable
          onPress={() => router.push('/camera')}
          className="w-14 h-14 bg-forest-900 rounded-full items-center justify-center shadow-lg active:opacity-90"
        >
          <Text className="text-white text-2xl">+</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
