import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard, GlassButton, GlassInput, GlassAvatar } from '@/components/ui/glass';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateName, validatePhone } from '@/lib/utils/validation';

/**
 * Profile Screen - View and edit user profile
 *
 * Features:
 * - View mode: Display user information
 * - Edit mode: Update profile details
 * - Avatar display
 * - Form validation
 * - Supabase profile updates
 */
export default function ProfileScreen() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [displayName, setDisplayName] = useState(user?.user_metadata?.displayName || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [bio, setBio] = useState(user?.user_metadata?.bio || '');

  // Error state
  const [displayNameError, setDisplayNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form to original values
    setDisplayName(user?.user_metadata?.displayName || '');
    setPhone(user?.user_metadata?.phone || '');
    setBio(user?.user_metadata?.bio || '');
    setDisplayNameError('');
    setPhoneError('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Reset errors
    setDisplayNameError('');
    setPhoneError('');

    // Validate
    if (displayName.trim()) {
      const nameValidation = validateName(displayName, 'Display name');
      if (!nameValidation.isValid) {
        setDisplayNameError(nameValidation.error || '');
        return;
      }
    }

    if (phone.trim()) {
      const phoneValidation = validatePhone(phone);
      if (!phoneValidation.isValid) {
        setPhoneError(phoneValidation.error || '');
        return;
      }
    }

    // Save to Supabase
    setIsSaving(true);
    try {
      await updateProfile({
        data: {
          displayName: displayName.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
        },
      });

      Alert.alert('Success', 'Your profile has been updated');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar
  const getInitials = (): string => {
    if (displayName) {
      const names = displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/60" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="px-4 pt-4 pb-6"
        >
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary-400 text-base font-medium mb-4">← Back</Text>
          </Pressable>
          <Text className="text-4xl font-bold text-white mb-2">Profile</Text>
          <Text className="text-white/70">
            {isEditing ? 'Edit your profile' : 'View your profile'}
          </Text>
        </Animated.View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Card */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            <GlassCard variant="premium" intensity={80} className="p-6 mb-4 items-center">
              <GlassAvatar
                size="xl"
                initials={getInitials()}
                // imageUrl={user?.user_metadata?.avatarUrl} // Uncomment when image upload is implemented
              />

              <Text className="text-white text-2xl font-bold mt-4">
                {displayName || 'No name set'}
              </Text>

              <Text className="text-white/70 text-sm mt-1">
                {user?.email}
              </Text>

              {!isEditing && (
                <GlassButton
                  title="Edit Profile"
                  variant="secondary"
                  size="md"
                  onPress={handleEdit}
                  className="mt-4"
                />
              )}
            </GlassCard>
          </Animated.View>

          {/* Profile Information Card */}
          <Animated.View entering={FadeInDown.delay(300).duration(600)}>
            <GlassCard variant="default" intensity={60} className="p-6 mb-4">
              <Text className="text-white text-lg font-bold mb-4">
                {isEditing ? 'Edit Information' : 'Information'}
              </Text>

              {/* Display Name */}
              {isEditing ? (
                <GlassInput
                  label="Display Name"
                  placeholder="Enter your name"
                  value={displayName}
                  onChangeText={(text: string) => {
                    setDisplayName(text);
                    setDisplayNameError('');
                  }}
                  error={displayNameError}
                  editable={!isSaving}
                  className="mb-4"
                />
              ) : (
                <View className="mb-4 pb-4 border-b border-white/10">
                  <Text className="text-white/70 text-sm mb-1">Display Name</Text>
                  <Text className="text-white font-medium">
                    {displayName || 'Not set'}
                  </Text>
                </View>
              )}

              {/* Phone */}
              {isEditing ? (
                <GlassInput
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChangeText={(text: string) => {
                    setPhone(text);
                    setPhoneError('');
                  }}
                  error={phoneError}
                  keyboardType="phone-pad"
                  editable={!isSaving}
                  className="mb-4"
                />
              ) : (
                <View className="mb-4 pb-4 border-b border-white/10">
                  <Text className="text-white/70 text-sm mb-1">Phone</Text>
                  <Text className="text-white font-medium">
                    {phone || 'Not set'}
                  </Text>
                </View>
              )}

              {/* Bio */}
              {isEditing ? (
                <GlassInput
                  label="Bio"
                  placeholder="Tell us about yourself"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  editable={!isSaving}
                  className="mb-4"
                />
              ) : (
                <View className="mb-4">
                  <Text className="text-white/70 text-sm mb-1">Bio</Text>
                  <Text className="text-white font-medium">
                    {bio || 'Not set'}
                  </Text>
                </View>
              )}

              {/* Edit Actions */}
              {isEditing && (
                <View className="flex-row gap-3">
                  <GlassButton
                    title="Cancel"
                    variant="secondary"
                    size="md"
                    onPress={handleCancel}
                    disabled={isSaving}
                    className="flex-1"
                  />
                  <GlassButton
                    title="Save"
                    variant="primary"
                    size="md"
                    onPress={handleSave}
                    loading={isSaving}
                    disabled={isSaving}
                    className="flex-1"
                  />
                </View>
              )}
            </GlassCard>
          </Animated.View>

          {/* Account Info Card */}
          {!isEditing && (
            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <GlassCard variant="subtle" intensity={40} className="p-6 mb-8">
                <Text className="text-white text-lg font-bold mb-4">Account</Text>

                <View className="mb-3 pb-3 border-b border-white/10">
                  <Text className="text-white/70 text-sm mb-1">Email</Text>
                  <Text className="text-white font-medium">{user?.email}</Text>
                </View>

                <View className="mb-3 pb-3 border-b border-white/10">
                  <Text className="text-white/70 text-sm mb-1">User ID</Text>
                  <Text className="text-white font-medium text-xs">
                    {user?.id}
                  </Text>
                </View>

                <View>
                  <Text className="text-white/70 text-sm mb-1">Account Created</Text>
                  <Text className="text-white font-medium">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : 'Unknown'}
                  </Text>
                </View>
              </GlassCard>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
