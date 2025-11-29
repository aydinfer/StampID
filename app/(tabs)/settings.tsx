import { View, Text, ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</Text>

        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-4">
          <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            App Version
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">1.0.0</Text>
        </View>

        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Built with
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Expo SDK 54 • NativeWind v4 • Official Stack
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
