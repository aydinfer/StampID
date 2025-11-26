import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Permission loading state
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-ink items-center justify-center">
        <Text className="text-white">Loading camera...</Text>
      </SafeAreaView>
    );
  }

  // Permission not granted
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-cream px-6 justify-center">
        <View className="items-center">
          <Text className="text-6xl mb-6">📷</Text>
          <Text className="text-2xl font-bold text-ink text-center mb-3">
            Camera Access Needed
          </Text>
          <Text className="text-ink-light text-center mb-8">
            StampID needs camera access to scan and identify your stamps.
          </Text>
          <Pressable
            onPress={requestPermission}
            className="bg-forest-900 rounded-xl py-4 px-8 active:opacity-90"
          >
            <Text className="text-white font-semibold text-base">Grant Permission</Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="mt-4 py-2"
          >
            <Text className="text-forest-900 font-medium">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Take photo
  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        // Navigate to scan result with the image
        router.push({
          pathname: '/scan-result',
          params: { imageUri: photo.uri },
        });
      }
    } catch (error) {
      console.error('Failed to capture:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  // Pick from gallery
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      router.push({
        pathname: '/scan-result',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  // Toggle camera facing
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View className="flex-1 bg-black">
      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
      >
        {/* Overlay UI */}
        <SafeAreaView className="flex-1">
          {/* Top Bar */}
          <View className="flex-row justify-between items-center px-4 pt-2">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            >
              <Text className="text-white text-xl">✕</Text>
            </Pressable>

            <Text className="text-white font-semibold text-lg">Scan Stamp</Text>

            <Pressable
              onPress={toggleCameraFacing}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            >
              <Text className="text-white text-xl">🔄</Text>
            </Pressable>
          </View>

          {/* Center Guide */}
          <View className="flex-1 items-center justify-center">
            <View className="w-64 h-64 border-2 border-white/50 rounded-2xl">
              {/* Corner markers */}
              <View className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
              <View className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
              <View className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
              <View className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
            </View>
            <Text className="text-white/80 mt-4 text-center">
              Position stamp within the frame
            </Text>
          </View>

          {/* Bottom Controls */}
          <BlurView intensity={30} tint="dark" className="mx-4 mb-4 rounded-3xl overflow-hidden">
            <View className="flex-row items-center justify-around py-6 px-4">
              {/* Gallery Button */}
              <Pressable
                onPress={handlePickImage}
                className="w-14 h-14 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
              >
                <Text className="text-2xl">🖼️</Text>
              </Pressable>

              {/* Capture Button */}
              <Pressable
                onPress={handleCapture}
                className="w-20 h-20 rounded-full bg-white items-center justify-center active:scale-95"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <View className="w-16 h-16 rounded-full border-4 border-forest-900" />
              </Pressable>

              {/* Flash Button (placeholder) */}
              <Pressable
                className="w-14 h-14 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
              >
                <Text className="text-2xl">⚡</Text>
              </Pressable>
            </View>
          </BlurView>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
