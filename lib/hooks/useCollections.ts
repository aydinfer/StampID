import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import type { Collection, CollectionInsert, CollectionUpdate } from '../supabase/types';

// Query keys
const COLLECTIONS_KEY = ['collections'];
const collectionKey = (id: string) => ['collections', id];

// Collection with computed fields
export interface CollectionWithStats extends Collection {
  stamp_count: number;
  total_value: number;
}

// Fetch all collections for current user
export function useCollections() {
  return useQuery({
    queryKey: COLLECTIONS_KEY,
    queryFn: async (): Promise<CollectionWithStats[]> => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          stamp_collections(
            stamps(estimated_value_low, estimated_value_high)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate stats for each collection
      return (data || []).map((c: any) => {
        const stamps = c.stamp_collections?.map((sc: any) => sc.stamps).filter(Boolean) || [];
        const totalValue = stamps.reduce((sum: number, s: any) => {
          const avg = ((s.estimated_value_low || 0) + (s.estimated_value_high || 0)) / 2;
          return sum + avg;
        }, 0);

        return {
          ...c,
          stamp_count: stamps.length,
          total_value: totalValue,
          stamp_collections: undefined, // Remove raw data
        };
      });
    },
  });
}

// Fetch single collection with stamps
export function useCollection(id: string) {
  return useQuery({
    queryKey: collectionKey(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          stamp_collections(
            added_at,
            stamps(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const stamps = data.stamp_collections?.map((sc: any) => ({
        ...sc.stamps,
        added_at: sc.added_at,
      })).filter(Boolean) || [];

      const totalValue = stamps.reduce((sum: number, s: any) => {
        const avg = ((s.estimated_value_low || 0) + (s.estimated_value_high || 0)) / 2;
        return sum + avg;
      }, 0);

      return {
        ...data,
        stamps,
        stamp_count: stamps.length,
        total_value: totalValue,
        stamp_collections: undefined,
      };
    },
    enabled: !!id,
  });
}

// Create collection
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collection: CollectionInsert): Promise<Collection> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('collections')
        .insert({ ...collection, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_KEY });
    },
  });
}

// Update collection
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CollectionUpdate & { id: string }): Promise<Collection> => {
      const { data, error } = await supabase
        .from('collections')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: collectionKey(data.id) });
    },
  });
}

// Delete collection
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_KEY });
    },
  });
}

// Add stamp to collection
export function useAddStampToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stampId, collectionId }: { stampId: string; collectionId: string }) => {
      const { error } = await supabase
        .from('stamp_collections')
        .insert({ stamp_id: stampId, collection_id: collectionId });

      if (error) throw error;
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: collectionKey(collectionId) });
      queryClient.invalidateQueries({ queryKey: ['stamps', 'collection', collectionId] });
    },
  });
}

// Remove stamp from collection
export function useRemoveStampFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stampId, collectionId }: { stampId: string; collectionId: string }) => {
      const { error } = await supabase
        .from('stamp_collections')
        .delete()
        .eq('stamp_id', stampId)
        .eq('collection_id', collectionId);

      if (error) throw error;
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: collectionKey(collectionId) });
      queryClient.invalidateQueries({ queryKey: ['stamps', 'collection', collectionId] });
    },
  });
}

// Add multiple stamps to collection at once
export function useAddStampsToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stampIds, collectionId }: { stampIds: string[]; collectionId: string }) => {
      const inserts = stampIds.map(stamp_id => ({
        stamp_id,
        collection_id: collectionId,
      }));

      const { error } = await supabase
        .from('stamp_collections')
        .upsert(inserts, { onConflict: 'stamp_id,collection_id' });

      if (error) throw error;
    },
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: collectionKey(collectionId) });
    },
  });
}
