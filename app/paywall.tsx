import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSubscriptionContext } from '@/lib/providers/SubscriptionProvider';
import type { PurchasesPackage } from 'react-native-purchases';

const FEATURES = [
  { icon: '📷', title: 'Unlimited Scans', description: 'Identify as many stamps as you want' },
  { icon: '🤖', title: 'Advanced AI', description: 'Higher accuracy stamp identification' },
  { icon: '📊', title: 'Value Tracking', description: 'Track your collection worth over time' },
  { icon: '☁️', title: 'Cloud Backup', description: 'Sync across all your devices' },
  { icon: '📱', title: 'Export Data', description: 'Export your collection to CSV/PDF' },
  { icon: '💬', title: 'Priority Support', description: 'Get help when you need it' },
];

export default function PaywallScreen() {
  const { offerings, purchasePackage, restorePurchases, isPro, isLoading } = useSubscriptionContext();
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);

  // Already pro - redirect
  if (isPro) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
        <View className="w-20 h-20 rounded-full bg-success/20 items-center justify-center mb-6">
          <Text className="text-4xl">🎉</Text>
        </View>
        <Text className="text-2xl font-bold text-ink text-center mb-2">
          You're Already Pro!
        </Text>
        <Text className="text-ink-light text-center mb-6">
          Enjoy unlimited access to all StampID features.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-forest-900 rounded-xl py-4 px-8"
        >
          <Text className="text-white font-semibold">Continue</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </SafeAreaView>
    );
  }

  const packages = offerings?.current?.availablePackages || [];

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setPurchasing(true);
    setSelectedPkg(pkg.identifier);

    try {
      const customerInfo = await purchasePackage(pkg);

      if (customerInfo?.entitlements.active['pro']) {
        Alert.alert(
          'Welcome to Pro! 🎉',
          'You now have unlimited access to all StampID features.',
          [{ text: 'Let\'s Go!', onPress: () => router.back() }]
        );
      }
    } catch (error: any) {
      Alert.alert('Purchase Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
      setSelectedPkg(null);
    }
  };

  const handleRestore = async () => {
    setPurchasing(true);

    try {
      const customerInfo = await restorePurchases();

      if (customerInfo?.entitlements.active['pro']) {
        Alert.alert(
          'Subscription Restored!',
          'Your Pro subscription has been restored.',
          [{ text: 'Continue', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('No Purchases Found', 'We couldn\'t find any previous purchases to restore.');
      }
    } catch (error: any) {
      Alert.alert('Restore Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  // Format price per month for annual plans
  const getMonthlyPrice = (pkg: PurchasesPackage) => {
    if (pkg.packageType === 'ANNUAL' && pkg.product.price) {
      const monthly = pkg.product.price / 12;
      return `${pkg.product.currencyCode} ${monthly.toFixed(2)}/mo`;
    }
    return null;
  };

  // Calculate savings for annual
  const getSavingsPercent = (packages: PurchasesPackage[]) => {
    const monthly = packages.find(p => p.packageType === 'MONTHLY');
    const annual = packages.find(p => p.packageType === 'ANNUAL');

    if (monthly && annual) {
      const monthlyYearCost = monthly.product.price * 12;
      const savings = ((monthlyYearCost - annual.product.price) / monthlyYearCost) * 100;
      return Math.round(savings);
    }
    return null;
  };

  const savingsPercent = getSavingsPercent(packages);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} className="py-2 pr-4">
          <Text className="text-forest-900 font-medium">← Back</Text>
        </Pressable>
        <Pressable onPress={handleRestore} disabled={purchasing} className="py-2 pl-4">
          <Text className="text-forest-900 font-medium">Restore</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View entering={FadeIn.duration(400)} className="items-center px-6 pt-4">
          <View className="w-20 h-20 rounded-full bg-forest-100 items-center justify-center mb-4">
            <Text className="text-4xl">🏆</Text>
          </View>
          <Text className="text-3xl font-bold text-ink text-center mb-2">
            Unlock StampID Pro
          </Text>
          <Text className="text-ink-light text-center text-lg">
            Get unlimited scans and premium features
          </Text>
        </Animated.View>

        {/* Features */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          className="px-6 mt-8"
        >
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70 p-4">
              {FEATURES.map((feature, index) => (
                <View
                  key={feature.title}
                  className={`flex-row items-center ${index > 0 ? 'mt-4' : ''}`}
                >
                  <View className="w-10 h-10 rounded-full bg-forest-100 items-center justify-center mr-3">
                    <Text className="text-lg">{feature.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-ink font-semibold">{feature.title}</Text>
                    <Text className="text-ink-light text-sm">{feature.description}</Text>
                  </View>
                  <Text className="text-success text-lg">✓</Text>
                </View>
              ))}
            </View>
          </BlurView>
        </Animated.View>

        {/* Pricing */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          className="px-6 mt-6"
        >
          {packages.length === 0 ? (
            <View className="bg-white/70 rounded-2xl p-6 items-center">
              <Text className="text-ink-light">Loading pricing...</Text>
            </View>
          ) : (
            <View className="gap-3">
              {packages.map((pkg) => {
                const isAnnual = pkg.packageType === 'ANNUAL';
                const isSelected = selectedPkg === pkg.identifier;
                const monthlyEquiv = getMonthlyPrice(pkg);

                return (
                  <Pressable
                    key={pkg.identifier}
                    onPress={() => handlePurchase(pkg)}
                    disabled={purchasing}
                    className={`rounded-2xl overflow-hidden ${
                      isAnnual ? 'border-2 border-forest-900' : 'border border-ink-muted/30'
                    }`}
                  >
                    <BlurView intensity={20} tint="light">
                      <View className={`p-5 ${isAnnual ? 'bg-forest-50/80' : 'bg-white/70'}`}>
                        {/* Best Value Badge */}
                        {isAnnual && savingsPercent && (
                          <View className="absolute top-0 right-0 bg-forest-900 px-3 py-1 rounded-bl-xl">
                            <Text className="text-white text-xs font-bold">
                              SAVE {savingsPercent}%
                            </Text>
                          </View>
                        )}

                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <Text className="text-ink font-bold text-lg">
                              {pkg.product.title || (isAnnual ? 'Annual' : 'Monthly')}
                            </Text>
                            {monthlyEquiv && (
                              <Text className="text-forest-900 text-sm font-medium">
                                {monthlyEquiv} billed annually
                              </Text>
                            )}
                          </View>

                          <View className="items-end">
                            <Text className="text-2xl font-bold text-forest-900">
                              {pkg.product.priceString}
                            </Text>
                            <Text className="text-ink-light text-sm">
                              {isAnnual ? '/year' : '/month'}
                            </Text>
                          </View>
                        </View>

                        {/* Loading indicator */}
                        {isSelected && purchasing && (
                          <View className="absolute inset-0 bg-white/80 items-center justify-center">
                            <ActivityIndicator size="small" color="#1B4332" />
                          </View>
                        )}
                      </View>
                    </BlurView>
                  </Pressable>
                );
              })}
            </View>
          )}
        </Animated.View>

        {/* Terms */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          className="px-6 mt-6"
        >
          <Text className="text-ink-muted text-xs text-center leading-5">
            Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period.
            Your account will be charged for renewal within 24 hours prior to the end of the current period.
            You can manage and cancel your subscriptions in your App Store settings.
          </Text>

          <View className="flex-row justify-center mt-4 gap-6">
            <Pressable onPress={() => {}}>
              <Text className="text-forest-900 text-sm font-medium">Terms of Service</Text>
            </Pressable>
            <Pressable onPress={() => {}}>
              <Text className="text-forest-900 text-sm font-medium">Privacy Policy</Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
