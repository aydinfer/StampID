import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/lib/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-cream">
        <View className="flex-1 px-6 justify-center items-center">
          {/* Success Icon */}
          <View className="w-20 h-20 rounded-full bg-forest-100 items-center justify-center mb-6">
            <Text className="text-4xl">✉️</Text>
          </View>

          <Text className="text-2xl font-bold text-ink text-center mb-3">
            Check your email
          </Text>
          <Text className="text-ink-light text-center mb-8 px-4">
            We sent a password reset link to{'\n'}
            <Text className="font-medium text-ink">{email}</Text>
          </Text>

          <Pressable
            onPress={() => router.replace('/(auth)/sign-in')}
            className="bg-forest-900 rounded-xl py-4 px-8 active:opacity-90 active:scale-[0.98]"
          >
            <Text className="text-white font-semibold text-base">Back to Sign In</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setSent(false);
              setEmail('');
            }}
            className="mt-4 py-2"
          >
            <Text className="text-forest-900 font-medium">Try a different email</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 left-6 z-10 py-2"
          >
            <Text className="text-forest-900 font-medium">← Back</Text>
          </Pressable>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-ink mb-2">
              Reset password
            </Text>
            <Text className="text-lg text-ink-light">
              Enter your email and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Form */}
          <View>
            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-ink mb-2">Email</Text>
              <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
                <TextInput
                  className="bg-white/70 border border-white/30 rounded-xl px-4 py-4 text-ink text-base"
                  placeholder="you@example.com"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </BlurView>
              {error && (
                <Text className="text-error text-sm mt-1">{error}</Text>
              )}
            </View>

            {/* Reset Button */}
            <Pressable
              onPress={handleResetPassword}
              disabled={loading}
              className={`bg-forest-900 rounded-xl py-4 items-center ${loading ? 'opacity-70' : 'active:opacity-90 active:scale-[0.98]'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Send Reset Link</Text>
              )}
            </Pressable>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-ink-light">Remember your password? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <Text className="text-forest-900 font-semibold">Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
