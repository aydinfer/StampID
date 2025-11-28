import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSubscriptionContext, FREE_SCANS_LIMIT } from '@/lib/providers/SubscriptionProvider';

export default function SettingsScreen() {
  const { isPro, customerInfo, restorePurchases, freeScansRemaining, presentPaywall } = useSubscriptionContext();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const info = await restorePurchases();
      if (info?.entitlements.active['pro']) {
        Alert.alert('Success', 'Your subscription has been restored!');
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to restore purchases.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleManageSubscription = () => {
    // Deep link to App Store subscription management
    Linking.openURL('https://apps.apple.com/account/subscriptions');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-ink">Settings</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Section */}
        <Animated.View entering={FadeIn.duration(400)} className="px-4 mb-6">
          <Text className="text-ink-light text-sm font-medium mb-3 ml-1">SUBSCRIPTION</Text>

          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            {isPro ? (
              // Pro User
              <View className="bg-forest-50/80 p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-forest-900 rounded-full items-center justify-center mr-3">
                    <Text className="text-xl">🏆</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-forest-900 font-bold text-lg">StampID Pro</Text>
                    <Text className="text-forest-900/70 text-sm">Unlimited access</Text>
                  </View>
                </View>

                <View className="border-t border-forest-900/10 pt-3 mt-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-forest-900/70 text-sm">Status</Text>
                    <View className="bg-success/20 px-2 py-0.5 rounded-full">
                      <Text className="text-success text-xs font-semibold">Active</Text>
                    </View>
                  </View>

                  {customerInfo?.entitlements.active['pro']?.expirationDate && (
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-forest-900/70 text-sm">Renews</Text>
                      <Text className="text-forest-900 text-sm font-medium">
                        {new Date(customerInfo.entitlements.active['pro'].expirationDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  onPress={handleManageSubscription}
                  className="bg-forest-900/10 rounded-xl py-3 mt-4 items-center"
                >
                  <Text className="text-forest-900 font-medium">Manage Subscription</Text>
                </Pressable>
              </View>
            ) : (
              // Free User
              <View className="bg-white/70 p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-ink-muted/10 rounded-full items-center justify-center mr-3">
                    <Text className="text-xl">📮</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-ink font-bold text-lg">Free Plan</Text>
                    <Text className="text-ink-light text-sm">
                      {freeScansRemaining}/{FREE_SCANS_LIMIT} scans remaining today
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={presentPaywall}
                  className="bg-forest-900 rounded-xl py-3.5 items-center"
                >
                  <Text className="text-white font-semibold">Upgrade to Pro</Text>
                </Pressable>

                <Pressable
                  onPress={handleRestore}
                  disabled={isRestoring}
                  className="py-3 mt-2 items-center"
                >
                  <Text className="text-forest-900 font-medium">
                    {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                  </Text>
                </Pressable>
              </View>
            )}
          </BlurView>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-4 mb-6">
          <Text className="text-ink-light text-sm font-medium mb-3 ml-1">ACCOUNT</Text>

          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70">
              <SettingsRow
                icon="👤"
                title="Profile"
                onPress={() => {}}
              />
              <SettingsRow
                icon="🔔"
                title="Notifications"
                onPress={() => {}}
              />
              <SettingsRow
                icon="🔒"
                title="Privacy"
                onPress={() => {}}
                isLast
              />
            </View>
          </BlurView>
        </Animated.View>

        {/* Data Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-4 mb-6">
          <Text className="text-ink-light text-sm font-medium mb-3 ml-1">DATA</Text>

          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70">
              <SettingsRow
                icon="☁️"
                title="Cloud Backup"
                subtitle={isPro ? 'Enabled' : 'Pro feature'}
                onPress={() => !isPro && presentPaywall()}
              />
              <SettingsRow
                icon="📤"
                title="Export Collection"
                subtitle={isPro ? 'CSV, PDF' : 'Pro feature'}
                onPress={() => !isPro && presentPaywall()}
                isLast
              />
            </View>
          </BlurView>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-4 mb-6">
          <Text className="text-ink-light text-sm font-medium mb-3 ml-1">SUPPORT</Text>

          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70">
              <SettingsRow
                icon="❓"
                title="Help Center"
                onPress={() => {}}
              />
              <SettingsRow
                icon="💬"
                title="Contact Support"
                onPress={() => {}}
              />
              <SettingsRow
                icon="⭐"
                title="Rate StampID"
                onPress={() => {}}
                isLast
              />
            </View>
          </BlurView>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="px-4 mb-6">
          <Text className="text-ink-light text-sm font-medium mb-3 ml-1">ABOUT</Text>

          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70">
              <SettingsRow
                icon="📋"
                title="Terms of Service"
                onPress={() => {}}
              />
              <SettingsRow
                icon="🔐"
                title="Privacy Policy"
                onPress={() => {}}
              />
              <View className="flex-row items-center justify-between p-4 border-t border-ink-muted/10">
                <View className="flex-row items-center">
                  <Text className="text-xl mr-3">📱</Text>
                  <Text className="text-ink font-medium">App Version</Text>
                </View>
                <Text className="text-ink-muted">1.0.0</Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  isLast = false,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center p-4 active:bg-ink-muted/5 ${
        !isLast ? 'border-b border-ink-muted/10' : ''
      }`}
    >
      <Text className="text-xl mr-3">{icon}</Text>
      <View className="flex-1">
        <Text className="text-ink font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-ink-muted text-sm">{subtitle}</Text>
        )}
      </View>
      <Text className="text-ink-muted">›</Text>
    </Pressable>
  );
}
