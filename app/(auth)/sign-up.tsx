import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, KeyboardAvoidingView, Platform, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassSwitch,
} from '@/components/ui/glass';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateEmail, validatePassword, validatePasswordMatch } from '@/lib/utils/validation';

/**
 * Sign Up Screen - Production-ready user registration
 *
 * Features:
 * - Supabase authentication integration
 * - Real-time form validation
 * - Password strength indicator
 * - Terms acceptance
 * - Social signup buttons (Apple, Google)
 * - Error handling with user feedback
 */
export default function SignUpScreen() {
  const { signUp, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Real-time validation for email
  useEffect(() => {
    if (email.length > 0) {
      const validation = validateEmail(email);
      if (!validation.isValid && email.length > 3) {
        setEmailError(validation.error || '');
      } else {
        setEmailError('');
      }
    }
  }, [email]);

  // Real-time validation for password
  useEffect(() => {
    if (password.length > 0) {
      const validation = validatePassword(password);
      if (!validation.isValid && password.length > 3) {
        setPasswordError(validation.error || '');
      } else {
        setPasswordError('');
      }
    }
  }, [password]);

  // Real-time validation for confirm password
  useEffect(() => {
    if (confirmPassword.length > 0) {
      const validation = validatePasswordMatch(password, confirmPassword);
      if (!validation.isValid && confirmPassword.length >= password.length) {
        setConfirmPasswordError(validation.error || '');
      } else {
        setConfirmPasswordError('');
      }
    }
  }, [password, confirmPassword]);

  const handleSignUp = async () => {
    // Final validation before submission
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      return;
    }

    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      setConfirmPasswordError(passwordMatchValidation.error || '');
      return;
    }

    if (!acceptTerms) {
      Alert.alert('Terms Required', 'Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    // Attempt sign up
    setIsLoading(true);
    try {
      await signUp(email, password);
      Alert.alert(
        'Check Your Email',
        'We sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/sign-in'),
          },
        ]
      );
    } catch (error: any) {
      // Handle specific Supabase errors
      const errorMessage = error?.message || 'Failed to create account';

      if (errorMessage.includes('already registered')) {
        Alert.alert('Account Exists', 'This email is already registered. Please sign in instead.');
      } else if (errorMessage.includes('Password should be')) {
        setPasswordError(errorMessage);
      } else {
        Alert.alert('Sign Up Failed', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  const handleSocialSignUp = (provider: 'google' | 'apple') => {
    // TODO: Implement social signup with Supabase
    Alert.alert(
      'Social Sign Up',
      `${provider === 'google' ? 'Google' : 'Apple'} sign-up will be implemented with your Supabase configuration.`,
      [{ text: 'OK' }]
    );
  };

  const loading = isLoading || authLoading;

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
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <GlassCard variant="premium" intensity={80} className="p-8">
              {/* Logo / Title */}
              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-4">
                  <Text className="text-white text-3xl font-bold">A</Text>
                </View>
                <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
                <Text className="text-white/70 text-center">
                  Sign up to get started
                </Text>
              </View>

              {/* Email Input */}
              <GlassInput
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
                className="mb-4"
              />

              {/* Password Input */}
              <GlassInput
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!loading}
                className="mb-4"
              />

              {/* Password Requirements */}
              {password.length > 0 && (
                <View className="mb-4 px-1">
                  <Text className="text-white/60 text-xs mb-2">Password must contain:</Text>
                  <Text className={`text-xs ${/[A-Z]/.test(password) ? 'text-success-400' : 'text-white/50'}`}>
                    • At least one uppercase letter
                  </Text>
                  <Text className={`text-xs ${/[a-z]/.test(password) ? 'text-success-400' : 'text-white/50'}`}>
                    • At least one lowercase letter
                  </Text>
                  <Text className={`text-xs ${/\d/.test(password) ? 'text-success-400' : 'text-white/50'}`}>
                    • At least one number
                  </Text>
                  <Text className={`text-xs ${password.length >= 8 ? 'text-success-400' : 'text-white/50'}`}>
                    • Minimum 8 characters
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <GlassInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmPasswordError}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!loading}
                className="mb-6"
              />

              {/* Terms Acceptance */}
              <View className="mb-6">
                <GlassSwitch
                  value={acceptTerms}
                  onValueChange={setAcceptTerms}
                  label=""
                  disabled={loading}
                />
                <View className="ml-12 -mt-6">
                  <Text className="text-white/70 text-sm">
                    I accept the{' '}
                    <Text className="text-primary-400">Terms of Service</Text>
                    {' '}and{' '}
                    <Text className="text-primary-400">Privacy Policy</Text>
                  </Text>
                </View>
              </View>

              {/* Sign Up Button */}
              <GlassButton
                title="Create Account"
                variant="primary"
                size="lg"
                onPress={handleSignUp}
                loading={loading}
                disabled={loading}
                className="mb-4"
              />

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-white/20" />
                <Text className="text-white/50 px-4 text-sm">Or sign up with</Text>
                <View className="flex-1 h-px bg-white/20" />
              </View>

              {/* Social Sign Up */}
              <View className="flex-row gap-3 mb-6">
                <GlassButton
                  title="Google"
                  variant="secondary"
                  size="md"
                  onPress={() => handleSocialSignUp('google')}
                  disabled={loading}
                  className="flex-1"
                />
                <GlassButton
                  title="Apple"
                  variant="secondary"
                  size="md"
                  onPress={() => handleSocialSignUp('apple')}
                  disabled={loading}
                  className="flex-1"
                />
              </View>

              {/* Sign In Link */}
              <Pressable onPress={handleSignIn} disabled={loading}>
                <View className="flex-row items-center justify-center">
                  <Text className="text-white/70 text-sm">Already have an account? </Text>
                  <Text className="text-primary-400 text-sm font-semibold">Sign In</Text>
                </View>
              </Pressable>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
