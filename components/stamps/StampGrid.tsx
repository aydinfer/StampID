import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StampCard } from './StampCard';
import type { Stamp } from '@/lib/supabase/types';

interface StampGridProps {
  stamps: Stamp[];
  loading?: boolean;
  onRefresh?: () => void;
  selectionMode?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  emptyMessage?: string;
  ListHeaderComponent?: React.ReactElement;
}

export function StampGrid({
  stamps,
  loading,
  onRefresh,
  selectionMode,
  selectedIds = [],
  onSelectionChange,
  emptyMessage = 'No stamps yet',
  ListHeaderComponent,
}: StampGridProps) {
  const handlePress = (stamp: Stamp) => {
    if (selectionMode) {
      const newSelection = selectedIds.includes(stamp.id)
        ? selectedIds.filter(id => id !== stamp.id)
        : [...selectedIds, stamp.id];
      onSelectionChange?.(newSelection);
    } else {
      router.push(`/stamp/${stamp.id}`);
    }
  };

  const handleLongPress = (stamp: Stamp) => {
    if (!selectionMode && onSelectionChange) {
      onSelectionChange([stamp.id]);
    }
  };

  const renderItem = ({ item, index }: { item: Stamp; index: number }) => (
    <StampCard
      stamp={item}
      index={index}
      onPress={() => handlePress(item)}
      onLongPress={() => handleLongPress(item)}
      selected={selectedIds.includes(item.id)}
    />
  );

  if (stamps.length === 0 && !loading) {
    return (
      <Animated.View
        entering={FadeInDown.duration(400)}
        className="flex-1 items-center justify-center py-20"
      >
        <Text className="text-6xl mb-4">📭</Text>
        <Text className="text-ink-light text-center text-lg">{emptyMessage}</Text>
        <Pressable
          onPress={() => router.push('/camera')}
          className="mt-6 bg-forest-900 rounded-xl py-3 px-6 active:opacity-90"
        >
          <Text className="text-white font-semibold">Scan Your First Stamp</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <FlatList
      data={stamps}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading || false}
            onRefresh={onRefresh}
            tintColor="#1B4332"
            colors={['#1B4332']}
          />
        ) : undefined
      }
    />
  );
}
