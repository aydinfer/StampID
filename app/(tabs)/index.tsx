import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome! 👋
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-6">
          Your production-ready Expo starter is set up and ready to go.
        </Text>

        <View className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl border border-primary-200 dark:border-primary-800 mb-4">
          <Text className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-1">
            ✅ Expo SDK 54
          </Text>
          <Text className="text-sm text-primary-700 dark:text-primary-300">
            Latest stable Expo version
          </Text>
        </View>

        <View className="bg-success-50 dark:bg-success-900/20 p-4 rounded-xl border border-success-200 dark:border-success-800 mb-4">
          <Text className="text-sm font-semibold text-success-900 dark:text-success-100 mb-1">
            ✅ NativeWind v4
          </Text>
          <Text className="text-sm text-success-700 dark:text-success-300">
            Tailwind CSS working perfectly
          </Text>
        </View>

        <View className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-xl border border-warning-200 dark:border-warning-800">
          <Text className="text-sm font-semibold text-warning-900 dark:text-warning-100 mb-1">
            ✅ Official Expo Stack
          </Text>
          <Text className="text-sm text-warning-700 dark:text-warning-300">
            React Native Reanimated, expo-blur, Supabase, RevenueCat
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
