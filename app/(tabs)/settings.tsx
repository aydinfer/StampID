import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlassCard, GlassButton, GlassSwitch } from '@/components/ui/glass';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOnboarding } from '@/lib/hooks/useOnboarding';
import { useAppStore } from '@/lib/store/appStore';

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  label: string;
  type: 'switch' | 'button' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  subtitle?: string;
}

/**
 * Settings Screen - Production-ready app settings
 *
 * Features:
 * - Account management
 * - Notifications toggle
 * - App preferences
 * - Subscription management
 * - Sign out functionality
 * - Clear onboarding (for re-viewing)
 */
export default function SettingsScreen() {
  const { signOut, user } = useAuth();
  const { resetOnboarding } = useOnboarding();
  const { theme, setTheme } = useAppStore();

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setIsSigningOut(true);
          try {
            await signOut();
            router.replace('/(auth)/sign-in');
          } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to sign out');
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  };

  const handleClearOnboarding = async () => {
    Alert.alert(
      'Reset Onboarding',
      'This will clear your onboarding status so you can view it again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            try {
              await resetOnboarding();
              Alert.alert('Success', 'Onboarding has been reset. Sign out to see it again.');
            } catch {
              Alert.alert('Error', 'Failed to reset onboarding');
            }
          },
        },
      ]
    );
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all locally cached data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const sections: SettingsSection[] = [
    {
      title: 'Account',
      items: [
        {
          label: 'Email',
          type: 'info',
          subtitle: user?.email || 'Not signed in',
        },
        {
          label: 'Profile',
          type: 'button',
          subtitle: 'View and edit your profile',
          onPress: () => router.push('/profile'),
        },
        {
          label: 'Subscription',
          type: 'button',
          subtitle: 'Manage your subscription',
          onPress: () => router.push('/subscription'),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          label: 'Push Notifications',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          label: 'Email Notifications',
          type: 'switch',
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          label: 'Dark Mode',
          type: 'switch',
          value: theme === 'dark',
          onToggle: (value: boolean) => setTheme(value ? 'dark' : 'light'),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          label: 'App Version',
          type: 'info',
          subtitle: '1.0.0',
        },
        {
          label: 'Reset Onboarding',
          type: 'button',
          subtitle: 'View onboarding screens again',
          onPress: handleClearOnboarding,
        },
        {
          label: 'Clear Cache',
          type: 'button',
          subtitle: 'Clear all locally stored data',
          onPress: handleClearCache,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          label: 'Help Center',
          type: 'button',
          subtitle: 'Get help and support',
          onPress: () => Alert.alert('Help Center', 'Help center coming soon'),
        },
        {
          label: 'Privacy Policy',
          type: 'button',
          subtitle: 'Read our privacy policy',
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy coming soon'),
        },
        {
          label: 'Terms of Service',
          type: 'button',
          subtitle: 'Read our terms of service',
          onPress: () => Alert.alert('Terms', 'Terms of service coming soon'),
        },
      ],
    },
  ];

  const renderSettingsItem = (item: SettingsItem, index: number) => {
    if (item.type === 'switch') {
      return (
        <View key={index} className="py-3 border-b border-white/10">
          <GlassSwitch
            value={item.value || false}
            onValueChange={item.onToggle || (() => {})}
            label={item.label}
          />
          {item.subtitle && (
            <Text className="text-white/50 text-xs mt-1 ml-12">{item.subtitle}</Text>
          )}
        </View>
      );
    }

    if (item.type === 'button') {
      return (
        <Pressable key={index} onPress={item.onPress} className="py-3 border-b border-white/10">
          <Text className="text-white font-medium mb-1">{item.label}</Text>
          {item.subtitle && <Text className="text-white/50 text-sm">{item.subtitle}</Text>}
        </Pressable>
      );
    }

    // info type
    return (
      <View key={index} className="py-3 border-b border-white/10">
        <Text className="text-white/70 text-sm mb-1">{item.label}</Text>
        <Text className="text-white font-medium">{item.subtitle}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/60" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} className="px-4 pt-4 pb-6">
          <Text className="text-4xl font-bold text-white mb-2">Settings</Text>
          <Text className="text-white/70">Manage your account and preferences</Text>
        </Animated.View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {sections.map((section, sectionIndex) => (
            <Animated.View
              key={sectionIndex}
              entering={FadeInDown.delay(200 + sectionIndex * 100).duration(600)}
            >
              <GlassCard variant="default" intensity={60} className="p-6 mb-4">
                <Text className="text-white text-lg font-bold mb-4">{section.title}</Text>
                {section.items.map((item, itemIndex) => renderSettingsItem(item, itemIndex))}
              </GlassCard>
            </Animated.View>
          ))}

          {/* Sign Out Button */}
          <Animated.View entering={FadeInDown.delay(200 + sections.length * 100).duration(600)}>
            <GlassButton
              title="Sign Out"
              variant="secondary"
              size="lg"
              onPress={handleSignOut}
              loading={isSigningOut}
              disabled={isSigningOut}
              className="mb-8"
            />
          </Animated.View>

          {/* Footer */}
          <View className="items-center pb-8">
            <Text className="text-white/40 text-xs">Built with Expo SDK 54 • NativeWind v4</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
