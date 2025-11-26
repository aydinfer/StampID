import React from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useStamps, useCollectionValue } from '@/lib/hooks/useStamps';
import { StampCard } from '@/components/stamps/StampCard';

export default function HomeScreen() {
  const { data: stamps, isLoading, refetch } = useStamps();
  const { count, average } = useCollectionValue();

  const recentStamps = stamps?.slice(0, 4) || [];

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#1B4332"
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-3xl font-bold text-ink">StampID</Text>
          <Text className="text-ink-light mt-1">Your digital stamp collection</Text>
        </View>

        {/* Stats Card */}
        <Animated.View entering={FadeIn.duration(400)} className="px-4 mt-4">
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-forest-900 p-5">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white/70 text-sm">Total Stamps</Text>
                  <Text className="text-white text-3xl font-bold">{count}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-white/70 text-sm">Est. Value</Text>
                  <Text className="text-white text-3xl font-bold">
                    ${average.toFixed(0)}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push('/camera')}
                className="bg-white/20 rounded-xl py-3 mt-4 items-center active:bg-white/30"
              >
                <Text className="text-white font-semibold">📷 Scan New Stamp</Text>
              </Pressable>
            </View>
          </BlurView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} className="px-4 mt-6">
          <Text className="text-lg font-semibold text-ink mb-3 px-2">Quick Actions</Text>
          <View className="flex-row gap-3">
            <QuickAction
              icon="📷"
              label="Scan"
              onPress={() => router.push('/camera')}
            />
            <QuickAction
              icon="📚"
              label="Collections"
              onPress={() => router.push('/(tabs)/collection')}
            />
            <QuickAction
              icon="🔍"
              label="Search"
              onPress={() => {}}
            />
            <QuickAction
              icon="⭐"
              label="Favorites"
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Recent Stamps */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} className="mt-6">
          <View className="flex-row justify-between items-center px-6 mb-3">
            <Text className="text-lg font-semibold text-ink">Recent Stamps</Text>
            {stamps && stamps.length > 4 && (
              <Pressable onPress={() => router.push('/(tabs)/collection')}>
                <Text className="text-forest-900 font-medium">See All</Text>
              </Pressable>
            )}
          </View>

          {recentStamps.length > 0 ? (
            <View className="flex-row flex-wrap px-4 justify-between">
              {recentStamps.map((stamp, index) => (
                <StampCard
                  key={stamp.id}
                  stamp={stamp}
                  index={index}
                  onPress={() => router.push(`/stamp/${stamp.id}`)}
                />
              ))}
            </View>
          ) : (
            <EmptyState />
          )}
        </Animated.View>

        {/* Tips */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} className="px-4 mt-6">
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70 p-4">
              <Text className="text-ink font-semibold mb-2">💡 Pro Tip</Text>
              <Text className="text-ink-light text-sm">
                Scan multiple stamps at once! Our AI can detect and identify several stamps in a single photo.
              </Text>
            </View>
          </BlurView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-1">
      <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
        <View className="bg-white/70 p-3 items-center active:bg-white">
          <Text className="text-2xl mb-1">{icon}</Text>
          <Text className="text-ink text-xs font-medium">{label}</Text>
        </View>
      </BlurView>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="items-center py-8 px-6">
      <Text className="text-5xl mb-3">📭</Text>
      <Text className="text-ink font-semibold text-base mb-1">No stamps yet</Text>
      <Text className="text-ink-light text-center text-sm mb-4">
        Scan your first stamp to start building your collection
      </Text>
      <Pressable
        onPress={() => router.push('/camera')}
        className="bg-forest-900 rounded-xl py-3 px-6 active:opacity-90"
      >
        <Text className="text-white font-semibold">Scan First Stamp</Text>
      </Pressable>
    </View>
  );
}
