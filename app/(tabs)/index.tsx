import React from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Camera, FolderOpen, Search, Star, Lightbulb } from 'lucide-react-native';
import { useStamps, useCollectionValue } from '@/lib/hooks/useStamps';
import { StampCard } from '@/components/stamps/StampCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors } from '@/lib/design/tokens';

export default function HomeScreen() {
  const { data: stamps, isLoading, refetch } = useStamps();
  const { count, average } = useCollectionValue();

  const recentStamps = stamps?.slice(0, 4) || [];

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.indigo[500]}
          />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-2">
          <Text className="text-display font-sans-bold text-zinc-900">StampID</Text>
          <Text className="text-caption text-zinc-500 mt-1">Your digital stamp collection</Text>
        </View>

        {/* Stats Card */}
        <Animated.View entering={FadeIn.duration(400)} className="px-4 mt-4">
          <GlassCard variant="card" padding="lg">
            <View className="bg-indigo-500 -m-6 p-5 rounded-2xl">
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white/70 text-caption">Total Stamps</Text>
                  <Text className="text-white text-display font-sans-bold">{count}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-white/70 text-caption">Est. Value</Text>
                  <Text className="text-white text-display font-sans-bold">
                    ${average.toFixed(0)}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push('/camera')}
                className="bg-white/20 rounded-xl py-3.5 mt-5 flex-row items-center justify-center active:bg-white/30"
              >
                <Camera size={20} color="#FFFFFF" strokeWidth={2} />
                <Text className="text-white font-sans-semibold ml-2">Scan New Stamp</Text>
              </Pressable>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} className="px-4 mt-6">
          <Text className="text-headline font-sans-semibold text-zinc-900 mb-3 px-2">Quick Actions</Text>
          <View className="flex-row gap-3">
            <QuickAction
              icon={<Camera size={24} color={colors.indigo[500]} />}
              label="Scan"
              onPress={() => router.push('/camera')}
            />
            <QuickAction
              icon={<FolderOpen size={24} color={colors.indigo[500]} />}
              label="Collections"
              onPress={() => router.push('/(tabs)/collection')}
            />
            <QuickAction
              icon={<Search size={24} color={colors.indigo[500]} />}
              label="Search"
              onPress={() => router.push('/(tabs)/search')}
            />
            <QuickAction
              icon={<Star size={24} color={colors.indigo[500]} />}
              label="Favorites"
              onPress={() => router.push('/wantlist')}
            />
          </View>
        </Animated.View>

        {/* Recent Stamps */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} className="mt-6">
          <View className="flex-row justify-between items-center px-6 mb-3">
            <Text className="text-headline font-sans-semibold text-zinc-900">Recent Stamps</Text>
            {stamps && stamps.length > 4 && (
              <Pressable onPress={() => router.push('/(tabs)/collection')}>
                <Text className="text-indigo-500 font-sans-medium">See All</Text>
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
          <GlassCard variant="card" padding="md">
            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center mr-3">
                <Lightbulb size={20} color={colors.amber[600]} />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-900 font-sans-semibold mb-1">Pro Tip</Text>
                <Text className="text-zinc-500 text-caption leading-5">
                  Scan multiple stamps at once! Our AI can detect and identify several stamps in a single photo.
                </Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  label,
  onPress
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} className="flex-1">
      <GlassCard variant="subtle" padding="sm">
        <View className="items-center py-1">
          {icon}
          <Text className="text-zinc-700 text-micro font-sans-medium mt-2">{label}</Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <View className="items-center py-8 px-6">
      <View className="w-16 h-16 rounded-full bg-zinc-100 items-center justify-center mb-4">
        <Camera size={32} color={colors.zinc[400]} />
      </View>
      <Text className="text-zinc-900 font-sans-semibold text-body mb-1">No stamps yet</Text>
      <Text className="text-zinc-500 text-center text-caption mb-4">
        Scan your first stamp to start building your collection
      </Text>
      <Pressable
        onPress={() => router.push('/camera')}
        className="bg-indigo-500 rounded-xl py-3 px-6 active:opacity-90"
      >
        <Text className="text-white font-sans-semibold">Scan First Stamp</Text>
      </Pressable>
    </View>
  );
}
