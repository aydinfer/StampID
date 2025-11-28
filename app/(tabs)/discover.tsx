import React, { useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Compass, X, RotateCcw, Heart, RefreshCw } from 'lucide-react-native';
import { SwipeableStampCard } from '@/components/discover/SwipeableStampCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { useDiscoverStamps, useAddToWantList, useDiscoveryStats } from '@/lib/hooks/useDiscover';
import { Feedback } from '@/lib/utils/feedback';
import { colors } from '@/lib/design/tokens';
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
      <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
        <View className="px-6 pt-4 pb-2">
          <Text className="text-display font-sans-bold text-zinc-900">Discover</Text>
          <Text className="text-caption text-zinc-500 mt-1">Find new stamps</Text>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Animated.View entering={FadeIn.duration(400)} className="items-center">
            <View className="w-20 h-20 rounded-full bg-indigo-50 items-center justify-center mb-6">
              <Compass size={40} color={colors.indigo[500]} />
            </View>
            <Text className="text-title font-sans-bold text-zinc-900 mb-2">
              {hasMore ? "You've seen them all!" : 'No stamps to discover'}
            </Text>
            <Text className="text-zinc-500 text-center text-caption mb-8">
              {hasMore
                ? 'Check back later for more stamps'
                : 'Scan some stamps to build the catalog'
              }
            </Text>
            <Pressable
              onPress={handleRefresh}
              className="bg-indigo-500 rounded-xl py-3.5 px-8 flex-row items-center active:opacity-90"
            >
              <RefreshCw size={18} color="#FFFFFF" />
              <Text className="text-white font-sans-semibold ml-2">Refresh</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-display font-sans-bold text-zinc-900">Discover</Text>
            <Text className="text-caption text-zinc-500 mt-1">
              Swipe right to add to favorites
            </Text>
          </View>

          {/* Stats */}
          <GlassCard variant="subtle" padding="sm">
            <View className="items-end">
              <Text className="text-zinc-500 text-micro">Want List</Text>
              <Text className="text-indigo-500 font-sans-bold text-body">
                {wantListCount}
              </Text>
            </View>
          </GlassCard>
        </View>
      </View>

      {/* Card Stack */}
      <View className="flex-1 items-center justify-center">
        {isLoading ? (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text className="text-zinc-400 font-sans-medium">Loading stamps...</Text>
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
        <GlassCard variant="card" padding="md">
          <View className="flex-row items-center justify-center py-2 gap-8">
            {/* Skip Button */}
            <Pressable
              onPress={() => currentStamps[0] && handleSwipeLeft(currentStamps[0])}
              className="w-16 h-16 rounded-full bg-rose-50 items-center justify-center active:scale-95"
              disabled={currentStamps.length === 0}
            >
              <X size={28} color={colors.rose[500]} strokeWidth={2.5} />
            </Pressable>

            {/* Undo Button */}
            <Pressable
              onPress={() => {
                if (currentIndex > 0) {
                  setCurrentIndex((prev) => prev - 1);
                }
              }}
              className={`w-12 h-12 rounded-full bg-amber-50 items-center justify-center active:scale-95 ${currentIndex === 0 ? 'opacity-40' : ''}`}
              disabled={currentIndex === 0}
            >
              <RotateCcw size={22} color={colors.amber[600]} />
            </Pressable>

            {/* Like Button */}
            <Pressable
              onPress={() => currentStamps[0] && handleSwipeRight(currentStamps[0])}
              className="w-16 h-16 rounded-full bg-teal-50 items-center justify-center active:scale-95"
              disabled={currentStamps.length === 0}
            >
              <Heart size={28} color={colors.teal[500]} strokeWidth={2.5} />
            </Pressable>
          </View>
        </GlassCard>

        {/* Progress indicator */}
        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-zinc-400 text-micro font-sans-medium">
            {currentIndex + 1} of {stamps.length} stamps
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
