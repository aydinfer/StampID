import { Tabs } from 'expo-router';
import { View } from 'react-native';
import {
  Home,
  Search,
  ScanLine,
  Compass,
  FolderOpen,
  Settings,
} from 'lucide-react-native';

const ICON_SIZE = 24;
const COLORS = {
  active: '#1B4332',
  inactive: '#6B6B6B',
};

type IconComponent = typeof Home;

function TabIcon({ Icon, focused }: { Icon: IconComponent; focused: boolean }) {
  return (
    <View
      className={`w-10 h-10 rounded-xl items-center justify-center ${
        focused ? 'bg-forest-900/10' : 'bg-transparent'
      }`}
    >
      <Icon
        size={ICON_SIZE}
        color={focused ? COLORS.active : COLORS.inactive}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
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
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Search} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ focused }) => <TabIcon Icon={ScanLine} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Compass} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ focused }) => <TabIcon Icon={FolderOpen} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Settings} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
