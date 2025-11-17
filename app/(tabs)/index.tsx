import React from 'react';
import { View, Text, ImageBackground, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GlassCard, GlassButton } from '@/components/ui/glass';

/**
 * Home Screen - Welcome screen showcasing the Expo Starter template
 *
 * Features:
 * - Glassmorphic branding card
 * - Tech stack showcase
 * - Quick start guide
 * - Navigation to UI components demo
 */
export default function HomeScreen() {
  const techStack = [
    {
      name: 'Expo',
      description: 'Latest SDK 54',
      icon: '⚛️',
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Supabase',
      description: 'Auth & Database',
      icon: '🗄️',
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'RevenueCat',
      description: 'In-App Purchases',
      icon: '💰',
      color: 'from-purple-500 to-purple-600',
    },
    {
      name: 'NativeWind',
      description: 'Tailwind CSS',
      icon: '🎨',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      name: 'React Query',
      description: 'Server State',
      icon: '🔄',
      color: 'from-red-500 to-red-600',
    },
    {
      name: 'TypeScript',
      description: 'Type Safety',
      icon: '📘',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  const quickStart = [
    {
      step: '1',
      title: 'Explore UI Components',
      description: 'Check out the glassmorphic design system',
      action: 'View Components',
      onPress: () => router.push('/components-demo'),
    },
    {
      step: '2',
      title: 'Set Up Supabase',
      description: 'Configure authentication and database',
      action: 'Read Docs',
      onPress: () => console.log('Open Supabase docs'),
    },
    {
      step: '3',
      title: 'Add Your Features',
      description: 'Start building your app with the starter',
      action: 'Get Started',
      onPress: () => console.log('Get started'),
    },
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/50" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 gap-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Header - Expo Starter Branding */}
          <GlassCard variant="premium" intensity={80} className="p-8 items-center">
            {/* Logo */}
            <View className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl items-center justify-center mb-4 border-4 border-white/20 shadow-2xl">
              <Text className="text-white text-4xl font-bold">E</Text>
            </View>

            <Text className="text-white text-3xl font-bold text-center mb-2">
              Expo Starter
            </Text>
            <Text className="text-white/70 text-center text-base mb-4">
              Production-ready React Native template with glassmorphic UI
            </Text>

            {/* Quick Action Buttons */}
            <View className="flex-row gap-3 w-full">
              <GlassButton
                title="UI Components"
                variant="primary"
                onPress={() => router.push('/components-demo')}
                className="flex-1"
              />
              <GlassButton
                title="Examples"
                variant="secondary"
                onPress={() => router.push('/example-login')}
                className="flex-1"
              />
            </View>
          </GlassCard>

          {/* Tech Stack */}
          <View>
            <Text className="text-white text-xl font-bold px-2 mb-3">
              🚀 Tech Stack
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {techStack.map((tech, index) => (
                <View key={index} className="w-[48%]">
                  <GlassCard className="p-4">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-3xl mr-2">{tech.icon}</Text>
                      <View className="flex-1">
                        <Text className="text-white font-bold text-base">
                          {tech.name}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-white/70 text-sm">{tech.description}</Text>
                  </GlassCard>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Start Guide */}
          <View>
            <Text className="text-white text-xl font-bold px-2 mb-3">
              📚 Quick Start
            </Text>

            {quickStart.map((item, index) => (
              <GlassCard key={index} className="p-4 mb-3">
                <View className="flex-row items-start">
                  {/* Step Number */}
                  <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white font-bold">{item.step}</Text>
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-white/70 text-sm mb-3">
                      {item.description}
                    </Text>

                    <Pressable
                      onPress={item.onPress}
                      className="bg-white/10 px-4 py-2 rounded-lg active:bg-white/20 self-start"
                    >
                      <Text className="text-primary-400 font-semibold text-sm">
                        {item.action} →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </GlassCard>
            ))}
          </View>

          {/* Features List */}
          <GlassCard className="p-6">
            <Text className="text-white text-lg font-bold mb-4">
              ✨ What's Included
            </Text>

            {[
              'Glassmorphic UI components',
              'Supabase authentication setup',
              'RevenueCat subscription handling',
              'React Query for server state',
              'Zustand for client state',
              'File-based routing with Expo Router',
              'TypeScript strict mode',
              'NativeWind v4 (Tailwind CSS)',
              'Complete documentation',
            ].map((feature, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Text className="text-primary-400 mr-2">✓</Text>
                <Text className="text-white/90 text-sm flex-1">{feature}</Text>
              </View>
            ))}
          </GlassCard>

          {/* Example Screens */}
          <View>
            <Text className="text-white text-xl font-bold px-2 mb-3">
              🎨 Example Screens
            </Text>

            <View className="gap-3">
              <Pressable
                onPress={() => router.push('/example-login')}
                className="active:opacity-80"
              >
                <GlassCard className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-3xl mr-3">🔐</Text>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-base">
                        Login Screen
                      </Text>
                      <Text className="text-white/70 text-sm">
                        Form validation & social auth
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/40 text-xl">›</Text>
                </GlassCard>
              </Pressable>

              <Pressable
                onPress={() => router.push('/example-profile')}
                className="active:opacity-80"
              >
                <GlassCard className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-3xl mr-3">👤</Text>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-base">
                        Profile Screen
                      </Text>
                      <Text className="text-white/70 text-sm">
                        Stats, tabs & edit modal
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/40 text-xl">›</Text>
                </GlassCard>
              </Pressable>

              <Pressable
                onPress={() => router.push('/example-settings')}
                className="active:opacity-80"
              >
                <GlassCard className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-3xl mr-3">⚙️</Text>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-base">
                        Settings Screen
                      </Text>
                      <Text className="text-white/70 text-sm">
                        Switches & bottom sheet
                      </Text>
                    </View>
                  </View>
                  <Text className="text-white/40 text-xl">›</Text>
                </GlassCard>
              </Pressable>
            </View>
          </View>

          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
