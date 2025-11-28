import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ChevronLeft, Heart, Share2, Edit3, Trash2, X } from 'lucide-react-native';
import { useStamp, useDeleteStamp, useFavoriteStamp } from '@/lib/hooks/useStamps';
import { StampEditModal } from '@/components/stamps/StampEditModal';
import { ShareCard } from '@/components/share/ShareCard';
import { useShareStamp, getRecommendedShareStyle } from '@/lib/hooks/useShare';
import { ConditionBadge } from '@/components/stamps/ConditionBadge';
import { RarityBadge } from '@/components/stamps/RarityBadge';
import type { RarityTier } from '@/lib/stamps/catalog';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function StampDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: stamp, isLoading } = useStamp(id!);
  const deleteStamp = useDeleteStamp();
  const favoriteStamp = useFavoriteStamp();
  const { cardRef, captureAndShare, isCapturing, isSharing } = useShareStamp();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </SafeAreaView>
    );
  }

  if (!stamp) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-ink-muted/10 items-center justify-center mb-4">
          <Text className="text-ink-muted text-2xl font-bold">?</Text>
        </View>
        <Text className="text-ink font-semibold text-lg mb-2">Stamp not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-forest-900 font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Stamp',
      'Are you sure you want to delete this stamp? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStamp.mutateAsync(stamp.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete stamp');
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    try {
      await favoriteStamp.mutateAsync({
        id: stamp.id,
        is_favorite: !stamp.is_favorite,
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleShare = async () => {
    try {
      setShowShareModal(true);
      // Small delay to ensure the share card is rendered
      setTimeout(async () => {
        await captureAndShare({
          stamp,
          style: getRecommendedShareStyle(stamp),
        });
        setShowShareModal(false);
      }, 100);
    } catch (error) {
      setShowShareModal(false);
      Alert.alert('Error', 'Failed to share stamp');
    }
  };

  const avgValue = ((stamp.estimated_value_low || 0) + (stamp.estimated_value_high || 0)) / 2;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2 pr-4">
          <ChevronLeft size={24} color="#1B4332" />
          <Text className="text-forest-900 font-medium">Back</Text>
        </Pressable>

        <View className="flex-row gap-2">
          <Pressable
            onPress={handleToggleFavorite}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              stamp.is_favorite ? 'bg-red-100' : 'bg-white/80'
            }`}
          >
            <Heart
              size={20}
              color={stamp.is_favorite ? '#EF4444' : '#6B6B6B'}
              fill={stamp.is_favorite ? '#EF4444' : 'transparent'}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            disabled={isCapturing || isSharing}
            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
          >
            <Share2 size={20} color="#6B6B6B" />
          </Pressable>
          <Pressable
            onPress={() => setShowEditModal(true)}
            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
          >
            <Edit3 size={20} color="#6B6B6B" />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            className="w-10 h-10 rounded-full bg-white/80 items-center justify-center"
          >
            <Trash2 size={20} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <Animated.View entering={FadeIn.duration(400)}>
          <Pressable onPress={() => setImageZoomed(true)}>
            <View className="mx-4 rounded-2xl overflow-hidden bg-white shadow-lg">
              <Image
                source={{ uri: stamp.image_url }}
                className="w-full aspect-square"
                resizeMode="cover"
              />

              {/* Confidence Badge */}
              {stamp.ai_confidence && (
                <View className="absolute top-3 right-3">
                  <BlurView intensity={30} tint="light" className="rounded-full overflow-hidden">
                    <View className={`px-3 py-1.5 ${
                      stamp.ai_confidence >= 80 ? 'bg-success/20' :
                      stamp.ai_confidence >= 50 ? 'bg-warning/20' : 'bg-error/20'
                    }`}>
                      <Text className={`text-xs font-semibold ${
                        stamp.ai_confidence >= 80 ? 'text-success' :
                        stamp.ai_confidence >= 50 ? 'text-warning' : 'text-error'
                      }`}>
                        {stamp.ai_confidence}% match
                      </Text>
                    </View>
                  </BlurView>
                </View>
              )}

              {/* Tap to zoom hint */}
              <View className="absolute bottom-3 right-3">
                <BlurView intensity={30} tint="dark" className="rounded-full overflow-hidden">
                  <View className="px-2 py-1">
                    <Text className="text-white/80 text-xs">Tap to zoom</Text>
                  </View>
                </BlurView>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Title & Origin */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-4 mt-4">
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70 p-4">
              <Text className="text-2xl font-bold text-ink">{stamp.name}</Text>
              <Text className="text-ink-light text-lg mt-1">
                {stamp.country || 'Unknown origin'}
                {stamp.year_issued ? ` • ${stamp.year_issued}` : ''}
              </Text>
            </View>
          </BlurView>
        </Animated.View>

        {/* Value */}
        {avgValue > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(400)} className="px-4 mt-4">
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                <Text className="text-ink-light text-sm">Estimated Value</Text>
                <Text className="text-3xl font-bold text-forest-900 mt-1">
                  ${stamp.estimated_value_low?.toFixed(2)} - ${stamp.estimated_value_high?.toFixed(2)}
                </Text>
                <View className="flex-row items-center mt-2 gap-3">
                  <Text className="text-ink-muted text-sm">{stamp.currency || 'USD'}</Text>
                  {stamp.rarity && (
                    <RarityBadge rarity={stamp.rarity as RarityTier} size="sm" />
                  )}
                </View>
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Details Grid */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-4 mt-4">
          <View className="flex-row flex-wrap -mx-1">
            <DetailCard label="Catalog #" value={stamp.catalog_number} />
            <DetailCard label="Denomination" value={stamp.denomination} />
            <DetailCard label="Category" value={stamp.category} />
            <DetailCard label="Theme" value={stamp.theme} />
          </View>
        </Animated.View>

        {/* Condition */}
        {stamp.condition && (
          <Animated.View entering={FadeInDown.delay(250).duration(400)} className="px-4 mt-4">
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                <Text className="text-ink-light text-sm mb-2">Condition</Text>
                <View className="flex-row items-center">
                  <ConditionBadge condition={stamp.condition} size="lg" />
                  {stamp.condition_notes && (
                    <Text className="text-ink-light text-sm ml-3 flex-1">
                      {stamp.condition_notes}
                    </Text>
                  )}
                </View>
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Description */}
        {stamp.description && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-4 mt-4">
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                <Text className="text-ink-light text-sm mb-1">About</Text>
                <Text className="text-ink leading-6">{stamp.description}</Text>
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Notes */}
        {stamp.notes && (
          <Animated.View entering={FadeInDown.delay(350).duration(400)} className="px-4 mt-4">
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
              <View className="bg-white/70 p-4">
                <Text className="text-ink-light text-sm mb-1">Your Notes</Text>
                <Text className="text-ink">{stamp.notes}</Text>
              </View>
            </BlurView>
          </Animated.View>
        )}

        {/* Metadata */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="px-4 mt-4">
          <Text className="text-ink-muted text-xs text-center">
            Added {new Date(stamp.created_at).toLocaleDateString()}
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Image Zoom Modal */}
      <Modal
        visible={imageZoomed}
        transparent
        animationType="fade"
        onRequestClose={() => setImageZoomed(false)}
      >
        <Pressable
          className="flex-1 bg-black/95 items-center justify-center"
          onPress={() => setImageZoomed(false)}
        >
          <Image
            source={{ uri: stamp.image_url }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
            resizeMode="contain"
          />
          <View className="absolute top-12 right-4">
            <Pressable
              onPress={() => setImageZoomed(false)}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <X size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Share Card (Hidden, for capture) */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="none"
      >
        <View className="flex-1 bg-black/80 items-center justify-center">
          <ShareCard
            ref={cardRef}
            stamp={stamp}
            style={getRecommendedShareStyle(stamp)}
          />
          <View className="mt-4">
            <Text className="text-white">Preparing share...</Text>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <StampEditModal
        visible={showEditModal}
        stamp={stamp}
        onClose={() => setShowEditModal(false)}
      />
    </SafeAreaView>
  );
}

function DetailCard({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <View className="w-1/2 px-1 mb-2">
      <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
        <View className="bg-white/70 p-3">
          <Text className="text-xs text-ink-light">{label}</Text>
          <Text className="text-ink font-medium capitalize mt-0.5">{value}</Text>
        </View>
      </BlurView>
    </View>
  );
}
