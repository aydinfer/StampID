import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Search, HelpCircle } from 'lucide-react-native';
import { SearchBar } from '@/components/search/SearchBar';
import { StampCard } from '@/components/stamps/StampCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { useStampSearch, SearchFilters } from '@/lib/hooks/useSearch';
import { colors } from '@/lib/design/tokens';
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
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-display font-sans-bold text-zinc-900">Search</Text>
        <Text className="text-caption text-zinc-500 mt-1">Find stamps in your collection</Text>
      </View>
      <View className="px-4 mb-4">

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
      <View className="h-px bg-zinc-100" />

      {/* Results */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-zinc-400 font-sans-medium">Searching...</Text>
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
              <Text className="text-zinc-500 text-caption font-sans-medium mb-3">
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
            <View className="w-16 h-16 rounded-full bg-zinc-100 items-center justify-center mb-4">
              <HelpCircle size={32} color={colors.zinc[400]} />
            </View>
            <Text className="text-zinc-900 font-sans-semibold text-body mb-1">No Results</Text>
            <Text className="text-zinc-500 text-center text-caption px-8">
              No stamps found for "{query}". Try a different search term.
            </Text>
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="flex-1 items-center justify-center"
          >
            <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center mb-4">
              <Search size={32} color={colors.indigo[500]} />
            </View>
            <Text className="text-zinc-900 font-sans-semibold text-body mb-1">
              Search Your Collection
            </Text>
            <Text className="text-zinc-500 text-center text-caption px-8">
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
      <GlassCard variant="subtle" padding="none" rounded="full">
        <View
          className={`px-3 py-1.5 ${
            active ? 'bg-indigo-500' : 'bg-white/70'
          }`}
        >
          <Text
            className={`text-micro font-sans-medium ${
              active ? 'text-white' : 'text-zinc-700'
            }`}
          >
            {label}
          </Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}
