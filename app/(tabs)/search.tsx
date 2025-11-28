import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SearchBar } from '@/components/search/SearchBar';
import { StampCard } from '@/components/stamps/StampCard';
import { useStampSearch, SearchFilters } from '@/lib/hooks/useSearch';
import type { Stamp } from '@/lib/supabase/types';

export default function SearchScreen() {
  const {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    isLoading,
    suggestions,
    isLoadingSuggestions,
    recentSearches,
    executeSearch,
    loadRecentSearches,
    clearRecentSearches,
  } = useStampSearch();

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  const handleSuggestionPress = useCallback((stamp: Stamp) => {
    router.push(`/stamp/${stamp.id}`);
  }, []);

  const handleRecentPress = useCallback((recentQuery: string) => {
    executeSearch(recentQuery);
  }, [executeSearch]);

  const handleStampPress = useCallback((stamp: Stamp) => {
    router.push(`/stamp/${stamp.id}`);
  }, []);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-ink mb-4">Search</Text>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={executeSearch}
          suggestions={suggestions}
          recentSearches={recentSearches}
          isLoadingSuggestions={isLoadingSuggestions}
          onSuggestionPress={handleSuggestionPress}
          onRecentPress={handleRecentPress}
          onClearRecent={clearRecentSearches}
          placeholder="Search by name, country, catalog #..."
        />

        {/* Filter Pills */}
        <View className="flex-row flex-wrap mt-3 gap-2">
          <FilterPill
            label="All Countries"
            active={!filters.country}
            onPress={() => setFilters({ ...filters, country: undefined })}
          />
          <FilterPill
            label="Mint Only"
            active={filters.condition === 'mint'}
            onPress={() =>
              setFilters({
                ...filters,
                condition: filters.condition === 'mint' ? undefined : 'mint',
              })
            }
          />
          <FilterPill
            label="Rare+"
            active={filters.rarity === 'rare' || filters.rarity === 'very_rare'}
            onPress={() =>
              setFilters({
                ...filters,
                rarity: filters.rarity === 'rare' ? undefined : 'rare',
              })
            }
          />
        </View>
      </View>

      {/* Results */}
      <View className="flex-1 px-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-ink-muted">Searching...</Text>
          </View>
        ) : results.length > 0 ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text className="text-ink-muted text-sm mb-3">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </Text>
            }
            renderItem={({ item, index }) => (
              <StampCard
                stamp={item}
                index={index}
                onPress={() => handleStampPress(item)}
              />
            )}
          />
        ) : query.length > 0 ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="flex-1 items-center justify-center"
          >
            <View className="w-16 h-16 rounded-full bg-ink-muted/10 items-center justify-center mb-4">
              <Text className="text-ink-muted text-2xl">?</Text>
            </View>
            <Text className="text-ink font-semibold text-lg mb-1">No Results</Text>
            <Text className="text-ink-muted text-center px-8">
              No stamps found for "{query}". Try a different search term.
            </Text>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="flex-1 items-center justify-center"
          >
            <View className="w-16 h-16 rounded-full bg-forest-100 items-center justify-center mb-4">
              <Text className="text-forest-900 text-2xl font-bold">S</Text>
            </View>
            <Text className="text-ink font-semibold text-lg mb-1">
              Search Your Collection
            </Text>
            <Text className="text-ink-muted text-center px-8">
              Find stamps by name, country, year, or catalog number
            </Text>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

// Filter pill component
function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <BlurView intensity={20} tint="light" className="rounded-full overflow-hidden">
        <View
          className={`px-3 py-1.5 ${
            active ? 'bg-forest-900' : 'bg-white/70'
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              active ? 'text-white' : 'text-ink'
            }`}
          >
            {label}
          </Text>
        </View>
      </BlurView>
    </Pressable>
  );
}
