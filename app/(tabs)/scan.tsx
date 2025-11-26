import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';

export default function ScanScreen() {
  const handleCamera = () => {
    router.push('/camera');
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
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
        <Text className="text-2xl font-bold text-ink">Scan Stamp</Text>
        <Text className="text-ink-light mt-1">Identify stamps using AI</Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        {/* Camera Option */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)}>
          <Pressable onPress={handleCamera}>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
              <View className="bg-white/70 p-6 flex-row items-center">
                <View className="w-16 h-16 bg-forest-900/10 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-3xl">📷</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-ink">Take Photo</Text>
                  <Text className="text-ink-light text-sm mt-0.5">
                    Capture stamp with camera
                  </Text>
                </View>
                <Text className="text-ink-muted text-xl">›</Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>

        {/* Gallery Option */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Pressable onPress={handleGallery}>
            <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden mb-4">
              <View className="bg-white/70 p-6 flex-row items-center">
                <View className="w-16 h-16 bg-forest-900/10 rounded-2xl items-center justify-center mr-4">
                  <Text className="text-3xl">🖼️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-ink">From Gallery</Text>
                  <Text className="text-ink-light text-sm mt-0.5">
                    Select from photo library
                  </Text>
                </View>
                <Text className="text-ink-muted text-xl">›</Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>

        {/* Tips */}
        <Animated.View entering={FadeIn.delay(400).duration(400)} className="mt-8">
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
