import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  Dimensions,
  Pressable,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { GlassButton } from '@/components/ui/glass';
import { useOnboarding } from '@/lib/hooks/useOnboarding';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to the App',
    description:
      'A beautiful, production-ready starter template with glassmorphic UI design and everything you need to build amazing apps.',
    icon: '👋',
  },
  {
    id: '2',
    title: 'Powerful Features',
    description:
      'Built with Expo SDK 54, React 19, Supabase authentication, and 13 pre-built glassmorphic components.',
    icon: '⚡',
  },
  {
    id: '3',
    title: 'Get Started',
    description: 'Sign up to unlock all features and start building your dream app today.',
    icon: '🚀',
  },
];

/**
 * Onboarding Screen - First-time user experience
 *
 * Features:
 * - Horizontal swipe navigation
 * - Pagination dots
 * - Skip button on all screens
 * - Completion tracked in AsyncStorage
 * - Animated entrance
 */
export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding } = useOnboarding();

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding();
      router.replace('/(auth)/sign-up');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
      router.replace('/(auth)/sign-up');
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={{ width }} className="flex-1 justify-center items-center px-6">
      <Animated.View
        entering={FadeInDown.delay(200).duration(600).springify()}
        className="items-center"
      >
        {/* Icon */}
        <View className="w-32 h-32 rounded-full bg-primary-500/20 items-center justify-center mb-8">
          <Text className="text-7xl">{item.icon}</Text>
        </View>

        {/* Title */}
        <Text className="text-4xl font-bold text-white text-center mb-4">{item.title}</Text>

        {/* Description */}
        <Text className="text-lg text-white/70 text-center leading-relaxed">
          {item.description}
        </Text>
      </Animated.View>
    </View>
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
        {/* Skip Button */}
        <Animated.View entering={FadeInUp.duration(400)} className="absolute top-16 right-6 z-10">
          <Pressable onPress={handleSkip}>
            <Text className="text-white/70 text-base font-medium">Skip</Text>
          </Pressable>
        </Animated.View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        {/* Pagination Dots & Next Button */}
        <Animated.View entering={FadeInUp.delay(400).duration(600)} className="pb-8 px-6">
          {/* Pagination Dots */}
          <View className="flex-row justify-center mb-8">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${
                  index === currentIndex ? 'w-8 bg-primary-500' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </View>

          {/* Next/Get Started Button */}
          <GlassButton
            title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            variant="primary"
            size="lg"
            onPress={handleNext}
          />
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}
