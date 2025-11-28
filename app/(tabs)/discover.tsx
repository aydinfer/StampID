import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SwipeableStampCard } from '@/components/discover/SwipeableStampCard';
import { useDiscoverStamps, useAddToWantList, useDiscoveryStats } from '@/lib/hooks/useDiscover';
import { Feedback } from '@/lib/utils/feedback';
import type { Stamp } from '@/lib/supabase/types';

export default function DiscoverScreen() {
  const { stamps, isLoading, markSeen, refresh, hasMore } = useDiscoverStamps();
  const addToWantList = useAddToWantList();
  const { wantListCount } = useDiscoveryStats();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStamps = stamps.slice(currentIndex, currentIndex + 3);

  const handleSwipeLeft = useCallback((stamp: Stamp) => {
    // Skip - just mark as seen
    Feedback.swipeLeft();
    markSeen(stamp.id);
    setCurrentIndex((prev) => prev + 1);
  }, [markSeen]);

  const handleSwipeRight = useCallback(async (stamp: Stamp) => {
    // Like - add to want list
    Feedback.swipeRight();
    markSeen(stamp.id);
    setCurrentIndex((prev) => prev + 1);

    try {
      await addToWantList.mutateAsync(stamp);
    } catch (error) {
      console.error('Error adding to want list:', error);
    }
  }, [markSeen, addToWantList]);

  const handleRefresh = useCallback(() => {
    setCurrentIndex(0);
    refresh();
  }, [refresh]);

  // Empty state
  if (!isLoading && currentStamps.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-ink">Discover</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Animated.View entering={FadeIn.duration(400)} className="items-center">
            <View className="w-20 h-20 rounded-full bg-forest-100 items-center justify-center mb-6">
              <Text className="text-forest-900 text-3xl font-bold">D</Text>
            </View>
            <Text className="text-2xl font-bold text-ink mb-2">
              {hasMore ? "You've seen them all!" : 'No stamps to discover'}
            </Text>
            <Text className="text-ink-muted text-center mb-8">
              {hasMore
                ? 'Check back later for more stamps'
                : 'Scan some stamps to build the catalog'
              }
            </Text>
            <Pressable
              onPress={handleRefresh}
              className="bg-forest-900 rounded-xl py-4 px-8"
            >
              <Text className="text-white font-semibold">Refresh</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-ink">Discover</Text>
            <Text className="text-ink-muted text-sm">
              Swipe right to add to favorites
            </Text>
          </View>

          {/* Stats */}
          <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
            <View className="bg-white/70 px-3 py-2">
              <Text className="text-ink text-xs">Want List</Text>
              <Text className="text-forest-900 font-bold">
                {wantListCount} stamps
              </Text>
            </View>
          </BlurView>
        </View>
      </View>

      {/* Card Stack */}
      <View className="flex-1 items-center justify-center">
        {isLoading ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text className="text-ink-muted">Loading stamps...</Text>
          </Animated.View>
        ) : (
          <View className="relative" style={{ width: '100%', height: '100%' }}>
            <View className="absolute inset-0 items-center" style={{ top: 20 }}>
              {/* Render cards in reverse order so first card is on top */}
              {currentStamps.slice().reverse().map((stamp, reversedIndex) => {
                const actualIndex = currentStamps.length - 1 - reversedIndex;
                return (
                  <SwipeableStampCard
                    key={stamp.id}
                    stamp={stamp}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    isFirst={actualIndex === 0}
                  />
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Bottom Actions */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(400)}
        className="px-6 pb-6"
      >
        <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
          <View className="bg-white/70 flex-row items-center justify-center py-4 gap-8">
            {/* Skip Button */}
            <Pressable
              onPress={() => currentStamps[0] && handleSwipeLeft(currentStamps[0])}
              className="w-16 h-16 rounded-full bg-red-100 items-center justify-center active:scale-95"
              disabled={currentStamps.length === 0}
            >
              <Text className="text-red-500 text-2xl font-bold">X</Text>
            </Pressable>

            {/* Undo Button */}
            <Pressable
              onPress={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                }
              }}
              className="w-12 h-12 rounded-full bg-amber-100 items-center justify-center active:scale-95"
              disabled={currentIndex === 0}
            >
              <Text className="text-amber-600 text-lg font-bold">↺</Text>
            </Pressable>

            {/* Like Button */}
            <Pressable
              onPress={() => currentStamps[0] && handleSwipeRight(currentStamps[0])}
              className="w-16 h-16 rounded-full bg-green-100 items-center justify-center active:scale-95"
              disabled={currentStamps.length === 0}
            >
              <Text className="text-green-500 text-2xl font-bold">♥</Text>
            </Pressable>
          </View>
        </BlurView>

        {/* Progress indicator */}
        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-ink-muted text-xs">
            {currentIndex + 1} of {stamps.length} stamps
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
