import { useEffect, useState } from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform, Linking } from 'react-native';

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '';

/**
 * Subscription Hook
 *
 * Complete RevenueCat integration for in-app purchases:
 * - Subscription management
 * - Purchase and restore functionality
 * - Entitlement checking
 * - Subscription status tracking
 */
export function useSubscription() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePurchases();
  }, []);

  /**
   * Initialize RevenueCat SDK
   */
  const initializePurchases = async () => {
    try {
      const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;

      if (!apiKey) {
        console.warn('RevenueCat API key not configured');
        setIsLoading(false);
        return;
      }

      // Configure RevenueCat with debug logging in development
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      Purchases.configure({ apiKey });

      // Get initial customer info
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Get available offerings
      const offerings = await Purchases.getOfferings();
      setOfferings(offerings);

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing purchases:', error);
      setIsLoading(false);
    }
  };

  /**
   * Purchase a subscription package
   */
  const purchasePackage = async (pkg: PurchasesPackage) => {
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
  };

  /**
   * Restore previous purchases
   */
  const restorePurchases = async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  };

  /**
   * Refresh customer info manually
   */
  const refreshCustomerInfo = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('Error refreshing customer info:', error);
      throw error;
    }
  };

  /**
   * Open subscription management (iOS/Android settings)
   */
  const manageSubscription = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else {
        await Linking.openURL('https://play.google.com/store/account/subscriptions');
      }
    } catch (error) {
      console.error('Error opening subscription management:', error);
      throw error;
    }
  };

  /**
   * Get subscription status details
   */
  const getSubscriptionStatus = () => {
    if (!customerInfo) return null;

    const activeEntitlements = customerInfo.entitlements.active;
    const activeSubscriptions = Object.values(activeEntitlements);

    if (activeSubscriptions.length === 0) {
      return {
        isActive: false,
        productId: null,
        expirationDate: null,
        willRenew: false,
      };
    }

    const subscription = activeSubscriptions[0];

    return {
      isActive: true,
      productId: subscription.productIdentifier,
      expirationDate: subscription.expirationDate,
      willRenew: subscription.willRenew,
      periodType: subscription.periodType,
      store: subscription.store,
    };
  };

  // Check if user has 'pro' entitlement
  const isPro = customerInfo?.entitlements.active['pro'] !== undefined;

  // Check if any active subscription exists
  const hasActiveSubscription =
    customerInfo !== null && Object.keys(customerInfo.entitlements.active).length > 0;

  return {
    offerings,
    customerInfo,
    isLoading,
    isPro,
    hasActiveSubscription,
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
    manageSubscription,
    getSubscriptionStatus,
  };
}
