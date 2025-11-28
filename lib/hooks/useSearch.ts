import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import type { Stamp } from '../supabase/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCHES_KEY = '@stampid_recent_searches';
const MAX_RECENT_SEARCHES = 10;

// Search filters
export interface SearchFilters {
  country?: string;
  yearFrom?: number;
  yearTo?: number;
  condition?: string;
  rarity?: string;
  valueMin?: number;
  valueMax?: number;
}

// Search result with highlight info
export interface SearchResult extends Stamp {
  matchField?: 'name' | 'country' | 'catalog_number' | 'theme';
}

// Search parameters
interface SearchParams {
  query: string;
  filters?: SearchFilters;
  limit?: number;
}

// Hook for stamp search with autocomplete
export function useStampSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches on mount
  const loadRecentSearches = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Save search to recent
  const saveRecentSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      const updated = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  }, [recentSearches]);

  // Clear recent searches
  const clearRecentSearches = useCallback(async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  // Main search query
  const searchQuery = useQuery({
    queryKey: ['stamps', 'search', query, filters],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query.trim() && Object.keys(filters).length === 0) {
        return [];
      }

      let queryBuilder = supabase
        .from('stamps')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Text search across multiple fields
      if (query.trim()) {
        const searchTerm = `%${query.trim()}%`;
        queryBuilder = queryBuilder.or(
          `name.ilike.${searchTerm},country.ilike.${searchTerm},catalog_number.ilike.${searchTerm},theme.ilike.${searchTerm}`
        );
      }

      // Apply filters
      if (filters.country) {
        queryBuilder = queryBuilder.ilike('country', `%${filters.country}%`);
      }
      if (filters.yearFrom) {
        queryBuilder = queryBuilder.gte('year_issued', filters.yearFrom);
      }
      if (filters.yearTo) {
        queryBuilder = queryBuilder.lte('year_issued', filters.yearTo);
      }
      if (filters.condition) {
        queryBuilder = queryBuilder.eq('condition', filters.condition);
      }
      if (filters.rarity) {
        queryBuilder = queryBuilder.eq('rarity', filters.rarity);
      }
      if (filters.valueMin !== undefined) {
        queryBuilder = queryBuilder.gte('estimated_value_low', filters.valueMin);
      }
      if (filters.valueMax !== undefined) {
        queryBuilder = queryBuilder.lte('estimated_value_high', filters.valueMax);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return data || [];
    },
    enabled: query.trim().length > 0 || Object.keys(filters).length > 0,
    staleTime: 1000 * 60, // 1 minute
  });

  // Autocomplete suggestions (faster, more limited query)
  const autocompleteQuery = useQuery({
    queryKey: ['stamps', 'autocomplete', query],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query.trim() || query.length < 2) {
        return [];
      }

      const searchTerm = `%${query.trim()}%`;

      const { data, error } = await supabase
        .from('stamps')
        .select('id, name, country, year_issued, thumbnail_url, image_url')
        .or(`name.ilike.${searchTerm},country.ilike.${searchTerm}`)
        .limit(5);

      if (error) throw error;
      return (data || []) as SearchResult[];
    },
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Execute search and save to recent
  const executeSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
  }, [saveRecentSearch]);

  return {
    // State
    query,
    setQuery,
    filters,
    setFilters,
    recentSearches,

    // Queries
    results: searchQuery.data || [],
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
    error: searchQuery.error,

    // Autocomplete
    suggestions: autocompleteQuery.data || [],
    isLoadingSuggestions: autocompleteQuery.isLoading,

    // Actions
    executeSearch,
    loadRecentSearches,
    clearRecentSearches,
  };
}

// Hook for getting unique filter values
export function useSearchFilterOptions() {
  const countriesQuery = useQuery({
    queryKey: ['stamps', 'filter-options', 'countries'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('stamps')
        .select('country')
        .not('country', 'is', null)
        .order('country');

      if (error) throw error;

      // Get unique countries
      const countries = [...new Set(data?.map(d => d.country).filter(Boolean))] as string[];
      return countries;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const yearsQuery = useQuery({
    queryKey: ['stamps', 'filter-options', 'years'],
    queryFn: async (): Promise<{ min: number; max: number }> => {
      const { data, error } = await supabase
        .from('stamps')
        .select('year_issued')
        .not('year_issued', 'is', null)
        .order('year_issued', { ascending: true });

      if (error) throw error;

      const years = data?.map(d => d.year_issued).filter(Boolean) as number[];
      return {
        min: years[0] || 1840,
        max: years[years.length - 1] || new Date().getFullYear(),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    countries: countriesQuery.data || [],
    yearRange: yearsQuery.data || { min: 1840, max: new Date().getFullYear() },
    isLoading: countriesQuery.isLoading || yearsQuery.isLoading,
  };
}
