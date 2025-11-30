import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, RefreshControl, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { FolderOpen, Plus } from 'lucide-react-native';
import { useCollections, useCreateCollection } from '@/lib/hooks/useCollections';
import { useCollectionValue } from '@/lib/hooks/useStamps';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors } from '@/lib/design/tokens';

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
      <Animated.View entering={FadeIn.duration(400)} className="mb-4">
        <GlassCard variant="card" padding="lg">
          <View className="bg-indigo-500 -m-6 p-5 rounded-2xl">
            <Text className="text-white/70 text-caption mb-1">Your Collection</Text>
            <View className="flex-row items-baseline">
              <Text className="text-display font-sans-bold text-white">{count}</Text>
              <Text className="text-white/70 ml-2">stamps</Text>
              {average > 0 && (
                <>
                  <Text className="text-white/50 mx-2">•</Text>
                  <Text className="text-white font-sans-semibold">${average.toFixed(2)}</Text>
                  <Text className="text-white/70 ml-1">value</Text>
                </>
              )}
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* Section Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-headline font-sans-semibold text-zinc-900">Collections</Text>
        <Pressable
          onPress={() => setShowCreateModal(true)}
          className="bg-indigo-500 rounded-xl px-4 py-2 flex-row items-center active:opacity-90"
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-white text-micro font-sans-semibold ml-1">New</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <Animated.View
      entering={FadeInDown.delay(200).duration(400)}
      className="items-center py-12 px-6"
    >
      <View className="w-16 h-16 rounded-full bg-zinc-100 items-center justify-center mb-4">
        <FolderOpen size={32} color={colors.zinc[400]} />
      </View>
      <Text className="text-zinc-900 font-sans-semibold text-body mb-2">No Collections Yet</Text>
      <Text className="text-zinc-500 text-center text-caption mb-6">
        Create collections to organize your stamps by theme, country, or any way you like.
      </Text>
      <Pressable
        onPress={() => setShowCreateModal(true)}
        className="bg-indigo-500 rounded-xl py-3 px-6 active:opacity-90"
      >
        <Text className="text-white font-sans-semibold">Create First Collection</Text>
      </Pressable>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-display font-sans-bold text-zinc-900">My Collection</Text>
        <Text className="text-caption text-zinc-500 mt-1">Organize your stamps</Text>
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
            tintColor={colors.indigo[500]}
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
              <View className="bg-white/95 p-6">
                <Text className="text-title font-sans-bold text-zinc-900 mb-4">New Collection</Text>

                <TextInput
                  value={newCollectionName}
                  onChangeText={setNewCollectionName}
                  placeholder="Collection name"
                  placeholderTextColor={colors.zinc[400]}
                  className="bg-zinc-50 rounded-xl px-4 py-3.5 text-zinc-900 border border-zinc-200 mb-4"
                  style={{ fontFamily: 'PlusJakartaSans_400Regular' }}
                  autoFocus
                />

                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setShowCreateModal(false)}
                    className="flex-1 bg-zinc-100 rounded-xl py-3.5 items-center active:bg-zinc-200"
                  >
                    <Text className="text-zinc-900 font-sans-semibold">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleCreateCollection}
                    disabled={!newCollectionName.trim() || createCollection.isPending}
                    className={`flex-1 bg-indigo-500 rounded-xl py-3.5 items-center ${
                      !newCollectionName.trim() || createCollection.isPending ? 'opacity-50' : 'active:opacity-90'
                    }`}
                  >
                    <Text className="text-white font-sans-semibold">
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
