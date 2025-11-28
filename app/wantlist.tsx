import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, SlideInRight, SlideOutRight } from 'react-native-reanimated';
import {
  ChevronLeft,
  Heart,
  Trash2,
  Search,
  Plus,
  Check,
} from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Stamp } from '@/lib/supabase/types';

export default function WantListScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch want list (favorites)
  const { data: wantList, isLoading, refetch } = useQuery({
    queryKey: ['wantlist'],
    queryFn: async (): Promise<Stamp[]> => {
      const { data, error } = await supabase
        .from('stamps')
        .select('*')
        .eq('is_favorite', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Remove from want list mutation
  const removeFromWantList = useMutation({
    mutationFn: async (stampId: string) => {
      const { error } = await supabase
        .from('stamps')
        .update({ is_favorite: false })
        .eq('id', stampId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wantlist'] });
      queryClient.invalidateQueries({ queryKey: ['stamps'] });
    },
  });

  // Mark as acquired mutation
  const markAsAcquired = useMutation({
    mutationFn: async (stampId: string) => {
      // In a real app, this would move the stamp to the main collection
      // For now, we'll just remove the favorite flag
      const { error } = await supabase
        .from('stamps')
        .update({ is_favorite: false })
        .eq('id', stampId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wantlist'] });
      queryClient.invalidateQueries({ queryKey: ['stamps'] });
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleRemove = (stamp: Stamp) => {
    Alert.alert(
      'Remove from Want List',
      `Remove "${stamp.name}" from your want list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromWantList.mutate(stamp.id),
        },
      ]
    );
  };

  const handleMarkAcquired = (stamp: Stamp) => {
    Alert.alert(
      'Mark as Acquired',
      `Mark "${stamp.name}" as acquired?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Acquired',
          onPress: () => markAsAcquired.mutate(stamp.id),
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: Stamp; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      className="px-4 mb-4"
    >
      <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
        <Pressable
          onPress={() => router.push(`/stamp/${item.id}`)}
          className="bg-white/70 active:bg-white/90"
        >
          <View className="flex-row p-3">
            {/* Stamp Image */}
            <View className="w-24 h-24 rounded-xl overflow-hidden bg-forest-900/5">
              <Image
                source={{ uri: item.image_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Details */}
            <View className="flex-1 ml-3 justify-center">
              <Text className="text-ink font-semibold" numberOfLines={2}>
                {item.name}
              </Text>
              {item.country && (
                <Text className="text-ink-light text-sm mt-0.5">
                  {item.country} {item.year_issued ? `• ${item.year_issued}` : ''}
                </Text>
              )}
              {(item.estimated_value_low || item.estimated_value_high) && (
                <Text className="text-forest-900 font-medium mt-1">
                  ${item.estimated_value_low?.toFixed(2) || '0'} - ${item.estimated_value_high?.toFixed(2) || '0'}
                </Text>
              )}
              {item.rarity && (
                <View className="flex-row mt-1">
                  <View
                    className={`px-2 py-0.5 rounded ${
                      item.rarity === 'rare' || item.rarity === 'very_rare'
                        ? 'bg-forest-900/10'
                        : 'bg-ink-muted/10'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium capitalize ${
                        item.rarity === 'rare' || item.rarity === 'very_rare'
                          ? 'text-forest-900'
                          : 'text-ink-light'
                      }`}
                    >
                      {item.rarity.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Actions */}
            <View className="justify-center gap-2">
              <Pressable
                onPress={() => handleMarkAcquired(item)}
                className="w-10 h-10 rounded-full bg-forest-900/10 items-center justify-center active:bg-forest-900/20"
              >
                <Check size={18} color="#1B4332" />
              </Pressable>
              <Pressable
                onPress={() => handleRemove(item)}
                className="w-10 h-10 rounded-full bg-error/10 items-center justify-center active:bg-error/20"
              >
                <Trash2 size={18} color="#EF4444" />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </BlurView>
    </Animated.View>
  );

  const renderHeader = () => (
    <View className="px-4 py-4">
      {/* Stats Card */}
      <Animated.View entering={FadeIn.duration(400)}>
        <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
          <View className="bg-forest-900/5 p-4">
            <View className="flex-row items-center">
              <Heart size={24} color="#1B4332" fill="#1B4332" />
              <View className="ml-3">
                <Text className="text-ink-light text-sm">Want List</Text>
                <Text className="text-2xl font-bold text-forest-900">
                  {wantList?.length || 0} stamps
                </Text>
              </View>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );

  const renderEmpty = () => (
    <View className="items-center py-12 px-8">
      <Heart size={48} color="#9CA3AF" strokeWidth={1.5} />
      <Text className="text-ink font-semibold text-lg mt-4 mb-2">
        Your Want List is Empty
      </Text>
      <Text className="text-ink-light text-center mb-6">
        Swipe right on stamps in Discover or tap the heart icon to add stamps to your want list.
      </Text>
      <Pressable
        onPress={() => router.push('/(tabs)/discover')}
        className="bg-forest-900 rounded-xl py-3 px-6 active:opacity-90"
      >
        <Text className="text-white font-semibold">Discover Stamps</Text>
      </Pressable>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-forest-900/10">
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2">
          <ChevronLeft size={24} color="#1B4332" />
          <Text className="text-forest-900 font-medium">Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-ink flex-1 text-center">
          Want List
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/search')}
          className="py-2 px-2"
        >
          <Search size={22} color="#1B4332" />
        </Pressable>
      </View>

      {/* Want List */}
      <FlatList
        data={wantList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1B4332"
            colors={['#1B4332']}
          />
        }
      />
    </SafeAreaView>
  );
}
