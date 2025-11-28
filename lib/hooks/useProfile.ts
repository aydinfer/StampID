import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase/client';
import type { Profile, ProfileUpdate } from '../supabase/types';

const PROFILE_KEY = ['profile'];

// Fetch current user's profile
export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async (): Promise<Profile | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // Profile might not exist yet, return null
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    },
  });
}

// Update profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate): Promise<Profile> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
}

// Update display name
export function useUpdateDisplayName() {
  const updateProfile = useUpdateProfile();

  return useMutation({
    mutationFn: async (displayName: string) => {
      return updateProfile.mutateAsync({ display_name: displayName });
    },
  });
}

// Update avatar
export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageUri: string): Promise<string> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload image to storage
      const fileName = `${user.id}/avatar-${Date.now()}.jpg`;
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
}

// Get subscription info from profile
export function useProfileSubscription() {
  const { data: profile } = useProfile();

  return {
    tier: profile?.subscription_tier || 'free',
    scansThisMonth: profile?.scan_count_this_month || 0,
    scanResetDate: profile?.scan_reset_date,
  };
}
