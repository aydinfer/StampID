import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInRight,
  SlideInRight,
} from 'react-native-reanimated';
import { XCircle, Search } from 'lucide-react-native';
import { useStampIdentification } from '@/lib/hooks/useStampIdentification';
import type { StampIdentificationResult } from '@/lib/api/identify-stamp';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ScanResultScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { identify, results, totalStamps, loading, error, response } = useStampIdentification();
  const [hasIdentified, setHasIdentified] = useState(false);
  const [selectedStampIndex, setSelectedStampIndex] = useState(0);

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
    if (results.length === 0) return;

    const stampCount = results.length;
    Alert.alert(
      'Save to Collection',
      stampCount > 1
        ? `${stampCount} stamps will be saved to your collection.`
        : 'This stamp will be saved to your collection.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: () => {
            Alert.alert(
              'Saved!',
              stampCount > 1
                ? `${stampCount} stamps added to your collection.`
                : 'Stamp added to your collection.'
            );
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const handleScanAnother = () => {
    router.replace('/camera');
  };

  // Get currently selected stamp
  const selectedStamp = results[selectedStampIndex];

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
            <XCircle size={48} color="#EF4444" strokeWidth={1.5} />
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

  // No stamps detected
  if (results.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-warning/10 items-center justify-center mb-6">
            <Search size={48} color="#D97706" strokeWidth={1.5} />
          </View>
          <Text className="text-2xl font-bold text-ink text-center mb-3">
            No Stamps Detected
          </Text>
          <Text className="text-ink-light text-center mb-4">
            {response?.suggestions || "We couldn't find any stamps in this image."}
          </Text>
          <Text className="text-ink-muted text-center text-sm mb-8">
            Try taking a clearer photo with better lighting.
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
          {totalStamps > 1
            ? `${totalStamps} Stamps Found`
            : selectedStamp?.identified
            ? 'Stamp Identified!'
            : 'Scan Result'}
        </Text>
        <View className="w-16" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-32">
        {/* Image with stamp count badge */}
        <Animated.View
          entering={FadeIn.duration(400)}
          className="items-center px-6 pt-4"
        >
          <View className="relative">
            <View className="w-64 h-64 rounded-2xl overflow-hidden shadow-glass-lg bg-white">
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Multi-stamp badge */}
            {totalStamps > 1 && (
              <Animated.View
                entering={FadeInUp.delay(300).duration(300)}
                className="absolute -top-2 -right-2"
              >
                <BlurView intensity={30} tint="light" className="rounded-full overflow-hidden">
                  <View className="bg-forest-900/90 px-3 py-1.5">
                    <Text className="text-white font-bold text-sm">
                      {totalStamps} stamps
                    </Text>
                  </View>
                </BlurView>
              </Animated.View>
            )}
          </View>

          {/* Stamp selector for multiple stamps */}
          {totalStamps > 1 && (
            <Animated.View
              entering={FadeInUp.delay(400).duration(300)}
              className="mt-4"
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="px-2"
              >
                {results.map((stamp, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedStampIndex(index)}
                    className={`mx-1 px-4 py-2 rounded-full ${
                      selectedStampIndex === index
                        ? 'bg-forest-900'
                        : 'bg-white/80 border border-forest-900/20'
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        selectedStampIndex === index
                          ? 'text-white'
                          : 'text-forest-900'
                      }`}
                    >
                      Stamp {index + 1}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Confidence Badge */}
          {selectedStamp && (
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
                    (selectedStamp.confidence ?? 0) >= 80
                      ? 'bg-success/20'
                      : (selectedStamp.confidence ?? 0) >= 50
                      ? 'bg-warning/20'
                      : 'bg-error/20'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      (selectedStamp.confidence ?? 0) >= 80
                        ? 'text-success'
                        : (selectedStamp.confidence ?? 0) >= 50
                        ? 'text-warning'
                        : 'text-error'
                    }`}
                  >
                    {selectedStamp.confidence ?? 0}% Confident
                  </Text>
                </View>
              </BlurView>
            </Animated.View>
          )}
        </Animated.View>

        {/* Selected Stamp Details */}
        {selectedStamp && (
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="px-6 mt-6"
            key={selectedStampIndex}
          >
            {/* Name & Country */}
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
              <View className="bg-white/70 p-4">
                <Text className="text-2xl font-bold text-ink mb-1">
                  {selectedStamp.name || 'Unknown Stamp'}
                </Text>
                {selectedStamp.country && (
                  <Text className="text-ink-light text-lg">
                    {selectedStamp.country} {selectedStamp.year_issued ? `• ${selectedStamp.year_issued}` : ''}
                  </Text>
                )}
              </View>
            </BlurView>

            {/* Value Estimate */}
            {(selectedStamp.estimated_value_low || selectedStamp.estimated_value_high) && (
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
                <View className="bg-white/70 p-4">
                  <Text className="text-sm text-ink-light mb-1">Estimated Value</Text>
                  <Text className="text-3xl font-bold text-forest-900">
                    ${selectedStamp.estimated_value_low?.toFixed(2) || '0.00'} - ${selectedStamp.estimated_value_high?.toFixed(2) || '0.00'}
                  </Text>
                  <Text className="text-sm text-ink-muted mt-1">
                    {selectedStamp.currency || 'USD'} • {selectedStamp.rarity || 'Unknown rarity'}
                  </Text>
                </View>
              </BlurView>
            )}

            {/* Details Grid */}
            <View className="flex-row flex-wrap -mx-2">
              <DetailCard label="Catalog #" value={selectedStamp.catalog_number} />
              <DetailCard label="Denomination" value={selectedStamp.denomination} />
              <DetailCard label="Category" value={selectedStamp.category} />
              <DetailCard label="Condition" value={selectedStamp.condition} />
            </View>

            {/* Description */}
            {selectedStamp.description && (
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mt-4">
                <View className="bg-white/70 p-4">
                  <Text className="text-sm text-ink-light mb-1">About this stamp</Text>
                  <Text className="text-ink leading-6">{selectedStamp.description}</Text>
                </View>
              </BlurView>
            )}

            {/* Condition Notes */}
            {selectedStamp.condition_notes && (
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mt-4">
                <View className="bg-white/70 p-4">
                  <Text className="text-sm text-ink-light mb-1">Condition Notes</Text>
                  <Text className="text-ink">{selectedStamp.condition_notes}</Text>
                </View>
              </BlurView>
            )}

            {/* Total value summary for multiple stamps */}
            {totalStamps > 1 && (
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mt-6">
                <View className="bg-forest-900/10 p-4">
                  <Text className="text-sm text-forest-900 font-medium mb-2">
                    Collection Summary
                  </Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-ink">Total stamps</Text>
                    <Text className="text-ink font-semibold">{totalStamps}</Text>
                  </View>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-ink">Est. total value</Text>
                    <Text className="text-forest-900 font-bold text-lg">
                      ${calculateTotalValue(results)}
                    </Text>
                  </View>
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
              <Text className="text-white font-semibold">
                {totalStamps > 1 ? `Save All (${totalStamps})` : 'Save to Collection'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </BlurView>
    </SafeAreaView>
  );
}

// Calculate total estimated value for all stamps
function calculateTotalValue(stamps: StampIdentificationResult[]): string {
  const low = stamps.reduce((sum, stamp) => sum + (stamp.estimated_value_low || 0), 0);
  const high = stamps.reduce((sum, stamp) => sum + (stamp.estimated_value_high || 0), 0);

  if (low === 0 && high === 0) return '0.00';

  const avg = (low + high) / 2;
  return avg.toFixed(2);
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
