import React, { useState } from 'react';
import { View, Text, ImageBackground, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Moon, Globe, Bell, Mail, Smartphone, User, Lock, HelpCircle, Check, type LucideIcon } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassSwitch, GlassSheet } from '@/components/ui/glass';

type SettingItem =
  | {
      type: 'switch';
      label: string;
      value: boolean;
      onValueChange: (value: boolean) => void;
      icon: LucideIcon;
      disabled?: boolean;
    }
  | {
      type: 'action';
      label: string;
      value?: string;
      onPress: () => void;
      icon: LucideIcon;
      showArrow?: boolean;
    };

/**
 * Example Settings Screen - Demonstrates glassmorphic settings UI
 *
 * Features:
 * - Settings sections with switches
 * - Glassmorphic bottom sheet
 * - Account management
 * - Preferences
 */
export default function ExampleSettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [languageSheetVisible, setLanguageSheetVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Appearance',
      items: [
        {
          type: 'switch',
          label: 'Dark Mode',
          value: darkMode,
          onValueChange: setDarkMode,
          icon: Moon,
        },
        {
          type: 'action',
          label: 'Language',
          value: selectedLanguage,
          onPress: () => setLanguageSheetVisible(true),
          icon: Globe,
          showArrow: true,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          type: 'switch',
          label: 'Enable Notifications',
          value: notifications,
          onValueChange: setNotifications,
          icon: Bell,
        },
        {
          type: 'switch',
          label: 'Email Notifications',
          value: emailNotifications,
          onValueChange: setEmailNotifications,
          icon: Mail,
          disabled: !notifications,
        },
        {
          type: 'switch',
          label: 'Push Notifications',
          value: pushNotifications,
          onValueChange: setPushNotifications,
          icon: Smartphone,
          disabled: !notifications,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          type: 'action',
          label: 'Edit Profile',
          icon: User,
          showArrow: true,
          onPress: () => console.log('Edit profile'),
        },
        {
          type: 'action',
          label: 'Privacy & Security',
          icon: Lock,
          showArrow: true,
          onPress: () => console.log('Privacy'),
        },
        {
          type: 'action',
          label: 'Help & Support',
          icon: HelpCircle,
          showArrow: true,
          onPress: () => console.log('Help'),
        },
      ],
    },
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
          <View className="flex-row items-center mb-2">
            <Pressable onPress={() => router.back()} className="mr-4 p-2">
              <ChevronLeft size={28} color="#FFFFFF" />
            </Pressable>
            <Text className="text-white text-2xl font-bold">Settings</Text>
          </View>

          {/* Account Card */}
          <GlassCard variant="premium" intensity={80} className="p-6">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-primary-500 rounded-full items-center justify-center mr-4">
                <Text className="text-white text-2xl font-bold">J</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">John Doe</Text>
                <Text className="text-white/70">john.doe@example.com</Text>
              </View>
            </View>
          </GlassCard>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex}>
              <Text className="text-white text-lg font-bold px-2 mb-2">{section.title}</Text>

              <GlassCard className="overflow-hidden">
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <View key={itemIndex}>
                      {item.type === 'switch' ? (
                        // Switch item
                        <View className="px-6 py-4 flex-row items-center">
                          <View className="w-8 mr-3">
                            <IconComponent size={20} color="#FFFFFF" />
                          </View>
                          <GlassSwitch
                            value={item.value}
                            onValueChange={item.onValueChange}
                            label={item.label}
                            disabled={item.disabled}
                            className="flex-1"
                          />
                        </View>
                      ) : (
                        // Pressable item
                        <Pressable
                          onPress={item.onPress}
                          className="px-6 py-4 flex-row items-center active:bg-white/5"
                        >
                          <View className="w-8 mr-3">
                            <IconComponent size={20} color="#FFFFFF" />
                          </View>
                          <Text className="text-white text-base flex-1">{item.label}</Text>
                          {item.value && <Text className="text-white/60 mr-2">{item.value}</Text>}
                          {item.showArrow && <Text className="text-white/40 text-lg">›</Text>}
                        </Pressable>
                      )}

                      {/* Divider (except last item) */}
                      {itemIndex < section.items.length - 1 && (
                        <View className="h-px bg-white/10 mx-6" />
                      )}
                    </View>
                  );
                })}
              </GlassCard>
            </View>
          ))}

          {/* Danger Zone */}
          <View>
            <Text className="text-white text-lg font-bold px-2 mb-2">Danger Zone</Text>

            <GlassCard className="p-4 gap-3">
              <GlassButton
                title="Clear Cache"
                variant="secondary"
                onPress={() => console.log('Clear cache')}
              />

              <GlassButton
                title="Log Out"
                variant="ghost"
                onPress={() => {
                  console.log('Log out');
                  router.replace('/example-login');
                }}
              />

              <GlassButton
                title="Delete Account"
                variant="ghost"
                onPress={() => console.log('Delete account')}
                className="opacity-70"
              />
            </GlassCard>
          </View>

          {/* App Info */}
          <GlassCard className="p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white/70 text-sm">Version</Text>
              <Text className="text-white text-sm">1.0.0</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-white/70 text-sm">Build</Text>
              <Text className="text-white text-sm">2025.11.17</Text>
            </View>
          </GlassCard>

          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>

      {/* Language Selection Sheet */}
      <GlassSheet
        visible={languageSheetVisible}
        onClose={() => setLanguageSheetVisible(false)}
        title="Select Language"
        snapPoints={[0.5, 0.8]}
      >
        <View className="gap-2">
          {languages.map((language) => (
            <Pressable
              key={language}
              onPress={() => {
                setSelectedLanguage(language);
                setLanguageSheetVisible(false);
              }}
              className="py-4 px-2 active:bg-white/5 rounded-xl"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-lg">{language}</Text>
                {selectedLanguage === language && (
                  <Check size={20} color="#818CF8" />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </GlassSheet>
    </ImageBackground>
  );
}
