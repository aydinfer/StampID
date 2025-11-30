import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { ChevronLeft, ArrowLeftRight, Plus } from 'lucide-react-native';
import { useStamp } from '@/lib/hooks/useStamps';
import type { Stamp } from '@/lib/supabase/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function CompareScreen() {
  const { stampId1, stampId2 } = useLocalSearchParams<{
    stampId1?: string;
    stampId2?: string;
  }>();

  const { data: stamp1, isLoading: loading1 } = useStamp(stampId1 || '');
  const { data: stamp2, isLoading: loading2 } = useStamp(stampId2 || '');

  const isLoading = loading1 || loading2;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-forest-900/10">
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2">
          <ChevronLeft size={24} color="#1B4332" />
          <Text className="text-forest-900 font-medium">Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-ink flex-1 text-center mr-12">
          Compare Stamps
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Stamp Cards Row */}
        <View className="flex-row px-4 pt-6 gap-4">
          {/* Stamp 1 */}
          <Animated.View entering={FadeInLeft.duration(400)} className="flex-1">
            {stamp1 ? (
              <StampCompareCard stamp={stamp1} label="Stamp A" />
            ) : (
              <EmptySlot onSelect={() => router.push('/search?select=1')} />
            )}
          </Animated.View>

          {/* VS Divider */}
          <View className="justify-center">
            <View className="w-10 h-10 rounded-full bg-forest-900/10 items-center justify-center">
              <ArrowLeftRight size={20} color="#1B4332" />
            </View>
          </View>

          {/* Stamp 2 */}
          <Animated.View entering={FadeInRight.duration(400)} className="flex-1">
            {stamp2 ? (
              <StampCompareCard stamp={stamp2} label="Stamp B" />
            ) : (
              <EmptySlot onSelect={() => router.push('/search?select=2')} />
            )}
          </Animated.View>
        </View>

        {/* Comparison Table */}
        {stamp1 && stamp2 && (
          <Animated.View entering={FadeIn.delay(300).duration(400)} className="px-4 mt-6">
            <Text className="text-lg font-semibold text-ink mb-3">Comparison</Text>

            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70">
                <CompareRow
                  label="Country"
                  value1={stamp1.country}
                  value2={stamp2.country}
                />
                <Divider />
                <CompareRow
                  label="Year"
                  value1={stamp1.year_issued?.toString()}
                  value2={stamp2.year_issued?.toString()}
                />
                <Divider />
                <CompareRow
                  label="Condition"
                  value1={stamp1.condition}
                  value2={stamp2.condition}
                />
                <Divider />
                <CompareRow
                  label="Rarity"
                  value1={stamp1.rarity}
                  value2={stamp2.rarity}
                  highlight
                />
                <Divider />
                <CompareRow
                  label="Value (Low)"
                  value1={stamp1.estimated_value_low ? `$${stamp1.estimated_value_low.toFixed(2)}` : null}
                  value2={stamp2.estimated_value_low ? `$${stamp2.estimated_value_low.toFixed(2)}` : null}
                  compareNumeric
                  numericValue1={stamp1.estimated_value_low}
                  numericValue2={stamp2.estimated_value_low}
                />
                <Divider />
                <CompareRow
                  label="Value (High)"
                  value1={stamp1.estimated_value_high ? `$${stamp1.estimated_value_high.toFixed(2)}` : null}
                  value2={stamp2.estimated_value_high ? `$${stamp2.estimated_value_high.toFixed(2)}` : null}
                  compareNumeric
                  numericValue1={stamp1.estimated_value_high}
                  numericValue2={stamp2.estimated_value_high}
                />
                <Divider />
                <CompareRow
                  label="Category"
                  value1={stamp1.category}
                  value2={stamp2.category}
                />
                <Divider />
                <CompareRow
                  label="Theme"
                  value1={stamp1.theme}
                  value2={stamp2.theme}
                />
                <Divider />
                <CompareRow
                  label="Catalog #"
                  value1={stamp1.catalog_number}
                  value2={stamp2.catalog_number}
                />
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Instructions when empty */}
        {(!stamp1 || !stamp2) && (
          <View className="px-8 mt-8 items-center">
            <Text className="text-ink-light text-center">
              Select two stamps to compare their details, values, and conditions side by side.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Stamp compare card
function StampCompareCard({ stamp, label }: { stamp: Stamp; label: string }) {
  return (
    <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
      <View className="bg-white/70 p-3">
        {/* Label */}
        <Text className="text-xs text-ink-light font-medium mb-2">{label}</Text>

        {/* Image */}
        <View className="aspect-square rounded-xl overflow-hidden mb-3">
          <Image
            source={{ uri: stamp.image_url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Name */}
        <Text className="text-sm font-semibold text-ink" numberOfLines={2}>
          {stamp.name}
        </Text>

        {/* Value */}
        {(stamp.estimated_value_low || stamp.estimated_value_high) && (
          <Text className="text-forest-900 font-medium mt-1">
            ${stamp.estimated_value_low?.toFixed(2) || '0'} - ${stamp.estimated_value_high?.toFixed(2) || '0'}
          </Text>
        )}
      </View>
    </BlurView>
  );
}

// Empty slot for selecting a stamp
function EmptySlot({ onSelect }: { onSelect: () => void }) {
  return (
    <Pressable onPress={onSelect}>
      <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
        <View className="bg-white/50 border-2 border-dashed border-forest-900/20 p-3 items-center">
          <View className="aspect-square w-full rounded-xl bg-forest-900/5 items-center justify-center mb-3">
            <Plus size={32} color="#1B4332" strokeWidth={1.5} />
          </View>
          <Text className="text-ink-light text-sm font-medium">Select Stamp</Text>
        </View>
      </BlurView>
    </Pressable>
  );
}

// Compare row component
function CompareRow({
  label,
  value1,
  value2,
  highlight = false,
  compareNumeric = false,
  numericValue1,
  numericValue2,
}: {
  label: string;
  value1?: string | null;
  value2?: string | null;
  highlight?: boolean;
  compareNumeric?: boolean;
  numericValue1?: number | null;
  numericValue2?: number | null;
}) {
  // Determine which value is higher for numeric comparison
  let winner: 'left' | 'right' | 'tie' | null = null;
  if (compareNumeric && numericValue1 != null && numericValue2 != null) {
    if (numericValue1 > numericValue2) winner = 'left';
    else if (numericValue2 > numericValue1) winner = 'right';
    else winner = 'tie';
  }

  return (
    <View className={`flex-row items-center p-4 ${highlight ? 'bg-forest-900/5' : ''}`}>
      {/* Value 1 */}
      <View className="flex-1 items-start">
        <Text
          className={`text-ink font-medium capitalize ${
            winner === 'left' ? 'text-forest-900' : ''
          }`}
        >
          {value1 || '-'}
        </Text>
      </View>

      {/* Label */}
      <View className="px-2">
        <Text className="text-xs text-ink-light font-medium">{label}</Text>
      </View>

      {/* Value 2 */}
      <View className="flex-1 items-end">
        <Text
          className={`text-ink font-medium capitalize ${
            winner === 'right' ? 'text-forest-900' : ''
          }`}
        >
          {value2 || '-'}
        </Text>
      </View>
    </View>
  );
}

// Divider component
function Divider() {
  return <View className="h-px bg-forest-900/10 mx-4" />;
}
