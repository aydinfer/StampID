# Anonymous Variant Setup Guide

Convert your template to use **RevenueCat subscriptions without user authentication**.

**Perfect for:** Games, utilities, content apps, tools that don't require user accounts

**Time to complete:** 30-60 minutes

---

## What You'll Get

✅ RevenueCat subscriptions working anonymously
✅ All 13 glass components
✅ Onboarding flow
✅ Simplified settings screen
❌ No login/signup screens
❌ No user profiles
❌ No cloud storage or sync

---

## Step 1: Remove Supabase Dependencies

### 1.1 Uninstall Supabase Packages

```bash
npm uninstall @supabase/supabase-js react-native-url-polyfill --legacy-peer-deps
```

### 1.2 Remove Environment Variables

Delete or comment out in `.env`:

```bash
# EXPO_PUBLIC_SUPABASE_URL=your-project-url
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Step 2: Delete Authentication Files

Remove these files completely:

```bash
# Auth screens
rm app/(auth)/sign-in.tsx
rm app/(auth)/sign-up.tsx
rm app/(auth)/forgot-password.tsx

# Auth layout (optional - keep the folder structure)
rm app/(auth)/_layout.tsx

# Auth hook
rm lib/hooks/useAuth.ts

# Supabase client
rm lib/supabase/client.ts
rm -rf lib/supabase/
```

**Note:** You can keep the `app/(auth)/` folder for future use, or delete it entirely.

---

## Step 3: Update Root Layout

**File:** `app/_layout.tsx`

Remove Supabase client initialization:

```tsx
import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after app is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="subscription" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
```

**Key Changes:**

- Removed Supabase imports
- Removed session listener
- Simplified layout structure

---

## Step 4: Update Root Entry Point

**File:** `app/index.tsx`

Simplify routing logic to skip authentication:

```tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { GlassLoadingSpinner } from '@/components/ui/glass';
import { useOnboarding } from '@/lib/hooks/useOnboarding';

/**
 * Root Entry Point - Anonymous Variant
 *
 * Routing logic (simplified):
 * 1. Check onboarding status
 * 2. If completed → Navigate to app
 * 3. If not completed → Show onboarding
 */
export default function Index() {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();

  useEffect(() => {
    if (isLoading) return;

    // Navigate based on onboarding status only
    if (hasCompletedOnboarding) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [hasCompletedOnboarding, isLoading]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <GlassLoadingSpinner />
    </View>
  );
}
```

**Key Changes:**

- Removed auth session checking
- Direct navigation to app after onboarding
- No sign-in redirect

---

## Step 5: Update Settings Screen

**File:** `app/(tabs)/settings.tsx`

Remove account-related settings:

```tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { GlassCard, GlassButton, GlassSwitch } from '@/components/ui/glass';
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

export default function SettingsScreen() {
  const { resetOnboarding } = useOnboarding();
  const { theme, setTheme } = useAppStore();

  const [notifications, setNotifications] = useState(true);

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
              Alert.alert('Success', 'Onboarding has been reset. Restart the app to see it again.');
            } catch (error) {
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
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const sections: SettingsSection[] = [
    {
      title: 'Subscription',
      items: [
        {
          label: 'Manage Subscription',
          type: 'button',
          subtitle: 'View and manage your subscription',
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
      <View className="absolute inset-0 bg-black/60" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <Animated.View entering={FadeInDown.duration(400)} className="px-4 pt-4 pb-6">
          <Text className="text-4xl font-bold text-white mb-2">Settings</Text>
          <Text className="text-white/70">Manage your preferences</Text>
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

          <View className="items-center pb-8">
            <Text className="text-white/40 text-xs">Built with Expo SDK 54 • NativeWind v4</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
```

**Key Changes:**

- Removed Account section (email, profile)
- Removed sign-out button
- Removed useAuth hook
- Simplified to: Subscription, Notifications, Preferences, App, Support

---

## Step 6: Delete Profile & Notification Screens

These screens depend on user authentication:

```bash
rm app/profile.tsx
rm app/notifications.tsx
```

Update navigation references:

- Remove profile navigation from settings
- Remove notification navigation from tab bar (if applicable)

---

## Step 7: RevenueCat Configuration (Anonymous Mode)

**File:** `lib/hooks/useSubscription.ts`

RevenueCat works perfectly without user authentication by using **anonymous IDs**.

```tsx
import { useEffect, useState } from 'react';
import Purchases, { CustomerInfo, PurchasesOffering, LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
};

/**
 * Subscription Hook - Anonymous Variant
 *
 * RevenueCat works without authentication by using anonymous user IDs.
 * Each device gets a unique anonymous ID automatically.
 *
 * Features:
 * - Anonymous user tracking
 * - Subscription purchases
 * - Restore purchases
 * - Entitlement checking
 */
export function useSubscription() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      const apiKey = Platform.select({
        ios: REVENUECAT_API_KEY.ios,
        android: REVENUECAT_API_KEY.android,
      });

      if (!apiKey) {
        console.warn('RevenueCat API key not configured');
        setIsLoading(false);
        return;
      }

      // Initialize with anonymous user (no login required)
      Purchases.configure({ apiKey });

      // Get customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Get available offerings
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOfferings(offerings.all ? Object.values(offerings.all) : []);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize purchases:', error);
      setIsLoading(false);
    }
  };

  const purchasePackage = async (packageToPurchase: any) => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      setCustomerInfo(customerInfo);
      return customerInfo;
    } catch (error: any) {
      if (!error.userCancelled) {
        throw error;
      }
      return null;
    }
  };

  const restorePurchases = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return info;
    } catch (error) {
      throw error;
    }
  };

  const manageSubscription = async () => {
    try {
      await Purchases.showManageSubscriptions();
    } catch (error) {
      console.error('Failed to show manage subscriptions:', error);
      throw error;
    }
  };

  const refreshCustomerInfo = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('Failed to refresh customer info:', error);
      throw error;
    }
  };

  const getSubscriptionStatus = () => {
    if (!customerInfo) return null;

    const entitlements = customerInfo.entitlements.active;
    const activeEntitlement = Object.values(entitlements)[0];

    if (!activeEntitlement) return null;

    return {
      isActive: true,
      productId: activeEntitlement.productIdentifier,
      expirationDate: activeEntitlement.expirationDate,
      willRenew: activeEntitlement.willRenew,
    };
  };

  const isPro = customerInfo?.entitlements.active['pro'] != null;
  const hasActiveSubscription = Object.keys(customerInfo?.entitlements.active || {}).length > 0;

  return {
    customerInfo,
    offerings,
    isLoading,
    isPro,
    hasActiveSubscription,
    purchasePackage,
    restorePurchases,
    manageSubscription,
    refreshCustomerInfo,
    getSubscriptionStatus,
  };
}
```

**Key Features:**

- No user login required
- RevenueCat automatically generates anonymous IDs
- Purchases are tied to device
- Restore purchases works across reinstalls

**Official Docs:**

- [RevenueCat Anonymous IDs](https://www.revenuecat.com/docs/user-ids#anonymous-user-ids)
- [Purchases SDK Configuration](https://www.revenuecat.com/docs/configuring-sdk)

---

## Step 8: Update Tab Bar (Optional)

**File:** `app/(tabs)/_layout.tsx`

Remove profile/notifications tabs if you had them:

```tsx
import { Tabs } from 'expo-router';
import { colors } from '@/lib/utils/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
        }}
      />
    </Tabs>
  );
}
```

---

## Step 9: Update package.json Scripts

No changes needed - all scripts remain the same:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  }
}
```

---

## Step 10: Test Your Anonymous App

### 10.1 Start Development Server

```bash
npm start
```

### 10.2 Test Flow

1. ✅ **Onboarding**: First launch shows onboarding
2. ✅ **Direct Access**: After onboarding, go straight to app (no login)
3. ✅ **Settings**: Verify all settings work (notifications, dark mode, etc.)
4. ✅ **Subscriptions**: Open subscription screen
5. ✅ **Purchase Test**: Test RevenueCat purchase flow
6. ✅ **Restore Test**: Test restore purchases

### 10.3 Test Anonymous Features

```bash
# Verify RevenueCat anonymous ID
# In your app, log the anonymous user ID:
const anonymousId = await Purchases.getAppUserID();
console.log('Anonymous ID:', anonymousId);
```

---

## FAQ

### Q: Can users restore purchases on a new device?

**A:** Yes! RevenueCat's restore purchases works even with anonymous IDs. When users restore on a new device, their purchases will be available.

### Q: What happens if users reinstall the app?

**A:** They'll get a new anonymous ID, but can restore their purchases. Consider using device identifiers if you want to preserve the same anonymous ID (advanced).

### Q: Can I add user accounts later?

**A:** Yes! You can upgrade to the Full Stack variant by:

1. Installing Supabase packages
2. Adding auth screens back
3. Linking RevenueCat to user IDs

### Q: Do I still need RevenueCat API keys?

**A:** Yes! Configure your `.env`:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key
```

### Q: How do I handle user data without accounts?

**A:** Use AsyncStorage for local data storage:

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
await AsyncStorage.setItem('user_preferences', JSON.stringify(data));

// Load data
const data = await AsyncStorage.getItem('user_preferences');
```

---

## What You've Built

✅ **Anonymous App** with zero authentication
✅ **RevenueCat Subscriptions** working perfectly
✅ **All Glass Components** ready to use
✅ **Onboarding Flow** for new users
✅ **Settings Management** without accounts
✅ **Production Ready** - ship to App Store/Play Store

---

## Next Steps

1. **Configure RevenueCat Dashboard**
   - Create products/subscriptions
   - Set up entitlements
   - Test purchases in sandbox

2. **Customize Onboarding**
   - Update slides in `app/onboarding.tsx`
   - Add your app's value proposition

3. **Build Your Features**
   - Add your core app screens
   - Use glass components for UI
   - Store data locally with AsyncStorage

4. **Test & Deploy**
   - Test subscription flows
   - Submit to app stores

---

## Resources

- 📖 [RevenueCat Anonymous Users](https://www.revenuecat.com/docs/user-ids#anonymous-user-ids)
- 📖 [RevenueCat Purchases SDK](https://www.revenuecat.com/docs/getting-started/installation/reactnative)
- 📖 [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- 📖 [Expo Router Docs](https://docs.expo.dev/router/introduction/)

---

**Questions or Issues?**

- 📖 [Main Documentation](../../README.md)
- 🔄 [Switch to Full Stack Variant](../VARIANTS.md)
- 🔒 [Switch to Local Auth Variant](./LOCAL_AUTH.md)
