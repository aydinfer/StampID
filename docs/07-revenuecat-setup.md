# RevenueCat Setup

Complete guide to implementing in-app purchases and subscriptions with RevenueCat.

## What is RevenueCat?

RevenueCat is a subscription platform that handles:

- **In-app purchases**: iOS and Android
- **Subscription management**: Track active subscriptions
- **Analytics**: Revenue metrics and charts
- **Cross-platform**: Works on iOS, Android, and web

## Quick Setup

### 1. Create RevenueCat Account

1. Go to [revenuecat.com](https://www.revenuecat.com/)
2. Sign up for free account
3. Create a new project

### 2. Add Your Apps

**For iOS:**

1. Go to **Project Settings** > **Apps**
2. Click "Add App" > iOS
3. Enter your Bundle ID (from app.json)
4. Upload App Store Connect API Key (optional but recommended)

**For Android:**

1. Click "Add App" > Android
2. Enter your Package Name (from app.json)
3. Upload Google Play Service Account JSON

### 3. Create Products

1. Go to App Store Connect (iOS) or Google Play Console (Android)
2. Create your subscription products:
   - Monthly subscription
   - Yearly subscription
   - Lifetime purchase (optional)

**Example products:**

- `pro_monthly` - $9.99/month
- `pro_yearly` - $79.99/year (save 33%)

### 4. Create Entitlements

1. In RevenueCat Dashboard, go to **Entitlements**
2. Click "New Entitlement"
3. Name it "pro"
4. Attach your products to this entitlement

**Why entitlements?** They abstract products. You check "isPro", not "has monthly OR yearly".

### 5. Get API Keys

1. Go to **Project Settings** > **API Keys**
2. Copy public API keys:
   - iOS key
   - Android key
3. Add to `.env`:

```env
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your-ios-key-here
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=your-android-key-here
```

## Using Subscriptions

The starter includes a complete subscription hook at [lib/hooks/useSubscription.ts](../lib/hooks/useSubscription.ts).

### Check Subscription Status

```tsx
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function HomeScreen() {
  const { isPro, isLoading } = useSubscription();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Status: {isPro ? 'Pro User' : 'Free User'}</Text>
    </View>
  );
}
```

### Show Paywall

```tsx
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function PaywallScreen() {
  const { offerings, purchasePackage, isLoading } = useSubscription();

  if (isLoading || !offerings) {
    return <Text>Loading packages...</Text>;
  }

  const currentOffering = offerings.current;
  if (!currentOffering) {
    return <Text>No offers available</Text>;
  }

  return (
    <View>
      <Text className="text-2xl font-bold mb-4">Go Pro!</Text>

      {currentOffering.availablePackages.map((pkg) => (
        <Pressable
          key={pkg.identifier}
          className="bg-primary-500 p-4 rounded-lg mb-2"
          onPress={() => handlePurchase(pkg)}
        >
          <Text className="text-white font-bold">{pkg.product.title}</Text>
          <Text className="text-white">
            {pkg.product.priceString}/{pkg.product.subscriptionPeriod}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
```

### Handle Purchase

```tsx
const handlePurchase = async (pkg) => {
  try {
    const customerInfo = await purchasePackage(pkg);

    if (customerInfo?.entitlements.active['pro']) {
      alert('Welcome to Pro! 🎉');
      router.back();
    }
  } catch (error) {
    if (error.userCancelled) {
      // User canceled, do nothing
      return;
    }
    alert('Purchase failed: ' + error.message);
  }
};
```

### Restore Purchases

```tsx
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function SettingsScreen() {
  const { restorePurchases } = useSubscription();

  const handleRestore = async () => {
    try {
      const customerInfo = await restorePurchases();

      if (customerInfo?.entitlements.active['pro']) {
        alert('Subscription restored!');
      } else {
        alert('No previous purchases found');
      }
    } catch (error) {
      alert('Restore failed: ' + error.message);
    }
  };

  return (
    <Pressable onPress={handleRestore}>
      <Text>Restore Purchases</Text>
    </Pressable>
  );
}
```

## Product Setup Guide

### iOS - App Store Connect

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Select your app
3. Go to **Features** > **In-App Purchases**
4. Click "+" to create new subscription
5. Fill in:
   - Reference name: "Pro Monthly"
   - Product ID: `pro_monthly`
   - Subscription Group: Create "Pro Subscriptions"
   - Duration: 1 month
   - Price: $9.99

**Repeat for yearly:**

- Product ID: `pro_yearly`
- Duration: 1 year
- Price: $79.99

### Android - Google Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. Select your app
3. Go to **Monetize** > **Products** > **Subscriptions**
4. Click "Create subscription"
5. Fill in:
   - Product ID: `pro_monthly`
   - Name: "Pro Monthly"
   - Base plan: 1 month recurring
   - Price: $9.99

**Repeat for yearly** with `pro_yearly`

## Testing

### iOS Testing

1. Create sandbox tester in App Store Connect:
   - Go to **Users and Access** > **Sandbox Testers**
   - Add new sandbox account with unique email

2. Sign out of App Store on device

3. Run app and make purchase

4. When prompted, sign in with sandbox account

5. Purchases are free for sandbox testers!

### Android Testing

1. Add test account in Google Play Console:
   - Go to **Setup** > **License testing**
   - Add your Gmail account to "License testers"

2. Publish app to internal track

3. Download from Play Store

4. Make purchase - it will be free for testers

## Entitlements vs Products

**Products** = What users buy (`pro_monthly`, `pro_yearly`)

**Entitlements** = What users get (`pro` access)

### Why this matters:

```tsx
// ❌ Don't do this
if (hasPurchased('pro_monthly') || hasPurchased('pro_yearly')) {
  showProFeature();
}

// ✅ Do this
if (isPro) {
  showProFeature();
}
```

RevenueCat handles checking all products for you.

## Offerings & Packages

**Offerings** = Groups of packages you show to users

**Packages** = Pre-configured durations (monthly, annual, lifetime)

```tsx
const { offerings } = useSubscription();

// Default offering
const current = offerings?.current;

// Available packages
current?.availablePackages.map((pkg) => ({
  identifier: pkg.identifier, // 'monthly', 'annual'
  price: pkg.product.priceString, // '$9.99'
  period: pkg.product.subscriptionPeriod, // 'P1M', 'P1Y'
}));
```

## Analytics

RevenueCat Dashboard shows:

- **Active subscriptions**: How many paying users
- **MRR**: Monthly recurring revenue
- **Churn**: How many cancel
- **Trial conversions**: Free to paid
- **Revenue charts**: Track growth

## Webhooks

Get notified of subscription events:

1. Go to **Project Settings** > **Integrations**
2. Add webhook URL
3. Receive events:
   - Initial purchase
   - Renewal
   - Cancellation
   - Billing issue

## Customer Support

### Check User Status

In RevenueCat Dashboard:

1. Go to **Customers**
2. Search by email or App User ID
3. See all purchases and status
4. Can manually grant entitlements

### Handle Refunds

When Apple/Google issues refund:

- RevenueCat automatically revokes entitlement
- User loses pro access
- No code changes needed

## Common Issues

### "Products not found"

- Check product IDs match exactly (case-sensitive)
- Ensure products are approved in App Store Connect/Play Console
- Wait 24 hours after creating products
- Check bundle ID matches

### "Purchase failed"

- Enable "In-App Purchases" capability in Xcode
- Check billing is set up for sandbox account
- Ensure product is active and available

### "Already own this product"

- Use sandbox tester account to reset
- Or use `restorePurchases()` to acknowledge

## Best Practices

1. **Show value first**: Let users try before paywall
2. **Clear pricing**: Show price per month, even for annual
3. **Easy restore**: Add restore button in settings
4. **Handle errors gracefully**: Don't crash on purchase fail
5. **Test both platforms**: iOS and Android behave differently

## Example Paywall

```tsx
export default function PaywallScreen() {
  const { offerings, purchasePackage, isPro } = useSubscription();
  const [loading, setLoading] = useState(false);

  if (isPro) {
    return <Text>You're already Pro! 🎉</Text>;
  }

  const packages = offerings?.current?.availablePackages || [];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900 p-6">
      <Text className="text-3xl font-bold text-center mb-2">Unlock Pro Features</Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Get unlimited access to all features
      </Text>

      {packages.map((pkg) => {
        const isYearly = pkg.identifier === 'annual';

        return (
          <Pressable
            key={pkg.identifier}
            className={`p-6 rounded-2xl border-2 mb-4 ${
              isYearly
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-700'
            }`}
            onPress={() => handlePurchase(pkg)}
            disabled={loading}
          >
            {isYearly && (
              <View className="bg-primary-500 px-3 py-1 rounded-full self-start mb-2">
                <Text className="text-white text-xs font-bold">BEST VALUE</Text>
              </View>
            )}

            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {pkg.product.title}
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              {pkg.product.priceString}/{isYearly ? 'year' : 'month'}
            </Text>
          </Pressable>
        );
      })}

      <Text className="text-center text-gray-500 text-sm mt-4">Cancel anytime. Terms apply.</Text>
    </ScrollView>
  );
}
```

## Next Steps

- Read [State Management](./08-state-management.md) for managing subscription state
- Check [Best Practices](./14-best-practices.md) for monetization tips
