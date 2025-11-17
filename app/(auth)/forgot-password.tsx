import React, { useState } from 'react';
import { View, Text, ImageBackground, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  GlassCard,
  GlassButton,
  GlassInput,
} from '@/components/ui/glass';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateEmail } from '@/lib/utils/validation';

/**
 * Forgot Password Screen - Password reset flow
 *
 * Features:
 * - Email validation
 * - Supabase password reset integration
 * - Success feedback
 * - Error handling
 */
export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    // Reset error
    setEmailError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    // Attempt password reset
    setIsLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to send reset email';
      Alert.alert('Reset Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Dark overlay */}
        <View className="absolute inset-0 bg-black/50" />

        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
          <View className="flex-1 justify-center px-4">
            <GlassCard variant="premium" intensity={80} className="p-8">
              {/* Success Icon */}
              <View className="items-center mb-6">
                <View className="w-20 h-20 bg-success-500 rounded-full items-center justify-center mb-4">
                  <Text className="text-white text-4xl">✓</Text>
                </View>
                <Text className="text-3xl font-bold text-white mb-2 text-center">
                  Check Your Email
                </Text>
                <Text className="text-white/70 text-center">
                  We've sent a password reset link to
                </Text>
                <Text className="text-white font-semibold text-center mt-2">
                  {email}
                </Text>
              </View>

              {/* Instructions */}
              <View className="bg-white/5 rounded-xl p-4 mb-6">
                <Text className="text-white/90 text-sm mb-3">
                  What to do next:
                </Text>
                <Text className="text-white/70 text-sm mb-2">
                  1. Check your email inbox (and spam folder)
                </Text>
                <Text className="text-white/70 text-sm mb-2">
                  2. Click the reset link in the email
                </Text>
                <Text className="text-white/70 text-sm">
                  3. Create your new password
                </Text>
              </View>

              {/* Back to Sign In Button */}
              <GlassButton
                title="Back to Sign In"
                variant="primary"
                size="lg"
                onPress={handleBackToSignIn}
                className="mb-4"
              />

              {/* Resend Email */}
              <Pressable
                onPress={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
              >
                <Text className="text-center text-white/70 text-sm">
                  Didn't receive the email?{' '}
                  <Text className="text-primary-400 font-semibold">Try again</Text>
                </Text>
              </Pressable>
            </GlassCard>
          </View>
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
      <View className="absolute inset-0 bg-black/50" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-4"
        >
          <GlassCard variant="premium" intensity={80} className="p-8">
            {/* Icon / Title */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-warning-500 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-3xl">🔒</Text>
              </View>
              <Text className="text-3xl font-bold text-white mb-2 text-center">
                Reset Password
              </Text>
              <Text className="text-white/70 text-center">
                Enter your email address and we'll send you a link to reset your password
              </Text>
            </View>

            {/* Email Input */}
            <GlassInput
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
              className="mb-6"
            />

            {/* Send Reset Link Button */}
            <GlassButton
              title="Send Reset Link"
              variant="primary"
              size="lg"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={isLoading}
              className="mb-4"
            />

            {/* Back to Sign In Link */}
            <Pressable onPress={handleBackToSignIn} disabled={isLoading}>
              <View className="flex-row items-center justify-center">
                <Text className="text-white/70 text-sm">Remember your password? </Text>
                <Text className="text-primary-400 text-sm font-semibold">Sign In</Text>
              </View>
            </Pressable>
          </GlassCard>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
