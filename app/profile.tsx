import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  ChevronLeft,
  User,
  Mail,
  Crown,
  Calendar,
  Edit3,
  LogOut,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSubscriptionContext, FREE_SCANS_LIMIT } from '@/lib/providers/SubscriptionProvider';
import { useProfile } from '@/lib/hooks/useProfile';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { isPro, presentPaywall, freeScansRemaining } = useSubscriptionContext();
  const { data: profile, isLoading } = useProfile();

  const tier = isPro ? 'pro' : 'free';
  const isPremium = isPro;
  const scansRemaining = freeScansRemaining;
  const scanLimit = FREE_SCANS_LIMIT;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Contact Support', 'Please contact support@stampid.app to delete your account.');
          },
        },
      ]
    );
  };

  const handleUpgrade = async () => {
    await presentPaywall();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-forest-900/10">
        <Pressable onPress={() => router.back()} className="flex-row items-center py-2">
          <ChevronLeft size={24} color="#1B4332" />
          <Text className="text-forest-900 font-medium">Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-ink flex-1 text-center mr-12">
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Profile Card */}
        <Animated.View entering={FadeIn.duration(400)} className="px-4 pt-6">
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70 p-6 items-center">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full bg-forest-900/10 items-center justify-center mb-4">
                {profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <User size={40} color="#1B4332" strokeWidth={1.5} />
                )}
              </View>

              {/* Name & Email */}
              <Text className="text-xl font-bold text-ink mb-1">
                {profile?.display_name || 'Stamp Collector'}
              </Text>
              <Text className="text-ink-light">{user?.email}</Text>

              {/* Edit Button */}
              <Pressable className="mt-4 flex-row items-center">
                <Edit3 size={16} color="#1B4332" />
                <Text className="text-forest-900 font-medium ml-1">Edit Profile</Text>
              </Pressable>
            </View>
          </BlurView>
        </Animated.View>

        {/* Subscription Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-4 pt-4">
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className={`p-4 ${isPremium ? 'bg-forest-900/10' : 'bg-white/70'}`}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Crown
                    size={24}
                    color={isPremium ? '#1B4332' : '#6B6B6B'}
                    fill={isPremium ? '#1B4332' : 'transparent'}
                  />
                  <View className="ml-3">
                    <Text className="text-lg font-semibold text-ink capitalize">
                      {tier} Plan
                    </Text>
                    {!isPremium && (
                      <Text className="text-ink-light text-sm">
                        {scansRemaining}/{scanLimit} scans remaining
                      </Text>
                    )}
                  </View>
                </View>
                {!isPremium && (
                  <Pressable
                    onPress={handleUpgrade}
                    className="bg-forest-900 px-4 py-2 rounded-lg active:opacity-90"
                  >
                    <Text className="text-white font-medium">Upgrade</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Account Info */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="px-4 pt-6">
          <Text className="text-sm text-ink-light font-medium mb-2 px-2">
            ACCOUNT INFORMATION
          </Text>
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70">
              <ProfileRow
                icon={<Mail size={20} color="#1B4332" />}
                label="Email"
                value={user?.email || 'Not set'}
              />
              <View className="h-px bg-forest-900/10 mx-4" />
              <ProfileRow
                icon={<Calendar size={20} color="#1B4332" />}
                label="Member Since"
                value={formatDate(profile?.created_at)}
              />
            </View>
          </BlurView>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-4 pt-6">
          <Text className="text-sm text-ink-light font-medium mb-2 px-2">
            ACCOUNT ACTIONS
          </Text>
          <BlurView intensity={20} tint="light" className="rounded-2xl overflow-hidden">
            <View className="bg-white/70">
              <Pressable
                onPress={handleSignOut}
                className="flex-row items-center justify-between p-4 active:bg-forest-900/5"
              >
                <View className="flex-row items-center">
                  <LogOut size={20} color="#1B4332" />
                  <Text className="text-ink font-medium ml-3">Sign Out</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </Pressable>
              <View className="h-px bg-forest-900/10 mx-4" />
              <Pressable
                onPress={handleDeleteAccount}
                className="flex-row items-center justify-between p-4 active:bg-error/5"
              >
                <View className="flex-row items-center">
                  <Trash2 size={20} color="#EF4444" />
                  <Text className="text-error font-medium ml-3">Delete Account</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </Pressable>
            </View>
          </BlurView>
        </Animated.View>

        {/* App Version */}
        <View className="items-center mt-8">
          <Text className="text-ink-muted text-sm">StampID v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Profile row component
function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center justify-between p-4">
      <View className="flex-row items-center">
        {icon}
        <Text className="text-ink font-medium ml-3">{label}</Text>
      </View>
      <Text className="text-ink-light">{value}</Text>
    </View>
  );
}

// Format date helper
function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
