import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  PieChart,
  Globe,
  Calendar,
  Star,
} from 'lucide-react-native';
import { useStamps, useCollectionValue } from '@/lib/hooks/useStamps';
import { useCollections } from '@/lib/hooks/useCollections';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function StatsScreen() {
  const { data: stamps, isLoading: stampsLoading } = useStamps();
  const { data: collections, isLoading: collectionsLoading } = useCollections();
  const { count, low, high, average } = useCollectionValue();

  const isLoading = stampsLoading || collectionsLoading;
  const totalValue = (low + high) / 2;

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!stamps || stamps.length === 0) {
      return {
        totalStamps: 0,
        totalCollections: collections?.length || 0,
        totalValue: 0,
        averageValue: 0,
        byCountry: [] as { country: string; count: number }[],
        byRarity: [] as { rarity: string; count: number }[],
        byCondition: [] as { condition: string; count: number }[],
        byDecade: [] as { decade: string; count: number }[],
        favorites: 0,
      };
    }

    // Count by country
    const countryMap = new Map<string, number>();
    stamps.forEach((s) => {
      const country = s.country || 'Unknown';
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });
    const byCountry = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Count by rarity
    const rarityMap = new Map<string, number>();
    stamps.forEach((s) => {
      const rarity = s.rarity || 'unknown';
      rarityMap.set(rarity, (rarityMap.get(rarity) || 0) + 1);
    });
    const byRarity = Array.from(rarityMap.entries())
      .map(([rarity, count]) => ({ rarity, count }))
      .sort((a, b) => b.count - a.count);

    // Count by condition
    const conditionMap = new Map<string, number>();
    stamps.forEach((s) => {
      const condition = s.condition || 'unknown';
      conditionMap.set(condition, (conditionMap.get(condition) || 0) + 1);
    });
    const byCondition = Array.from(conditionMap.entries())
      .map(([condition, count]) => ({ condition, count }))
      .sort((a, b) => b.count - a.count);

    // Count by decade
    const decadeMap = new Map<string, number>();
    stamps.forEach((s) => {
      if (s.year_issued) {
        const decade = `${Math.floor(s.year_issued / 10) * 10}s`;
        decadeMap.set(decade, (decadeMap.get(decade) || 0) + 1);
      }
    });
    const byDecade = Array.from(decadeMap.entries())
      .map(([decade, count]) => ({ decade, count }))
      .sort((a, b) => a.decade.localeCompare(b.decade));

    // Count favorites
    const favorites = stamps.filter((s) => s.is_favorite).length;

    return {
      totalStamps: stamps.length,
      totalCollections: collections?.length || 0,
      totalValue,
      averageValue: average,
      byCountry,
      byRarity,
      byCondition,
      byDecade,
      favorites,
    };
  }, [stamps, collections, totalValue, average]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-forest-900/10">
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2">
          <ChevronLeft size={24} color="#1B4332" />
          <Text className="text-forest-900 font-medium">Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-ink flex-1 text-center mr-12">
          Statistics
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Overview Cards */}
        <Animated.View entering={FadeIn.duration(400)} className="px-4 pt-6">
          <View className="flex-row gap-4">
            <StatCard
              title="Total Stamps"
              value={stats.totalStamps.toString()}
              icon={<BarChart3 size={20} color="#1B4332" />}
              delay={0}
            />
            <StatCard
              title="Collections"
              value={stats.totalCollections.toString()}
              icon={<PieChart size={20} color="#1B4332" />}
              delay={100}
            />
          </View>
        </Animated.View>

        {/* Value Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-4 pt-4">
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-forest-900/10 p-5">
              <Text className="text-sm text-forest-900/70 mb-1">Total Collection Value</Text>
              <View className="flex-row items-baseline">
                <Text className="text-4xl font-bold text-forest-900">
                  ${stats.totalValue.toFixed(2)}
                </Text>
                <Text className="text-ink-light ml-2">USD</Text>
              </View>
              <View className="flex-row items-center mt-2">
                <Text className="text-ink-light">
                  Avg. stamp value: ${stats.averageValue.toFixed(2)}
                </Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Quick Stats Row */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-4 pt-4">
          <View className="flex-row gap-4">
            <MiniStatCard
              label="Favorites"
              value={stats.favorites}
              icon={<Star size={16} color="#1B4332" fill="#1B4332" />}
            />
            <MiniStatCard
              label="Countries"
              value={stats.byCountry.length}
              icon={<Globe size={16} color="#1B4332" />}
            />
            <MiniStatCard
              label="Decades"
              value={stats.byDecade.length}
              icon={<Calendar size={16} color="#1B4332" />}
            />
          </View>
        </Animated.View>

        {/* By Country */}
        {stats.byCountry.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(400)} className="px-4 pt-6">
            <Text className="text-lg font-semibold text-ink mb-3">Top Countries</Text>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                {stats.byCountry.map((item, index) => (
                  <View key={item.country}>
                    <BarRow
                      label={item.country}
                      value={item.count}
                      total={stats.totalStamps}
                    />
                    {index < stats.byCountry.length - 1 && (
                      <View className="h-px bg-forest-900/10 my-3" />
                    )}
                  </View>
                ))}
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* By Rarity */}
        {stats.byRarity.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500).duration(400)} className="px-4 pt-6">
            <Text className="text-lg font-semibold text-ink mb-3">By Rarity</Text>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                {stats.byRarity.map((item, index) => (
                  <View key={item.rarity}>
                    <BarRow
                      label={formatRarity(item.rarity)}
                      value={item.count}
                      total={stats.totalStamps}
                      color={getRarityColor(item.rarity)}
                    />
                    {index < stats.byRarity.length - 1 && (
                      <View className="h-px bg-forest-900/10 my-3" />
                    )}
                  </View>
                ))}
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* By Condition */}
        {stats.byCondition.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(400)} className="px-4 pt-6">
            <Text className="text-lg font-semibold text-ink mb-3">By Condition</Text>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                {stats.byCondition.map((item, index) => (
                  <View key={item.condition}>
                    <BarRow
                      label={formatCondition(item.condition)}
                      value={item.count}
                      total={stats.totalStamps}
                    />
                    {index < stats.byCondition.length - 1 && (
                      <View className="h-px bg-forest-900/10 my-3" />
                    )}
                  </View>
                ))}
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* By Decade */}
        {stats.byDecade.length > 0 && (
          <Animated.View entering={FadeInDown.delay(700).duration(400)} className="px-4 pt-6">
            <Text className="text-lg font-semibold text-ink mb-3">By Decade</Text>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                {stats.byDecade.map((item, index) => (
                  <View key={item.decade}>
                    <BarRow
                      label={item.decade}
                      value={item.count}
                      total={stats.totalStamps}
                    />
                    {index < stats.byDecade.length - 1 && (
                      <View className="h-px bg-forest-900/10 my-3" />
                    )}
                  </View>
                ))}
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Empty State */}
        {stats.totalStamps === 0 && (
          <View className="px-8 mt-12 items-center">
            <BarChart3 size={48} color="#9CA3AF" strokeWidth={1.5} />
            <Text className="text-ink font-semibold text-lg mt-4 mb-2">
              No Statistics Yet
            </Text>
            <Text className="text-ink-light text-center">
              Start scanning stamps to see your collection statistics.
            </Text>
            <Pressable
              onPress={() => router.push('/camera')}
              className="mt-6 bg-forest-900 rounded-xl py-3 px-6 active:opacity-90"
            >
              <Text className="text-white font-semibold">Scan Your First Stamp</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Stat card component
function StatCard({
  title,
  value,
  icon,
  delay,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400)} className="flex-1">
      <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
        <View className="bg-white/70 p-4">
          <View className="flex-row items-center justify-between mb-2">
            {icon}
          </View>
          <Text className="text-3xl font-bold text-ink">{value}</Text>
          <Text className="text-ink-light text-sm mt-1">{title}</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}

// Mini stat card
function MiniStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <View className="flex-1">
      <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
        <View className="bg-white/70 p-3 items-center">
          {icon}
          <Text className="text-xl font-bold text-ink mt-1">{value}</Text>
          <Text className="text-ink-light text-xs">{label}</Text>
        </View>
      </BlurView>
    </View>
  );
}

// Bar row for statistics
function BarRow({
  label,
  value,
  total,
  color = '#1B4332',
}: {
  label: string;
  value: number;
  total: number;
  color?: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-ink font-medium">{label}</Text>
        <Text className="text-ink-light">
          {value} ({percentage.toFixed(0)}%)
        </Text>
      </View>
      <View className="h-2 bg-forest-900/10 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

// Format rarity label
function formatRarity(rarity: string): string {
  return rarity
    .replace('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Get rarity color
function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'very_rare':
      return '#9333EA';
    case 'rare':
      return '#2563EB';
    case 'uncommon':
      return '#059669';
    case 'common':
    default:
      return '#1B4332';
  }
}

// Format condition label
function formatCondition(condition: string): string {
  return condition
    .replace('_', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
