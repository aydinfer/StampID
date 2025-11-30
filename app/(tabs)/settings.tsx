import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Trophy, Mail, User, Bell, Lock, Cloud, Download,
  HelpCircle, MessageCircle, Star, FileText, Shield, Smartphone, ChevronRight
} from 'lucide-react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors } from '@/lib/design/tokens';
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
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className="text-display font-sans-bold text-zinc-900">Settings</Text>
        <Text className="text-caption text-zinc-500 mt-1">Manage your account</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Section */}
        <Animated.View entering={FadeIn.duration(400)} className="px-4 mb-6">
          <Text className="text-zinc-400 text-micro font-sans-semibold mb-3 ml-1 tracking-wide">SUBSCRIPTION</Text>

          <GlassCard variant="card" padding="md">
            {isPro ? (
              // Pro User
              <View className="bg-indigo-500 -m-4 p-4 rounded-2xl">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-3">
                    <Trophy size={24} color="#FFFFFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-sans-bold text-body">StampID Pro</Text>
                    <Text className="text-white/70 text-caption">Unlimited access</Text>
                  </View>
                </View>

                <View className="border-t border-white/20 pt-3 mt-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-white/70 text-caption">Status</Text>
                    <View className="bg-teal-400/20 px-2 py-0.5 rounded-full">
                      <Text className="text-teal-300 text-micro font-sans-semibold">Active</Text>
                    </View>
                  </View>

                  {customerInfo?.entitlements.active['pro']?.expirationDate && (
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-white/70 text-caption">Renews</Text>
                      <Text className="text-white text-caption font-sans-medium">
                        {new Date(customerInfo.entitlements.active['pro'].expirationDate).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  onPress={handleManageSubscription}
                  className="bg-white/20 rounded-xl py-3 mt-4 items-center active:bg-white/30"
                >
                  <Text className="text-white font-sans-medium">Manage Subscription</Text>
                </Pressable>
              </View>
            ) : (
              // Free User
              <View>
                <View className="flex-row items-center mb-4">
                  <View className="w-12 h-12 bg-zinc-100 rounded-full items-center justify-center mr-3">
                    <Mail size={24} color={colors.zinc[400]} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-zinc-900 font-sans-bold text-body">Free Plan</Text>
                    <Text className="text-zinc-500 text-caption">
                      {freeScansRemaining}/{FREE_SCANS_LIMIT} scans remaining today
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={presentPaywall}
                  className="bg-indigo-500 rounded-xl py-3.5 items-center active:opacity-90"
                >
                  <Text className="text-white font-sans-semibold">Upgrade to Pro</Text>
                </Pressable>

                <Pressable
                  onPress={handleRestore}
                  disabled={isRestoring}
                  className="py-3 mt-2 items-center"
                >
                  <Text className="text-indigo-500 font-sans-medium">
                    {isRestoring ? 'Restoring...' : 'Restore Purchases'}
                  </Text>
                </Pressable>
              </View>
            )}
          </GlassCard>
        </Animated.View>

        {/* Account Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-4 mb-6">
          <Text className="text-zinc-400 text-micro font-sans-semibold mb-3 ml-1 tracking-wide">ACCOUNT</Text>

          <GlassCard variant="card" padding="none">
            <SettingsRow
              icon={<User size={20} color={colors.zinc[500]} />}
              title="Profile"
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Bell size={20} color={colors.zinc[500]} />}
              title="Notifications"
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Lock size={20} color={colors.zinc[500]} />}
              title="Privacy"
              onPress={() => {}}
              isLast
            />
          </GlassCard>
        </Animated.View>

        {/* Data Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-4 mb-6">
          <Text className="text-zinc-400 text-micro font-sans-semibold mb-3 ml-1 tracking-wide">DATA</Text>

          <GlassCard variant="card" padding="none">
            <SettingsRow
              icon={<Cloud size={20} color={colors.zinc[500]} />}
              title="Cloud Backup"
              subtitle={isPro ? 'Enabled' : 'Pro feature'}
              onPress={() => !isPro && presentPaywall()}
            />
            <SettingsRow
              icon={<Download size={20} color={colors.zinc[500]} />}
              title="Export Collection"
              subtitle={isPro ? 'CSV, PDF' : 'Pro feature'}
              onPress={() => !isPro && presentPaywall()}
              isLast
            />
          </GlassCard>
        </Animated.View>

        {/* Support Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-4 mb-6">
          <Text className="text-zinc-400 text-micro font-sans-semibold mb-3 ml-1 tracking-wide">SUPPORT</Text>

          <GlassCard variant="card" padding="none">
            <SettingsRow
              icon={<HelpCircle size={20} color={colors.zinc[500]} />}
              title="Help Center"
              onPress={() => {}}
            />
            <SettingsRow
              icon={<MessageCircle size={20} color={colors.zinc[500]} />}
              title="Contact Support"
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Star size={20} color={colors.zinc[500]} />}
              title="Rate StampID"
              onPress={() => {}}
              isLast
            />
          </GlassCard>
        </Animated.View>

        {/* About Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} className="px-4 mb-6">
          <Text className="text-zinc-400 text-micro font-sans-semibold mb-3 ml-1 tracking-wide">ABOUT</Text>

          <GlassCard variant="card" padding="none">
            <SettingsRow
              icon={<FileText size={20} color={colors.zinc[500]} />}
              title="Terms of Service"
              onPress={() => {}}
            />
            <SettingsRow
              icon={<Shield size={20} color={colors.zinc[500]} />}
              title="Privacy Policy"
              onPress={() => {}}
            />
            <View className="flex-row items-center justify-between p-4 border-t border-zinc-100">
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-lg bg-zinc-50 items-center justify-center mr-3">
                  <Smartphone size={20} color={colors.zinc[500]} />
                </View>
                <Text className="text-zinc-900 font-sans-medium">App Version</Text>
              </View>
              <Text className="text-zinc-400 font-mono-regular">1.0.0</Text>
            </View>
          </GlassCard>
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
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center p-4 active:bg-zinc-50 ${
        !isLast ? 'border-b border-zinc-100' : ''
      }`}
    >
      <View className="w-9 h-9 rounded-lg bg-zinc-50 items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-zinc-900 font-sans-medium">{title}</Text>
        {subtitle && (
          <Text className="text-zinc-400 text-caption">{subtitle}</Text>
        )}
      </View>
      <ChevronRight size={18} color={colors.zinc[300]} />
    </Pressable>
  );
}
