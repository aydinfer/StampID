import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { Camera, Sparkles, FolderOpen, ArrowRight } from 'lucide-react-native';
import { useOnboarding } from '@/lib/hooks/useOnboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: <Camera size={48} color="#1B4332" strokeWidth={1.5} />,
    title: 'Scan Your Stamps',
    subtitle: 'Point & Identify',
    description:
      'Simply point your camera at any stamp. Our AI identifies it instantly, detecting multiple stamps in a single photo.',
  },
  {
    id: '2',
    icon: <Sparkles size={48} color="#1B4332" strokeWidth={1.5} />,
    title: 'Get Instant Values',
    subtitle: 'AI-Powered Estimates',
    description:
      'Receive real-time value estimates based on condition, rarity, and market data. Know what your stamps are worth.',
  },
  {
    id: '3',
    icon: <FolderOpen size={48} color="#1B4332" strokeWidth={1.5} />,
    title: 'Build Your Collection',
    subtitle: 'Organize & Track',
    description:
      'Create collections, track your portfolio value, and discover new stamps to add to your want list.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const { completeOnboarding: saveOnboardingComplete } = useOnboarding();

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await saveOnboardingComplete();
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
    router.replace('/(auth)/sign-in');
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={{ width: SCREEN_WIDTH }} className="px-8 items-center justify-center">
      {/* Icon Container */}
      <Animated.View
        entering={FadeInDown.delay(100 * index).duration(600)}
        className="mb-8"
      >
        <BlurView intensity={25} tint="light" className="rounded-3xl overflow-hidden">
          <View className="w-28 h-28 items-center justify-center bg-forest-900/5">
            {item.icon}
          </View>
        </BlurView>
      </Animated.View>

      {/* Subtitle */}
      <Animated.Text
        entering={FadeInUp.delay(200).duration(500)}
        className="text-forest-900/70 text-sm font-medium tracking-wider uppercase mb-2"
      >
        {item.subtitle}
      </Animated.Text>

      {/* Title */}
      <Animated.Text
        entering={FadeInUp.delay(300).duration(500)}
        className="text-3xl font-bold text-ink text-center mb-4"
      >
        {item.title}
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        entering={FadeInUp.delay(400).duration(500)}
        className="text-ink-light text-center text-base leading-7 max-w-xs"
      >
        {item.description}
      </Animated.Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Skip Button */}
      <View className="flex-row justify-end px-6 pt-2">
        <Pressable onPress={handleSkip} className="py-2 px-4">
          <Text className="text-ink-light font-medium">Skip</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <View className="flex-1 justify-center">
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />
      </View>

      {/* Bottom Section */}
      <Animated.View entering={FadeIn.delay(500).duration(400)} className="px-8 pb-8">
        {/* Dots */}
        <View className="flex-row justify-center mb-8">
          {SLIDES.map((_, index) => (
            <PaginationDot key={index} index={index} currentIndex={currentIndex} />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <Pressable
          onPress={handleNext}
          className="bg-forest-900 rounded-2xl py-4 flex-row items-center justify-center active:opacity-90"
        >
          <Text className="text-white font-semibold text-lg mr-2">
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </Pressable>

        {/* Terms */}
        <Text className="text-ink-muted text-xs text-center mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

// Pagination dot component
function PaginationDot({ index, currentIndex }: { index: number; currentIndex: number }) {
  const isActive = index === currentIndex;

  return (
    <Animated.View
      className={`h-2 mx-1 rounded-full ${
        isActive ? 'w-6 bg-forest-900' : 'w-2 bg-forest-900/30'
      }`}
      style={{
        transform: [{ scale: isActive ? 1 : 0.8 }],
      }}
    />
  );
}
