import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '';

// Free tier limits
const FREE_SCANS_LIMIT = 3;
const SCANS_COUNT_KEY = '@stampid_free_scans_count';
const SCANS_RESET_DATE_KEY = '@stampid_free_scans_reset';

interface SubscriptionContextType {
  // Subscription state
  isPro: boolean;
  isLoading: boolean;
  offerings: PurchasesOfferings | null;
  customerInfo: CustomerInfo | null;

  // Free tier tracking
  freeScansRemaining: number;
  canScan: boolean;

  // Actions
  presentPaywall: () => Promise<boolean>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<CustomerInfo | null>;
  restorePurchases: () => Promise<CustomerInfo | null>;
  recordScan: () => Promise<boolean>;
  refreshCustomerInfo: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [freeScansUsed, setFreeScansUsed] = useState(0);

  const isPro = customerInfo?.entitlements.active['pro'] !== undefined;
  const freeScansRemaining = Math.max(0, FREE_SCANS_LIMIT - freeScansUsed);
  const canScan = isPro || freeScansRemaining > 0;

  // Initialize RevenueCat and load free scan count
  useEffect(() => {
    initializePurchases();
    loadFreeScansCount();
  }, []);

  const initializePurchases = async () => {
    try {
      const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;

      if (!apiKey) {
        console.warn('RevenueCat API key not configured - running in demo mode');
        setIsLoading(false);
        return;
      }

      Purchases.configure({ apiKey });

      // Get initial customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Get available offerings
      const offs = await Purchases.getOfferings();
      setOfferings(offs);

      // Listen for customer info updates
      Purchases.addCustomerInfoUpdateListener((info) => {
        setCustomerInfo(info);
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing purchases:', error);
      setIsLoading(false);
    }
  };

  const loadFreeScansCount = async () => {
    try {
      const resetDate = await AsyncStorage.getItem(SCANS_RESET_DATE_KEY);
      const today = new Date().toDateString();

      // Reset count daily
      if (resetDate !== today) {
        await AsyncStorage.setItem(SCANS_RESET_DATE_KEY, today);
        await AsyncStorage.setItem(SCANS_COUNT_KEY, '0');
        setFreeScansUsed(0);
        return;
      }

      const count = await AsyncStorage.getItem(SCANS_COUNT_KEY);
      setFreeScansUsed(count ? parseInt(count, 10) : 0);
    } catch (error) {
      console.error('Error loading free scans count:', error);
    }
  };

  // Present RevenueCat's native paywall (built in their dashboard)
  const presentPaywall = useCallback(async (): Promise<boolean> => {
    try {
      const result = await RevenueCatUI.presentPaywall();

      // Refresh customer info after paywall closes
      await refreshCustomerInfo();

      // Return true if user purchased
      return result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED;
    } catch (error) {
      console.error('Error presenting paywall:', error);
      return false;
    }
  }, []);

  const recordScan = useCallback(async (): Promise<boolean> => {
    // Pro users have unlimited scans
    if (isPro) return true;

    // Check if free scans available
    if (freeScansUsed >= FREE_SCANS_LIMIT) {
      return false;
    }

    try {
      const newCount = freeScansUsed + 1;
      await AsyncStorage.setItem(SCANS_COUNT_KEY, newCount.toString());
      setFreeScansUsed(newCount);
      return true;
    } catch (error) {
      console.error('Error recording scan:', error);
      return false;
    }
  }, [isPro, freeScansUsed]);

  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<CustomerInfo | null> => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(customerInfo);
      return customerInfo;
    } catch (error: any) {
      if (!error.userCancelled) {
        throw error;
      }
      return null;
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<CustomerInfo | null> => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }, []);

  const refreshCustomerInfo = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.error('Error refreshing customer info:', error);
    }
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        isLoading,
        offerings,
        customerInfo,
        freeScansRemaining,
        canScan,
        presentPaywall,
        purchasePackage,
        restorePurchases,
        recordScan,
        refreshCustomerInfo,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}

// Export constants for use elsewhere
export { FREE_SCANS_LIMIT };
