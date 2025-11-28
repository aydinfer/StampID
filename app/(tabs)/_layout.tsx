import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

// Tab icon component - uses text placeholders until proper icons are provided
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  // Text-based icon placeholders (replace with actual icon components)
  const iconLabels: Record<string, string> = {
    Home: 'H',
    Search: 'S',
    Scan: '+',
    Discover: 'D',
    Collection: 'C',
    Settings: 'G',
  };

  return (
    <View
      className={`w-8 h-8 rounded-lg items-center justify-center ${
        focused ? 'bg-forest-900' : 'bg-transparent'
      }`}
    >
      <Text
        className={`text-base font-semibold ${
          focused ? 'text-white' : 'text-ink-muted'
        }`}
      >
        {iconLabels[name] || '?'}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1B4332',
        tabBarInactiveTintColor: '#6B6B6B',
        tabBarStyle: {
          backgroundColor: 'rgba(250, 249, 246, 0.95)',
          borderTopColor: 'rgba(27, 67, 50, 0.1)',
          paddingTop: 8,
          height: 85,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon name="Search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => <TabIcon name="Scan" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon name="Discover" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ focused }) => <TabIcon name="Collection" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
