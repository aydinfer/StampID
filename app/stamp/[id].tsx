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
import { ChevronLeft, Heart, Share2, Edit3, Trash2, X, HelpCircle } from 'lucide-react-native';
import { useStamp, useDeleteStamp, useFavoriteStamp } from '@/lib/hooks/useStamps';
import { StampEditModal } from '@/components/stamps/StampEditModal';
import { ShareCard } from '@/components/share/ShareCard';
import { useShareStamp, getRecommendedShareStyle } from '@/lib/hooks/useShare';
import { ConditionBadge } from '@/components/stamps/ConditionBadge';
import { RarityBadge } from '@/components/stamps/RarityBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors } from '@/lib/design/tokens';
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
      <SafeAreaView className="flex-1 bg-zinc-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.indigo[500]} />
      </SafeAreaView>
    );
  }

  if (!stamp) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-50 items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-zinc-100 items-center justify-center mb-4">
          <HelpCircle size={32} color={colors.zinc[400]} />
        </View>
        <Text className="text-zinc-900 font-sans-semibold text-body mb-2">Stamp not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-indigo-500 font-sans-semibold">Go Back</Text>
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
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2 pr-4">
          <ChevronLeft size={24} color={colors.indigo[500]} />
          <Text className="text-indigo-500 font-sans-medium">Back</Text>
        </Pressable>

        <View className="flex-row gap-2">
          <Pressable
            onPress={handleToggleFavorite}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              stamp.is_favorite ? 'bg-rose-50' : 'bg-white'
            }`}
            style={{ shadowColor: colors.zinc[900], shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
          >
            <Heart
              size={20}
              color={stamp.is_favorite ? colors.rose[500] : colors.zinc[400]}
              fill={stamp.is_favorite ? colors.rose[500] : 'transparent'}
            />
          </Pressable>
          <Pressable
            onPress={handleShare}
            disabled={isCapturing || isSharing}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            style={{ shadowColor: colors.zinc[900], shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
          >
            <Share2 size={20} color={colors.zinc[400]} />
          </Pressable>
          <Pressable
            onPress={() => setShowEditModal(true)}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            style={{ shadowColor: colors.zinc[900], shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
          >
            <Edit3 size={20} color={colors.zinc[400]} />
          </Pressable>
          <Pressable
            onPress={handleDelete}
            className="w-10 h-10 rounded-full bg-white items-center justify-center"
            style={{ shadowColor: colors.zinc[900], shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
          >
            <Trash2 size={20} color={colors.rose[500]} />
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
          <GlassCard variant="card" padding="md">
            <Text className="text-title font-sans-bold text-zinc-900">{stamp.name}</Text>
            <Text className="text-zinc-500 text-body mt-1">
              {stamp.country || 'Unknown origin'}
              {stamp.year_issued ? ` • ${stamp.year_issued}` : ''}
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Value */}
        {avgValue > 0 && (
          <Animated.View entering={FadeInDown.delay(150).duration(400)} className="px-4 mt-4">
            <GlassCard variant="card" padding="md">
              <Text className="text-zinc-500 text-caption">Estimated Value</Text>
              <Text className="text-display font-sans-bold text-indigo-500 mt-1">
                ${stamp.estimated_value_low?.toFixed(2)} - ${stamp.estimated_value_high?.toFixed(2)}
              </Text>
              <View className="flex-row items-center mt-2 gap-3">
                <Text className="text-zinc-400 text-caption font-mono-regular">{stamp.currency || 'USD'}</Text>
                {stamp.rarity && (
                  <RarityBadge rarity={stamp.rarity as RarityTier} size="sm" />
                )}
              </View>
            </GlassCard>
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
            <GlassCard variant="card" padding="md">
              <Text className="text-zinc-500 text-caption mb-2">Condition</Text>
              <View className="flex-row items-center">
                <ConditionBadge condition={stamp.condition} size="lg" />
                {stamp.condition_notes && (
                  <Text className="text-zinc-500 text-caption ml-3 flex-1">
                    {stamp.condition_notes}
                  </Text>
                )}
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Description */}
        {stamp.description && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-4 mt-4">
            <GlassCard variant="card" padding="md">
              <Text className="text-zinc-500 text-caption mb-1">About</Text>
              <Text className="text-zinc-700 leading-6">{stamp.description}</Text>
            </GlassCard>
          </Animated.View>
        )}

        {/* Notes */}
        {stamp.notes && (
          <Animated.View entering={FadeInDown.delay(350).duration(400)} className="px-4 mt-4">
            <GlassCard variant="card" padding="md">
              <Text className="text-zinc-500 text-caption mb-1">Your Notes</Text>
              <Text className="text-zinc-700">{stamp.notes}</Text>
            </GlassCard>
          </Animated.View>
        )}

        {/* Metadata */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="px-4 mt-4">
          <Text className="text-zinc-400 text-micro text-center font-sans-medium">
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
            <Text className="text-white font-sans-medium">Preparing share...</Text>
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
      <GlassCard variant="subtle" padding="sm">
        <Text className="text-micro text-zinc-400">{label}</Text>
        <Text className="text-zinc-900 font-sans-medium capitalize mt-0.5">{value}</Text>
      </GlassCard>
    </View>
  );
}
