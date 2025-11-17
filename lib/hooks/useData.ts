import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';

/**
 * Example hook for fetching user profile
 * Replace this with your actual data fetching logic
 */
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId, // Only run query if userId exists
  });
}

/**
 * Example hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { id: string; full_name?: string; avatar_url?: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] });
    },
  });
}

/**
 * Example hook for fetching a list of items
 * Demonstrates pagination support
 */
export function useItems(page: number = 0, pageSize: number = 10) {
  return useQuery({
    queryKey: ['items', page, pageSize],
    queryFn: async () => {
      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from('items')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        items: data,
        totalCount: count ?? 0,
        hasMore: (count ?? 0) > end + 1,
      };
    },
  });
}

/**
 * Example hook for creating an item
 */
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: { title: string; description?: string }) => {
      const { data, error } = await supabase
        .from('items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate items list to refetch
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

/**
 * Example hook for deleting an item
 */
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return itemId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
