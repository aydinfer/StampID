import React, { useState } from 'react';
import { View, Text, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassSwitch,
} from '@/components/ui/glass';

/**
 * Example Login Screen - Demonstrates glassmorphic login form
 *
 * Features:
 * - Glassmorphic UI components
 * - Form validation
 * - Remember me toggle
 * - Social login buttons
 */
export default function ExampleLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    // Simulate login
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/(tabs)/home');
    }, 2000);
  };

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
            {/* Logo / Title */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-primary-500 rounded-2xl items-center justify-center mb-4">
                <Text className="text-white text-3xl font-bold">A</Text>
              </View>
              <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
              <Text className="text-white/70 text-center">
                Sign in to your account to continue
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
              className="mb-4"
            />

            {/* Password Input */}
            <GlassInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              className="mb-4"
            />

            {/* Remember Me & Forgot Password */}
            <View className="flex-row items-center justify-between mb-6">
              <GlassSwitch
                value={rememberMe}
                onValueChange={setRememberMe}
                label="Remember me"
              />

              <Text className="text-primary-400 text-sm font-medium">
                Forgot Password?
              </Text>
            </View>

            {/* Sign In Button */}
            <GlassButton
              title="Sign In"
              variant="primary"
              size="lg"
              onPress={handleLogin}
              loading={isLoading}
              className="mb-4"
            />

            {/* Divider */}
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-white/20" />
              <Text className="text-white/50 px-4 text-sm">Or continue with</Text>
              <View className="flex-1 h-px bg-white/20" />
            </View>

            {/* Social Login */}
            <View className="flex-row gap-3 mb-6">
              <GlassButton
                title="Google"
                variant="secondary"
                size="md"
                onPress={() => console.log('Google login')}
                className="flex-1"
              />
              <GlassButton
                title="Apple"
                variant="secondary"
                size="md"
                onPress={() => console.log('Apple login')}
                className="flex-1"
              />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-white/70 text-sm">Don't have an account? </Text>
              <Text className="text-primary-400 text-sm font-semibold">Sign Up</Text>
            </View>
          </GlassCard>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
