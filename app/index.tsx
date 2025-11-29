import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/hooks/useAuth';
import { useOnboarding } from '@/lib/hooks/useOnboarding';

/**
 * Root Index - App Entry Point
 *
 * Handles initial routing logic:
 * 1. If onboarding not completed -> /onboarding
 * 2. If user is authenticated -> /(tabs)
 * 3. If user is not authenticated -> /(auth)/sign-in
 */
export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { hasCompletedOnboarding, loading: onboardingLoading } = useOnboarding();

  useEffect(() => {
    // Wait for both checks to complete
    if (authLoading || onboardingLoading) return;

    // Route based on state
    if (hasCompletedOnboarding === false) {
      // First time user - show onboarding
      router.replace('/onboarding');
    } else if (user) {
      // Authenticated user - go to main app
      router.replace('/(tabs)');
    } else {
      // Not authenticated - go to sign in
      router.replace('/(auth)/sign-in');
    }
  }, [user, authLoading, hasCompletedOnboarding, onboardingLoading]);

  // Show loading screen while checking auth and onboarding status
  return (
    <View className="flex-1 items-center justify-center bg-primary-950">
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
