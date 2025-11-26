import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import type { Stamp, StampInsert, StampUpdate } from '../supabase/types';

// Query keys
const STAMPS_KEY = ['stamps'];
const stampKey = (id: string) => ['stamps', id];

// Fetch all stamps for current user
export function useStamps() {
  return useQuery({
    queryKey: STAMPS_KEY,
    queryFn: async (): Promise<Stamp[]> => {
      const { data, error } = await supabase
        .from('stamps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}

// Fetch single stamp
export function useStamp(id: string) {
  return useQuery({
    queryKey: stampKey(id),
    queryFn: async (): Promise<Stamp | null> => {
      const { data, error } = await supabase
        .from('stamps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// Create stamp (from AI identification result)
export function useCreateStamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stamp: StampInsert): Promise<Stamp> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('stamps')
        .insert({ ...stamp, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAMPS_KEY });
    },
  });
}

// Update stamp
export function useUpdateStamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: StampUpdate & { id: string }): Promise<Stamp> => {
      const { data, error } = await supabase
        .from('stamps')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STAMPS_KEY });
      queryClient.invalidateQueries({ queryKey: stampKey(data.id) });
    },
  });
}

// Delete stamp
export function useDeleteStamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('stamps')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAMPS_KEY });
    },
  });
}

// Toggle favorite
export function useFavoriteStamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_favorite }: { id: string; is_favorite: boolean }): Promise<Stamp> => {
      const { data, error } = await supabase
        .from('stamps')
        .update({ is_favorite })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STAMPS_KEY });
      queryClient.invalidateQueries({ queryKey: stampKey(data.id) });
    },
  });
}

// Get stamps by collection
export function useStampsByCollection(collectionId: string) {
  return useQuery({
    queryKey: ['stamps', 'collection', collectionId],
    queryFn: async (): Promise<Stamp[]> => {
      const { data, error } = await supabase
        .from('stamp_collections')
        .select('stamp_id, stamps(*)')
        .eq('collection_id', collectionId);

      if (error) throw error;
      return data?.map((sc: any) => sc.stamps).filter(Boolean) || [];
    },
    enabled: !!collectionId,
  });
}

// Get favorite stamps
export function useFavoriteStamps() {
  return useQuery({
    queryKey: ['stamps', 'favorites'],
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

// Calculate total collection value
export function useCollectionValue() {
  const { data: stamps } = useStamps();

  const totalLow = stamps?.reduce((sum, s) => sum + (s.estimated_value_low || 0), 0) || 0;
  const totalHigh = stamps?.reduce((sum, s) => sum + (s.estimated_value_high || 0), 0) || 0;

  return {
    low: totalLow,
    high: totalHigh,
    average: (totalLow + totalHigh) / 2,
    count: stamps?.length || 0,
  };
}
