import { useEffect, useState } from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '';

export function useSubscription() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;

      if (!apiKey) {
        console.warn('RevenueCat API key not configured');
        setIsLoading(false);
        return;
      }

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

  const isPro = customerInfo?.entitlements.active['pro'] !== undefined;

  return {
    offerings,
    customerInfo,
    isLoading,
    isPro,
    purchasePackage,
    restorePurchases,
  };
}
