import React, { useState } from 'react';
import { View, Text, ImageBackground, ScrollView, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard, GlassButton, GlassLoadingSpinner } from '@/components/ui/glass';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { formatDate } from '@/lib/utils/format';

/**
 * Subscription Management Screen
 *
 * Features:
 * - View current subscription status
 * - Manage subscription (cancel/update via store)
 * - Restore purchases
 * - View subscription details
 */
export default function SubscriptionScreen() {
  const {
    isLoading,
    isPro,
    hasActiveSubscription,
    restorePurchases,
    manageSubscription,
    getSubscriptionStatus,
  } = useSubscription();

  const [isRestoring, setIsRestoring] = useState(false);

  const subscriptionStatus = getSubscriptionStatus();

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      await restorePurchases();
      Alert.alert('Success', 'Your purchases have been restored!');
    } catch (error: any) {
      Alert.alert('Restore Failed', error?.message || 'Failed to restore purchases');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      await manageSubscription();
    } catch {
      Alert.alert(
        'Error',
        'Unable to open subscription management. Please check your app store settings.'
      );
    }
  };

  const handleUpgrade = () => {
    // Navigate to paywall or offerings screen
    Alert.alert(
      'Upgrade to Pro',
      'Use RevenueCat PaywallView component here to display subscription options.',
      [{ text: 'OK' }]
    );
  };

  if (isLoading) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
        className="flex-1"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/60" />
        <SafeAreaView className="flex-1 items-center justify-center">
          <GlassLoadingSpinner />
        </SafeAreaView>
      </ImageBackground>
    );
  }

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
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary-400 text-base font-medium mb-4">← Back</Text>
          </Pressable>
          <Text className="text-4xl font-bold text-white mb-2">Subscription</Text>
          <Text className="text-white/70">Manage your subscription and billing</Text>
        </Animated.View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Current Plan Card */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <GlassCard variant="premium" intensity={80} className="p-6 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-xl font-bold">Current Plan</Text>
                {hasActiveSubscription && (
                  <View className="bg-success-500 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-semibold">Active</Text>
                  </View>
                )}
              </View>

              {hasActiveSubscription ? (
                <View>
                  <Text className="text-white text-3xl font-bold mb-2">
                    {isPro ? 'Pro Plan' : 'Premium'}
                  </Text>

                  {subscriptionStatus && (
                    <View className="space-y-3">
                      {/* Renewal Status */}
                      <View className="flex-row justify-between py-2 border-b border-white/10">
                        <Text className="text-white/70">Status</Text>
                        <Text className="text-white">
                          {subscriptionStatus.willRenew ? 'Will Renew' : 'Expires'}
                        </Text>
                      </View>

                      {/* Expiration Date */}
                      {subscriptionStatus.expirationDate && (
                        <View className="flex-row justify-between py-2 border-b border-white/10">
                          <Text className="text-white/70">
                            {subscriptionStatus.willRenew ? 'Renews On' : 'Expires On'}
                          </Text>
                          <Text className="text-white">
                            {formatDate(subscriptionStatus.expirationDate)}
                          </Text>
                        </View>
                      )}

                      {/* Product ID */}
                      <View className="flex-row justify-between py-2">
                        <Text className="text-white/70">Plan</Text>
                        <Text className="text-white text-sm">{subscriptionStatus.productId}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <Text className="text-white text-3xl font-bold mb-2">Free Plan</Text>
                  <Text className="text-white/70 mb-6">Upgrade to Pro to unlock all features</Text>

                  <GlassButton
                    title="Upgrade to Pro"
                    variant="primary"
                    size="lg"
                    onPress={handleUpgrade}
                  />
                </View>
              )}
            </GlassCard>
          </Animated.View>

          {/* Pro Features (if not subscribed) */}
          {!hasActiveSubscription && (
            <Animated.View entering={FadeInDown.delay(300).duration(600)}>
              <GlassCard variant="default" intensity={60} className="p-6 mb-4">
                <Text className="text-white text-lg font-bold mb-4">Pro Features</Text>

                {[
                  'Unlimited access to all features',
                  'Priority customer support',
                  'No ads',
                  'Advanced analytics',
                  'Export data',
                  'Custom themes',
                ].map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-3">
                    <Text className="text-success-400 text-xl mr-3">✓</Text>
                    <Text className="text-white/90">{feature}</Text>
                  </View>
                ))}
              </GlassCard>
            </Animated.View>
          )}

          {/* Actions */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <GlassCard variant="default" intensity={60} className="p-6 mb-4">
              <Text className="text-white text-lg font-bold mb-4">Actions</Text>

              {/* Manage Subscription */}
              {hasActiveSubscription && (
                <GlassButton
                  title="Manage Subscription"
                  variant="secondary"
                  size="md"
                  onPress={handleManageSubscription}
                  className="mb-3"
                />
              )}

              {/* Restore Purchases */}
              <GlassButton
                title="Restore Purchases"
                variant="secondary"
                size="md"
                onPress={handleRestorePurchases}
                loading={isRestoring}
                disabled={isRestoring}
              />

              <Text className="text-white/50 text-xs mt-4 text-center">
                If you previously purchased a subscription on another device, tap "Restore
                Purchases" to activate it on this device.
              </Text>
            </GlassCard>
          </Animated.View>

          {/* Help */}
          <Animated.View entering={FadeInDown.delay(500).duration(600)}>
            <GlassCard variant="subtle" intensity={40} className="p-6 mb-8">
              <Text className="text-white text-lg font-bold mb-2">Need Help?</Text>
              <Text className="text-white/70 text-sm mb-4">
                Have questions about your subscription or billing? Visit our help center or contact
                support.
              </Text>

              <Pressable onPress={() => {}}>
                <Text className="text-primary-400 font-medium">Contact Support →</Text>
              </Pressable>
            </GlassCard>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
