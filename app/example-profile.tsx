import React, { useState } from 'react';
import { View, Text, ImageBackground, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  GlassCard,
  GlassButton,
  GlassModal,
  GlassInput,
  GlassSegmentedControl,
} from '@/components/ui/glass';

/**
 * Example Profile Screen - Demonstrates glassmorphic profile UI
 *
 * Features:
 * - Profile header with stats
 * - Segmented control for tabs
 * - Edit profile modal
 * - Achievement cards
 */
export default function ExampleProfileScreen() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState('Mobile developer & UI/UX enthusiast');

  const stats = [
    { label: 'Posts', value: '342' },
    { label: 'Followers', value: '1.2K' },
    { label: 'Following', value: '543' },
  ];

  const achievements = [
    { icon: '🏆', title: 'Top Contributor', description: 'Made 100+ contributions' },
    { icon: '🔥', title: '30 Day Streak', description: 'Active for 30 days straight' },
    { icon: '⭐', title: 'Early Adopter', description: 'Joined in the first month' },
  ];

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' }}
      className="flex-1"
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View className="absolute inset-0 bg-black/50" />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 gap-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <Pressable onPress={() => router.back()}>
              <Text className="text-white text-3xl">←</Text>
            </Pressable>
            <Text className="text-white text-lg font-semibold">Profile</Text>
            <Pressable onPress={() => router.push('/example-settings')}>
              <Text className="text-white text-2xl">⚙️</Text>
            </Pressable>
          </View>

          {/* Profile Card */}
          <GlassCard variant="premium" intensity={80} className="p-6">
            {/* Avatar & Info */}
            <View className="items-center mb-6">
              <View className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full items-center justify-center mb-4 border-4 border-white/20">
                <Text className="text-white text-4xl font-bold">{name.charAt(0)}</Text>
              </View>

              <Text className="text-white text-2xl font-bold mb-1">{name}</Text>
              <Text className="text-white/70 text-center px-4">{bio}</Text>
            </View>

            {/* Stats */}
            <View className="flex-row items-center justify-around mb-6">
              {stats.map((stat, index) => (
                <View key={stat.label} className="items-center">
                  <Text className="text-white text-2xl font-bold">{stat.value}</Text>
                  <Text className="text-white/60 text-sm">{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View className="flex-row gap-3">
              <GlassButton
                title="Edit Profile"
                variant="primary"
                onPress={() => setEditModalVisible(true)}
                className="flex-1"
              />
              <GlassButton
                title="Share"
                variant="secondary"
                onPress={() => console.log('Share')}
                className="flex-1"
              />
            </View>
          </GlassCard>

          {/* Tab Selector */}
          <GlassSegmentedControl
            options={['Posts', 'Achievements', 'Activity']}
            selectedIndex={selectedTab}
            onIndexChange={setSelectedTab}
          />

          {/* Tab Content */}
          {selectedTab === 0 && (
            <View className="gap-4">
              <Text className="text-white text-xl font-bold px-2">Recent Posts</Text>
              {[1, 2, 3].map((i) => (
                <GlassCard key={i} className="p-4">
                  <Text className="text-white font-semibold mb-2">Post Title {i}</Text>
                  <Text className="text-white/70 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                  </Text>
                  <View className="flex-row items-center justify-between mt-4">
                    <Text className="text-white/50 text-xs">2 hours ago</Text>
                    <View className="flex-row gap-4">
                      <Text className="text-white/70 text-sm">❤️ 24</Text>
                      <Text className="text-white/70 text-sm">💬 8</Text>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          )}

          {selectedTab === 1 && (
            <View className="gap-4">
              <Text className="text-white text-xl font-bold px-2">Achievements</Text>
              {achievements.map((achievement, index) => (
                <GlassCard key={index} className="p-4">
                  <View className="flex-row items-center">
                    <Text className="text-5xl mr-4">{achievement.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg mb-1">{achievement.title}</Text>
                      <Text className="text-white/70 text-sm">{achievement.description}</Text>
                    </View>
                  </View>
                </GlassCard>
              ))}
            </View>
          )}

          {selectedTab === 2 && (
            <View className="gap-4">
              <Text className="text-white text-xl font-bold px-2">Recent Activity</Text>
              {[1, 2, 3, 4].map((i) => (
                <GlassCard key={i} className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-white font-semibold">Activity {i}</Text>
                      <Text className="text-white/60 text-sm mt-1">
                        {i === 1 && 'Liked a post'}
                        {i === 2 && 'Commented on a post'}
                        {i === 3 && 'Followed @user'}
                        {i === 4 && 'Shared a post'}
                      </Text>
                    </View>
                    <Text className="text-white/50 text-xs">{i}h ago</Text>
                  </View>
                </GlassCard>
              ))}
            </View>
          )}

          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>

      {/* Edit Profile Modal */}
      <GlassModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Edit Profile"
        intensity={80}
      >
        <View className="gap-4">
          <GlassInput label="Name" placeholder="Your name" value={name} onChangeText={setName} />

          <GlassInput
            label="Bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
          />

          <GlassButton
            title="Save Changes"
            variant="primary"
            onPress={() => {
              setEditModalVisible(false);
              console.log('Profile updated:', { name, bio });
            }}
          />

          <GlassButton title="Cancel" variant="ghost" onPress={() => setEditModalVisible(false)} />
        </View>
      </GlassModal>
    </ImageBackground>
  );
}
