import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image, Lock, Sparkles, Sun, Maximize2, ZoomIn, Layers, ChevronRight } from 'lucide-react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors } from '@/lib/design/tokens';
import { useSubscriptionContext, FREE_SCANS_LIMIT } from '@/lib/providers/SubscriptionProvider';

export default function ScanScreen() {
  const { isPro, freeScansRemaining, canScan, recordScan, presentPaywall } = useSubscriptionContext();

  const handleCamera = async () => {
    if (!canScan) {
      await presentPaywall();
      return;
    }

    // Record the scan attempt
    const allowed = await recordScan();
    if (!allowed) {
      await presentPaywall();
      return;
    }

    router.push('/camera');
  };

  const handleGallery = async () => {
    if (!canScan) {
      await presentPaywall();
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
        await presentPaywall();
        return;
      }

      router.push({
        pathname: '/scan-result',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-display font-sans-bold text-zinc-900">Scan Stamp</Text>
            <Text className="text-caption text-zinc-500 mt-1">Identify stamps using AI</Text>
          </View>

          {/* Subscription Badge */}
          {isPro ? (
            <View className="bg-indigo-500 px-3 py-1.5 rounded-full">
              <Text className="text-white text-micro font-sans-semibold">PRO</Text>
            </View>
          ) : (
            <Pressable onPress={presentPaywall}>
              <GlassCard variant="subtle" padding="none" rounded="full">
                <View className="bg-amber-100/80 px-3 py-1.5">
                  <Text className="text-amber-700 text-micro font-sans-semibold">
                    {freeScansRemaining}/{FREE_SCANS_LIMIT} scans
                  </Text>
                </View>
              </GlassCard>
            </Pressable>
          )}
        </View>
      </View>

      <View className="flex-1 px-4 pt-6">
        {/* Upgrade Banner for Free Users */}
        {!isPro && freeScansRemaining === 0 && (
          <Animated.View entering={FadeIn.duration(400)} className="mb-6">
            <Pressable onPress={presentPaywall}>
              <GlassCard variant="card" padding="md">
                <View className="bg-rose-50 -m-4 p-4 rounded-2xl">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-rose-100 items-center justify-center mr-3">
                      <Lock size={20} color={colors.rose[500]} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-zinc-900 font-sans-semibold">Daily Limit Reached</Text>
                      <Text className="text-zinc-500 text-caption">
                        Upgrade to Pro for unlimited scans
                      </Text>
                    </View>
                    <View className="bg-indigo-500 px-3 py-1.5 rounded-full">
                      <Text className="text-white text-micro font-sans-medium">Upgrade</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>
        )}

        {/* Camera Option */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} className="mb-3">
          <Pressable onPress={handleCamera} disabled={!canScan}>
            <GlassCard variant="card" padding="lg">
              <View className={`flex-row items-center ${!canScan ? 'opacity-50' : ''}`}>
                <View className="w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center mr-4">
                  <Camera size={28} color={colors.indigo[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-body font-sans-semibold text-zinc-900">Take Photo</Text>
                  <Text className="text-zinc-500 text-caption mt-0.5">
                    Capture stamp with camera
                  </Text>
                </View>
                {canScan ? (
                  <ChevronRight size={20} color={colors.zinc[400]} />
                ) : (
                  <Lock size={20} color={colors.zinc[400]} />
                )}
              </View>
            </GlassCard>
          </Pressable>
        </Animated.View>

        {/* Gallery Option */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} className="mb-3">
          <Pressable onPress={handleGallery} disabled={!canScan}>
            <GlassCard variant="card" padding="lg">
              <View className={`flex-row items-center ${!canScan ? 'opacity-50' : ''}`}>
                <View className="w-14 h-14 bg-teal-50 rounded-2xl items-center justify-center mr-4">
                  <Image size={28} color={colors.teal[500]} />
                </View>
                <View className="flex-1">
                  <Text className="text-body font-sans-semibold text-zinc-900">From Gallery</Text>
                  <Text className="text-zinc-500 text-caption mt-0.5">
                    Select from photo library
                  </Text>
                </View>
                {canScan ? (
                  <ChevronRight size={20} color={colors.zinc[400]} />
                ) : (
                  <Lock size={20} color={colors.zinc[400]} />
                )}
              </View>
            </GlassCard>
          </Pressable>
        </Animated.View>

        {/* Pro Promo for Free Users with Scans Left */}
        {!isPro && freeScansRemaining > 0 && (
          <Animated.View entering={FadeIn.delay(300).duration(400)} className="mb-4">
            <Pressable onPress={presentPaywall}>
              <GlassCard variant="subtle" padding="md">
                <View className="bg-indigo-50/50 -m-4 p-4 rounded-2xl">
                  <View className="flex-row items-center">
                    <Sparkles size={20} color={colors.indigo[500]} />
                    <View className="flex-1 ml-3">
                      <Text className="text-indigo-600 font-sans-medium text-caption">
                        Upgrade to Pro for unlimited scans
                      </Text>
                    </View>
                    <ChevronRight size={16} color={colors.indigo[500]} />
                  </View>
                </View>
              </GlassCard>
            </Pressable>
          </Animated.View>
        )}

        {/* Tips */}
        <Animated.View entering={FadeIn.delay(400).duration(400)} className="mt-4">
          <GlassCard variant="card" padding="md">
            <Text className="text-zinc-900 font-sans-semibold mb-3">Tips for best results</Text>
            <View className="gap-2">
              <TipItem icon={<Sun size={18} color={colors.amber[500]} />} text="Good lighting, avoid shadows" />
              <TipItem icon={<Maximize2 size={18} color={colors.teal[500]} />} text="Keep stamp flat and centered" />
              <TipItem icon={<ZoomIn size={18} color={colors.violet[500]} />} text="Get close for details" />
              <TipItem icon={<Layers size={18} color={colors.indigo[500]} />} text="Multiple stamps? We detect them all!" />
            </View>
          </GlassCard>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

function TipItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View className="flex-row items-center">
      <View className="w-8 h-8 rounded-lg bg-zinc-50 items-center justify-center mr-3">
        {icon}
      </View>
      <Text className="text-zinc-600 text-caption font-sans-medium flex-1">{text}</Text>
    </View>
  );
}
