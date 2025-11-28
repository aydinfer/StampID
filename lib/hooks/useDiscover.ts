import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import type { Stamp } from '../supabase/types';

// Discovery state stored locally
const SEEN_STAMPS_KEY = 'discover_seen_stamps';

export interface DiscoveryState {
  stamps: Stamp[];
  currentIndex: number;
  wantList: Stamp[];
  skippedList: Stamp[];
}

// Fetch stamps for discovery (excluding user's own stamps)
export function useDiscoverStamps() {
  const queryClient = useQueryClient();
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ['discover', 'stamps', Array.from(seenIds)],
    queryFn: async (): Promise<Stamp[]> => {
      // Get stamps from all users (public discovery)
      // In production, this would be a curated catalog or other users' public stamps
      let queryBuilder = supabase
        .from('stamps')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      // Exclude already seen stamps
      if (seenIds.size > 0) {
        queryBuilder = queryBuilder.not('id', 'in', `(${Array.from(seenIds).join(',')})`);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mark stamp as seen
  const markSeen = useCallback((stampId: string) => {
    setSeenIds((prev) => new Set([...prev, stampId]));
  }, []);

  // Refresh discovery feed
  const refresh = useCallback(() => {
    setSeenIds(new Set());
    queryClient.invalidateQueries({ queryKey: ['discover', 'stamps'] });
  }, [queryClient]);

  return {
    stamps: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    markSeen,
    refresh,
    hasMore: (query.data?.length || 0) > 0,
  };
}

// Add to favorites (want list)
export function useAddToWantList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stamp: Stamp): Promise<Stamp> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if user already has this stamp
      const { data: existing } = await supabase
        .from('stamps')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', stamp.name)
        .eq('country', stamp.country)
        .maybeSingle();

      if (existing) {
        // Already have it, just favorite it
        const { data, error } = await supabase
          .from('stamps')
          .update({ is_favorite: true })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      // Create a copy in user's collection as favorite (want list item)
      const { data, error } = await supabase
        .from('stamps')
        .insert({
          user_id: user.id,
          name: stamp.name,
          country: stamp.country,
          year_issued: stamp.year_issued,
          catalog_number: stamp.catalog_number,
          denomination: stamp.denomination,
          category: stamp.category,
          theme: stamp.theme,
          condition: stamp.condition,
          estimated_value_low: stamp.estimated_value_low,
          estimated_value_high: stamp.estimated_value_high,
          currency: stamp.currency,
          rarity: stamp.rarity,
          description: stamp.description,
          image_url: stamp.image_url,
          thumbnail_url: stamp.thumbnail_url,
          is_favorite: true, // Mark as want list item
          notes: 'Added from Discover',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stamps'] });
      queryClient.invalidateQueries({ queryKey: ['stamps', 'favorites'] });
    },
  });
}

// Get want list (favorites)
export function useWantList() {
  return useQuery({
    queryKey: ['stamps', 'want-list'],
    queryFn: async (): Promise<Stamp[]> => {
      const { data, error } = await supabase
        .from('stamps')
        .select('*')
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Track discovery statistics
export function useDiscoveryStats() {
  const { data: wantList } = useWantList();

  return {
    wantListCount: wantList?.length || 0,
    totalValue: wantList?.reduce((sum, s) => {
      const avg = ((s.estimated_value_low || 0) + (s.estimated_value_high || 0)) / 2;
      return sum + avg;
    }, 0) || 0,
  };
}
