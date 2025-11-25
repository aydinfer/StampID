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
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useAuth } from '@/lib/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { signUp } = useAuth();

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!displayName || displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link. Please verify your email to continue.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/sign-in') }]
      );
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
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
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center py-10">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-4xl font-bold text-ink mb-2">
                Create account
              </Text>
              <Text className="text-lg text-ink-light">
                Start building your stamp collection
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Display Name Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-ink mb-2">Name</Text>
                <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
                  <TextInput
                    className="bg-white/70 border border-white/30 rounded-xl px-4 py-4 text-ink text-base"
                    placeholder="Your name"
                    placeholderTextColor="#9CA3AF"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoComplete="name"
                  />
                </BlurView>
                {errors.displayName && (
                  <Text className="text-error text-sm mt-1">{errors.displayName}</Text>
                )}
              </View>

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
                    placeholder="At least 6 characters"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="new-password"
                  />
                </BlurView>
                {errors.password && (
                  <Text className="text-error text-sm mt-1">{errors.password}</Text>
                )}
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-ink mb-2">Confirm Password</Text>
                <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
                  <TextInput
                    className="bg-white/70 border border-white/30 rounded-xl px-4 py-4 text-ink text-base"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoComplete="new-password"
                  />
                </BlurView>
                {errors.confirmPassword && (
                  <Text className="text-error text-sm mt-1">{errors.confirmPassword}</Text>
                )}
              </View>

              {/* Terms Notice */}
              <Text className="text-ink-light text-sm text-center mb-6">
                By signing up, you agree to our{' '}
                <Text className="text-forest-900 font-medium">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-forest-900 font-medium">Privacy Policy</Text>
              </Text>

              {/* Sign Up Button */}
              <Pressable
                onPress={handleSignUp}
                disabled={loading}
                className={`bg-forest-900 rounded-xl py-4 items-center ${loading ? 'opacity-70' : 'active:opacity-90 active:scale-[0.98]'}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-base">Create Account</Text>
                )}
              </Pressable>
            </View>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-ink-light">Already have an account? </Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="text-forest-900 font-semibold">Sign In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
