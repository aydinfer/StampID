import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useStampIdentification } from '@/lib/hooks/useStampIdentification';
import type { StampIdentificationResult } from '@/lib/api/identify-stamp';

export default function ScanResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { identify, result, loading, error } = useStampIdentification();
  const [hasIdentified, setHasIdentified] = useState(false);

  useEffect(() => {
    if (imageUri && !hasIdentified) {
      setHasIdentified(true);
      identify(imageUri).catch(console.error);
    }
  }, [imageUri, hasIdentified]);

  const handleRetake = () => {
    router.back();
  };

  const handleSaveToCollection = () => {
    if (!result) return;

    // TODO: Implement save to collection
    Alert.alert(
      'Save to Collection',
      'This stamp will be saved to your collection.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            // Navigate to collection selection or save directly
            Alert.alert('Saved!', 'Stamp added to your collection.');
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const handleScanAnother = () => {
    router.replace('/camera');
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <View className="flex-1 items-center justify-center px-6">
          {/* Image Preview */}
          {imageUri && (
            <Animated.View
              entering={FadeIn.duration(300)}
              className="w-48 h-48 rounded-2xl overflow-hidden mb-8 shadow-glass"
            >
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </Animated.View>
          )}

          {/* Loading Animation */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(400)}
            className="items-center"
          >
            <View className="w-16 h-16 rounded-full bg-forest-100 items-center justify-center mb-4">
              <ActivityIndicator size="large" color="#1B4332" />
            </View>
            <Text className="text-xl font-semibold text-ink mb-2">
              Analyzing stamp...
            </Text>
            <Text className="text-ink-light text-center">
              Our AI is identifying your stamp.{'\n'}This may take a few seconds.
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-error/10 items-center justify-center mb-6">
            <Text className="text-4xl">❌</Text>
          </View>
          <Text className="text-2xl font-bold text-ink text-center mb-3">
            Identification Failed
          </Text>
          <Text className="text-ink-light text-center mb-8">
            {error}
          </Text>
          <Pressable
            onPress={handleRetake}
            className="bg-forest-900 rounded-xl py-4 px-8 active:opacity-90"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Result state
  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <Pressable onPress={() => router.back()} className="py-2">
          <Text className="text-forest-900 font-medium">← Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-ink">
          {result?.identified ? 'Stamp Identified!' : 'Scan Result'}
        </Text>
        <View className="w-16" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-32">
        {/* Image */}
        <Animated.View
          entering={FadeIn.duration(400)}
          className="items-center px-6 pt-4"
        >
          <View className="w-64 h-64 rounded-2xl overflow-hidden shadow-glass-lg bg-white">
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </View>

          {/* Confidence Badge */}
          {result && (
            <Animated.View
              entering={FadeInUp.delay(200).duration(300)}
              className="mt-4"
            >
              <BlurView
                intensity={20}
                tint="light"
                className="rounded-full overflow-hidden"
              >
                <View
                  className={`px-4 py-2 flex-row items-center ${
                    (result.confidence ?? 0) >= 80
                      ? 'bg-success/20'
                      : (result.confidence ?? 0) >= 50
                      ? 'bg-warning/20'
                      : 'bg-error/20'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      (result.confidence ?? 0) >= 80
                        ? 'text-success'
                        : (result.confidence ?? 0) >= 50
                        ? 'text-warning'
                        : 'text-error'
                    }`}
                  >
                    {result.confidence ?? 0}% Confident
                  </Text>
                </View>
              </BlurView>
            </Animated.View>
          )}
        </Animated.View>

        {/* Details */}
        {result && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="px-6 mt-6"
          >
            {/* Name & Country */}
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
              <View className="bg-white/70 p-4">
                <Text className="text-2xl font-bold text-ink mb-1">
                  {result.name || 'Unknown Stamp'}
                </Text>
                {result.country && (
                  <Text className="text-ink-light text-lg">
                    {result.country} {result.year_issued ? `• ${result.year_issued}` : ''}
                  </Text>
                )}
              </View>
            </BlurView>

            {/* Value Estimate */}
            {(result.estimated_value_low || result.estimated_value_high) && (
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
                <View className="bg-white/70 p-4">
                  <Text className="text-sm text-ink-light mb-1">Estimated Value</Text>
                  <Text className="text-3xl font-bold text-forest-900">
                    ${result.estimated_value_low?.toFixed(2) || '0.00'} - ${result.estimated_value_high?.toFixed(2) || '0.00'}
                  </Text>
                  <Text className="text-sm text-ink-muted mt-1">
                    {result.currency || 'USD'} • {result.rarity || 'Unknown rarity'}
                  </Text>
                </View>
              </BlurView>
            )}

            {/* Details Grid */}
            <View className="flex-row flex-wrap -mx-2">
              <DetailCard label="Catalog #" value={result.catalog_number} />
              <DetailCard label="Denomination" value={result.denomination} />
              <DetailCard label="Category" value={result.category} />
              <DetailCard label="Condition" value={result.condition} />
            </View>

            {/* Description */}
            {result.description && (
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mt-4">
                <View className="bg-white/70 p-4">
                  <Text className="text-sm text-ink-light mb-1">About this stamp</Text>
                  <Text className="text-ink leading-6">{result.description}</Text>
                </View>
              </BlurView>
            )}

            {/* Condition Notes */}
            {result.condition_notes && (
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mt-4">
                <View className="bg-white/70 p-4">
                  <Text className="text-sm text-ink-light mb-1">Condition Notes</Text>
                  <Text className="text-ink">{result.condition_notes}</Text>
                </View>
              </BlurView>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <BlurView
        intensity={30}
        tint="light"
        className="absolute bottom-0 left-0 right-0"
      >
        <SafeAreaView edges={['bottom']}>
          <View className="flex-row px-6 py-4 gap-4">
            <Pressable
              onPress={handleScanAnother}
              className="flex-1 bg-white/80 border border-forest-900/20 rounded-xl py-4 items-center active:bg-white"
            >
              <Text className="text-forest-900 font-semibold">Scan Another</Text>
            </Pressable>
            <Pressable
              onPress={handleSaveToCollection}
              className="flex-1 bg-forest-900 rounded-xl py-4 items-center active:opacity-90"
            >
              <Text className="text-white font-semibold">Save to Collection</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </BlurView>
    </SafeAreaView>
  );
}

// Helper component for detail cards
function DetailCard({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <View className="w-1/2 px-2 mb-4">
      <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
        <View className="bg-white/70 p-3">
          <Text className="text-xs text-ink-light mb-1">{label}</Text>
          <Text className="text-ink font-medium capitalize">{value}</Text>
        </View>
      </BlurView>
    </View>
  );
}
