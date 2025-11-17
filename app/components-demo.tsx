import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, GlassButton, GlassModal, GlassInput } from '@/components/ui/glass';

/**
 * Components Demo - Interactive showcase of glassmorphic components
 *
 * Navigate to this page to see all glass components in action
 */
export default function ComponentsDemo() {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleButtonPress = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/40" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 gap-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <GlassCard variant="premium" intensity={80} className="p-6">
            <Text className="text-3xl font-bold text-white mb-2">
              Glassmorphism Components
            </Text>
            <Text className="text-white/70 text-base">
              Interactive showcase of all glass UI components
            </Text>
          </GlassCard>

          {/* Section: Cards */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-white px-2">Cards</Text>

            <GlassCard variant="default" className="p-6">
              <Text className="text-white font-semibold text-lg mb-2">Default Card</Text>
              <Text className="text-white/70">
                A standard glass card with medium blur and subtle borders.
              </Text>
            </GlassCard>

            <GlassCard variant="premium" intensity={80} className="p-6">
              <Text className="text-white font-semibold text-lg mb-2">Premium Card</Text>
              <Text className="text-white/70">
                Enhanced glass effect with higher intensity and rounded corners.
              </Text>
            </GlassCard>

            <GlassCard variant="subtle" intensity={40} className="p-6">
              <Text className="text-white font-semibold text-lg mb-2">Subtle Card</Text>
              <Text className="text-white/70">
                Minimal glass effect for understated elegance.
              </Text>
            </GlassCard>
          </View>

          {/* Section: Buttons */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-white px-2">Buttons</Text>

            <GlassCard className="p-6 gap-3">
              <GlassButton
                title="Primary Button"
                variant="primary"
                size="lg"
                onPress={handleButtonPress}
                loading={buttonLoading}
              />

              <GlassButton
                title="Secondary Button"
                variant="secondary"
                size="md"
                onPress={() => console.log('Secondary pressed')}
              />

              <GlassButton
                title="Ghost Button"
                variant="ghost"
                size="sm"
                onPress={() => console.log('Ghost pressed')}
              />

              <GlassButton
                title="Disabled Button"
                variant="primary"
                disabled
                onPress={() => {}}
              />
            </GlassCard>
          </View>

          {/* Section: Inputs */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-white px-2">Inputs</Text>

            <GlassCard className="p-6 gap-4">
              <GlassInput
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <GlassInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
              />

              <GlassInput
                label="With Error"
                placeholder="Invalid input"
                error="This field is required"
              />
            </GlassCard>
          </View>

          {/* Section: Modal */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-white px-2">Modal</Text>

            <GlassCard className="p-6">
              <Text className="text-white/70 mb-4">
                Tap the button below to see a glassmorphic modal with smooth animations.
              </Text>
              <GlassButton
                title="Open Modal"
                variant="secondary"
                onPress={() => setModalVisible(true)}
              />
            </GlassCard>
          </View>

          {/* Section: Complex Layout */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-white px-2">Complex Example</Text>

            <GlassCard variant="premium" intensity={80} className="p-6">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-2xl font-bold text-white">$1,234.56</Text>
                  <Text className="text-white/70 text-sm">Total Balance</Text>
                </View>
                <View className="bg-success-500/20 px-3 py-1 rounded-full border border-success-500/30">
                  <Text className="text-success-400 font-semibold">+12.5%</Text>
                </View>
              </View>

              <View className="h-px bg-white/10 my-4" />

              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white/70">Portfolio Value</Text>
                  <Text className="text-white font-semibold">$987.65</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-white/70">Cash Available</Text>
                  <Text className="text-white font-semibold">$246.91</Text>
                </View>
              </View>

              <GlassButton
                title="View Details"
                variant="secondary"
                className="mt-4"
                onPress={() => console.log('View details')}
              />
            </GlassCard>
          </View>

          {/* Section: Grid Layout */}
          <View className="gap-4">
            <Text className="text-2xl font-bold text-white px-2">Grid Layout</Text>

            <View className="flex-row gap-3">
              <GlassCard variant="subtle" className="flex-1 p-4 items-center">
                <Text className="text-4xl mb-2">🎨</Text>
                <Text className="text-white font-semibold">Design</Text>
              </GlassCard>

              <GlassCard variant="subtle" className="flex-1 p-4 items-center">
                <Text className="text-4xl mb-2">⚡</Text>
                <Text className="text-white font-semibold">Speed</Text>
              </GlassCard>
            </View>

            <View className="flex-row gap-3">
              <GlassCard variant="subtle" className="flex-1 p-4 items-center">
                <Text className="text-4xl mb-2">🔒</Text>
                <Text className="text-white font-semibold">Secure</Text>
              </GlassCard>

              <GlassCard variant="subtle" className="flex-1 p-4 items-center">
                <Text className="text-4xl mb-2">🚀</Text>
                <Text className="text-white font-semibold">Launch</Text>
              </GlassCard>
            </View>
          </View>

          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>

      {/* Modal */}
      <GlassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Glassmorphic Modal"
        intensity={80}
      >
        <View className="gap-4">
          <Text className="text-white/70">
            This is a beautiful glassmorphic modal with smooth slide-in animations and blur
            effects.
          </Text>

          <GlassInput
            label="Your Name"
            placeholder="Enter your name"
            intensity={30}
          />

          <GlassButton
            title="Submit"
            variant="primary"
            onPress={() => {
              setModalVisible(false);
              console.log('Form submitted');
            }}
          />

          <GlassButton
            title="Cancel"
            variant="ghost"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </GlassModal>
    </ImageBackground>
  );
}
