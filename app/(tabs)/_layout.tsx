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
import { colors } from '@/lib/design/tokens';

const ICON_SIZE = 24;

type IconComponent = typeof Home;

function TabIcon({ Icon, focused }: { Icon: IconComponent; focused: boolean }) {
  return (
    <View
      className={`w-10 h-10 rounded-xl items-center justify-center ${
        focused ? 'bg-indigo-500/10' : 'bg-transparent'
      }`}
    >
      <Icon
        size={ICON_SIZE}
        color={focused ? colors.indigo[500] : colors.zinc[400]}
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
        tabBarActiveTintColor: colors.indigo[500],
        tabBarInactiveTintColor: colors.zinc[400],
        tabBarStyle: {
          backgroundColor: 'rgba(250, 250, 250, 0.95)',
          borderTopColor: colors.zinc[200],
          borderTopWidth: 0.5,
          paddingTop: 8,
          height: 85,
        },
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_500Medium',
          fontSize: 11,
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
