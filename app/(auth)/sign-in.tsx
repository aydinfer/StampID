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

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Please check your credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-4xl font-bold text-ink mb-2">
              Welcome back
            </Text>
            <Text className="text-lg text-ink-light">
              Sign in to continue to StampID
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email Input */}
            <View className="mb-4">
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
              {errors.email && (
                <Text className="text-error text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-ink mb-2">Password</Text>
              <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
                <TextInput
                  className="bg-white/70 border border-white/30 rounded-xl px-4 py-4 text-ink text-base"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </BlurView>
              {errors.password && (
                <Text className="text-error text-sm mt-1">{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable className="self-end mb-6">
                <Text className="text-forest-900 font-medium">Forgot password?</Text>
              </Pressable>
            </Link>

            {/* Sign In Button */}
            <Pressable
              onPress={handleSignIn}
              disabled={loading}
              className={`bg-forest-900 rounded-xl py-4 items-center ${loading ? 'opacity-70' : 'active:opacity-90 active:scale-[0.98]'}`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Sign In</Text>
              )}
            </Pressable>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-ink-light">Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text className="text-forest-900 font-semibold">Sign Up</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
