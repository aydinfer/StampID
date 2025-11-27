import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { useSubscriptionContext, FREE_SCANS_LIMIT } from '@/lib/providers/SubscriptionProvider';

export default function ScanScreen() {
  const { isPro, freeScansRemaining, canScan, recordScan } = useSubscriptionContext();

  const handleCamera = async () => {
    if (!canScan) {
      router.push('/paywall');
      return;
    }

    // Record the scan attempt
    const allowed = await recordScan();
    if (!allowed) {
      router.push('/paywall');
      return;
    }

    router.push('/camera');
  };

  const handleGallery = async () => {
    if (!canScan) {
      router.push('/paywall');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      // Record the scan attempt
      const allowed = await recordScan();
      if (!allowed) {
        router.push('/paywall');
        return;
      }

      router.push({
        pathname: '/scan-result',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-ink">Scan Stamp</Text>
            <Text className="text-ink-light mt-1">Identify stamps using AI</Text>
          </View>

          {/* Subscription Badge */}
          {isPro ? (
            <View className="bg-forest-900 px-3 py-1.5 rounded-full">
              <Text className="text-white text-sm font-semibold">PRO</Text>
            </View>
          ) : (
            <Pressable onPress={() => router.push('/paywall')}>
              <BlurView intensity={20} tint="light" className="rounded-full overflow-hidden">
                <View className="bg-amber-100/80 px-3 py-1.5">
                  <Text className="text-amber-800 text-sm font-semibold">
                    {freeScansRemaining}/{FREE_SCANS_LIMIT} scans
                  </Text>
                </View>
              </BlurView>
            </Pressable>
          )}
        </View>
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* Upgrade Banner for Free Users */}
        {!isPro && freeScansRemaining === 0 && (
          <Animated.View entering={FadeIn.duration(400)} className="mb-6">
            <Pressable onPress={() => router.push('/paywall')}>
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
                <View className="bg-forest-50/80 p-4 border border-forest-900/20 rounded-2xl">
                  <View className="flex-row items-center">
                    <Text className="text-3xl mr-3">🔒</Text>
                    <View className="flex-1">
                      <Text className="text-forest-900 font-semibold">Daily Limit Reached</Text>
                      <Text className="text-forest-900/70 text-sm">
                        Upgrade to Pro for unlimited scans
                      </Text>
                    </View>
                    <View className="bg-forest-900 px-3 py-1.5 rounded-full">
                      <Text className="text-white text-sm font-medium">Upgrade</Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </Pressable>
          </Animated.View>
        )}

        {/* Camera Option */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <Pressable onPress={handleCamera} disabled={!canScan}>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
              <View className={`bg-white/70 p-6 flex-row items-center ${!canScan ? 'opacity-50' : ''}`}>
                <View className="w-16 h-16 bg-forest-900/10 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-3xl">📷</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-ink">Take Photo</Text>
                  <Text className="text-ink-light text-sm mt-0.5">
                    Capture stamp with camera
                  </Text>
                </View>
                <Text className="text-ink-muted text-xl">{canScan ? '›' : '🔒'}</Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>

        {/* Gallery Option */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Pressable onPress={handleGallery} disabled={!canScan}>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
              <View className={`bg-white/70 p-6 flex-row items-center ${!canScan ? 'opacity-50' : ''}`}>
                <View className="w-16 h-16 bg-forest-900/10 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-3xl">🖼️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-ink">From Gallery</Text>
                  <Text className="text-ink-light text-sm mt-0.5">
                    Select from photo library
                  </Text>
                </View>
                <Text className="text-ink-muted text-xl">{canScan ? '›' : '🔒'}</Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>

        {/* Pro Promo for Free Users with Scans Left */}
        {!isPro && freeScansRemaining > 0 && (
          <Animated.View entering={FadeIn.delay(300).duration(400)} className="mb-4">
            <Pressable onPress={() => router.push('/paywall')}>
              <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
                <View className="bg-forest-50/50 p-4">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">✨</Text>
                    <View className="flex-1">
                      <Text className="text-forest-900 font-medium text-sm">
                        Upgrade to Pro for unlimited scans
                      </Text>
                    </View>
                    <Text className="text-forest-900">›</Text>
                  </View>
                </View>
              </BlurView>
            </Pressable>
          </Animated.View>
        )}

        {/* Tips */}
        <Animated.View entering={FadeIn.delay(400).duration(400)} className="mt-4">
          <Text className="text-ink font-semibold mb-3">Tips for best results</Text>

          <View className="space-y-2">
            <TipItem icon="💡" text="Good lighting, avoid shadows" />
            <TipItem icon="📐" text="Keep stamp flat and centered" />
            <TipItem icon="🔍" text="Get close for details" />
            <TipItem icon="📸" text="Multiple stamps? We detect them all!" />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function TipItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View className="flex-row items-center mb-2">
      <Text className="text-lg mr-3">{icon}</Text>
      <Text className="text-ink-light">{text}</Text>
    </View>
  );
}
