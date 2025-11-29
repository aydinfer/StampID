import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard, GlassBadge, GlassEmptyState } from '@/components/ui/glass';
import { formatRelativeTime } from '@/lib/utils/format';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

/**
 * Notifications Screen - User notifications list
 *
 * Features:
 * - Display notifications with type badges
 * - Mark as read functionality
 * - Empty state when no notifications
 * - Pull to refresh
 * - Time ago formatting
 */
export default function NotificationsScreen() {
  // Mock notifications data
  // In production, this would come from React Query/Supabase
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to the App!',
      message: 'Thanks for signing up. Explore all the features we have to offer.',
      type: 'success',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: '2',
      title: 'Profile Update',
      message: 'Your profile information has been successfully updated.',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      id: '3',
      title: 'Subscription Reminder',
      message: 'Your Pro subscription will renew in 7 days.',
      type: 'warning',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getBadgeVariant = (
    type: Notification['type']
  ): 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  const renderNotification = (notification: Notification, index: number) => (
    <Animated.View
      key={notification.id}
      entering={FadeInDown.delay(200 + index * 50).duration(600)}
    >
      <Pressable onPress={() => handleMarkAsRead(notification.id)}>
        <GlassCard
          variant={notification.read ? 'subtle' : 'default'}
          intensity={notification.read ? 40 : 60}
          className="p-4 mb-3"
        >
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1 mr-3">
              <Text
                className={`text-base font-bold ${
                  notification.read ? 'text-white/70' : 'text-white'
                }`}
              >
                {notification.title}
              </Text>
            </View>

            <GlassBadge
              content={notification.type}
              variant={getBadgeVariant(notification.type)}
              size="sm"
            />
          </View>

          <Text className={`text-sm mb-2 ${notification.read ? 'text-white/50' : 'text-white/70'}`}>
            {notification.message}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-white/40 text-xs">
              {formatRelativeTime(notification.createdAt)}
            </Text>

            {!notification.read && <View className="w-2 h-2 rounded-full bg-primary-500" />}
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );

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
        <Animated.View entering={FadeInDown.duration(400)} className="px-4 pt-4 pb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary-400 text-base font-medium mb-4">← Back</Text>
          </Pressable>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-4xl font-bold text-white">Notifications</Text>
            {unreadCount > 0 && <GlassBadge content={unreadCount} variant="error" size="md" />}
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-white/70">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'}
            </Text>

            {unreadCount > 0 && (
              <Pressable onPress={handleMarkAllAsRead}>
                <Text className="text-primary-400 text-sm font-medium">Mark all as read</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <GlassEmptyState
              icon="🔔"
              title="No Notifications"
              description="You're all caught up! Check back later for updates."
            />
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#3b82f6"
              />
            }
          >
            {notifications.map((notification, index) => renderNotification(notification, index))}

            <View className="h-8" />
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
