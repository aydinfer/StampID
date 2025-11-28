import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useCollections, useCreateCollection } from '@/lib/hooks/useCollections';
import { useCollectionValue } from '@/lib/hooks/useStamps';
import { CollectionCard } from '@/components/collections/CollectionCard';

export default function CollectionScreen() {
  const { data: collections, isLoading, refetch } = useCollections();
  const { count, average } = useCollectionValue();
  const createCollection = useCreateCollection();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    try {
      await createCollection.mutateAsync({
        name: newCollectionName.trim(),
        user_id: '', // Will be set by hook
        description: null,
        cover_image_url: null,
        is_public: false,
      });
      setNewCollectionName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const renderHeader = () => (
    <View className="px-4 pb-4">
      {/* Stats Card */}
      <Animated.View entering={FadeIn.duration(400)}>
        <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
          <View className="bg-forest-900/5 p-4">
            <Text className="text-ink-light text-sm mb-2">Your Collection</Text>
            <View className="flex-row items-baseline">
              <Text className="text-3xl font-bold text-forest-900">{count}</Text>
              <Text className="text-ink-light ml-2">stamps</Text>
              {average > 0 && (
                <>
                  <Text className="text-ink-muted mx-2">•</Text>
                  <Text className="text-forest-900 font-semibold">${average.toFixed(2)}</Text>
                  <Text className="text-ink-light ml-1">value</Text>
                </>
              )}
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Section Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-ink">Collections</Text>
        <Pressable
          onPress={() => setShowCreateModal(true)}
          className="bg-forest-900 rounded-lg px-3 py-1.5 active:opacity-90"
        >
          <Text className="text-white text-sm font-medium">+ New</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <Animated.View
      entering={FadeInDown.delay(200).duration(400)}
      className="items-center py-12 px-6"
    >
      <Text className="text-5xl mb-4">📁</Text>
      <Text className="text-ink font-semibold text-lg mb-2">No Collections Yet</Text>
      <Text className="text-ink-light text-center mb-6">
        Create collections to organize your stamps by theme, country, or any way you like.
      </Text>
      <Pressable
        onPress={() => setShowCreateModal(true)}
        className="bg-forest-900 rounded-xl py-3 px-6 active:opacity-90"
      >
        <Text className="text-white font-semibold">Create First Collection</Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-ink">My Collection</Text>
      </View>

      {/* Collections List */}
      <FlatList
        data={collections}
        renderItem={({ item, index }) => (
          <CollectionCard
            collection={item}
            index={index}
            onPress={() => router.push(`/collection/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#1B4332"
            colors={['#1B4332']}
          />
        }
      />

      {/* Create Collection Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-6"
          onPress={() => setShowCreateModal(false)}
        >
          <Pressable
            className="w-full"
            onPress={(e) => e.stopPropagation()}
          >
            <BlurView intensity={30} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/90 p-6">
                <Text className="text-xl font-bold text-ink mb-4">New Collection</Text>

                <TextInput
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  placeholder="Collection name"
                  placeholderTextColor="#9CA3AF"
                  className="bg-cream rounded-xl px-4 py-3 text-ink border border-forest-900/10 mb-4"
                  autoFocus
                />

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setShowCreateModal(false)}
                    className="flex-1 bg-cream rounded-xl py-3 items-center active:opacity-90"
                  >
                    <Text className="text-ink font-semibold">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleCreateCollection}
                    disabled={!newCollectionName.trim() || createCollection.isPending}
                    className={`flex-1 bg-forest-900 rounded-xl py-3 items-center ${
                      !newCollectionName.trim() || createCollection.isPending ? 'opacity-50' : 'active:opacity-90'
                    }`}
                  >
                    <Text className="text-white font-semibold">
                      {createCollection.isPending ? 'Creating...' : 'Create'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
