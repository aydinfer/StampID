import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { SearchResult } from '@/lib/hooks/useSearch';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
  suggestions?: SearchResult[];
  recentSearches?: string[];
  isLoadingSuggestions?: boolean;
  onSuggestionPress?: (stamp: SearchResult) => void;
  onRecentPress?: (query: string) => void;
  onClearRecent?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  suggestions = [],
  recentSearches = [],
  isLoadingSuggestions = false,
  onSuggestionPress,
  onRecentPress,
  onClearRecent,
  placeholder = 'Search stamps...',
  autoFocus = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const showDropdown = isFocused && (suggestions.length > 0 || (value.length === 0 && recentSearches.length > 0));

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      Keyboard.dismiss();
    }
  };

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  return (
    <View className="relative z-50">
      {/* Search Input */}
      <BlurView intensity={20} tint="light" className="rounded-xl overflow-hidden">
        <View className="flex-row items-center bg-white/70 px-4 py-3">
          {/* Search Icon Placeholder */}
          <View className="w-5 h-5 mr-3 items-center justify-center">
            <Text className="text-ink-muted text-sm">S</Text>
          </View>

          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onSubmitEditing={handleSubmit}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-ink text-base"
            returnKeyType="search"
            autoFocus={autoFocus}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Clear Button */}
          {value.length > 0 && (
            <Pressable onPress={handleClear} className="ml-2 p-1">
              <Text className="text-ink-muted text-sm">X</Text>
            </Pressable>
          )}
        </View>
      </BlurView>

      {/* Dropdown */}
      {showDropdown && (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <BlurView intensity={30} tint="light" className="rounded-xl overflow-hidden">
            <View className="bg-white/90 max-h-80">
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.id}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => onSuggestionPress?.(item)}
                      className="flex-row items-center p-3 border-b border-ink-muted/10 active:bg-ink-muted/5"
                    >
                      {/* Thumbnail */}
                      <View className="w-10 h-10 rounded-lg bg-cream-100 overflow-hidden mr-3">
                        {item.thumbnail_url || item.image_url ? (
                          <Image
                            source={{ uri: item.thumbnail_url || item.image_url }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-full h-full items-center justify-center">
                            <Text className="text-ink-muted text-xs">IMG</Text>
                          </View>
                        )}
                      </View>

                      {/* Info */}
                      <View className="flex-1">
                        <Text className="text-ink font-medium" numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text className="text-ink-muted text-xs" numberOfLines={1}>
                          {item.country} {item.year_issued ? `• ${item.year_issued}` : ''}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              )}

              {/* Recent Searches */}
              {value.length === 0 && recentSearches.length > 0 && (
                <View>
                  <View className="flex-row items-center justify-between px-3 py-2 border-b border-ink-muted/10">
                    <Text className="text-ink-muted text-xs font-medium">Recent</Text>
                    <Pressable onPress={onClearRecent}>
                      <Text className="text-forest-900 text-xs font-medium">Clear</Text>
                    </Pressable>
                  </View>

                  {recentSearches.map((recent, index) => (
                    <Pressable
                      key={`${recent}-${index}`}
                      onPress={() => onRecentPress?.(recent)}
                      className="flex-row items-center p-3 border-b border-ink-muted/10 active:bg-ink-muted/5"
                    >
                      <View className="w-5 h-5 mr-3 items-center justify-center">
                        <Text className="text-ink-muted text-xs">H</Text>
                      </View>
                      <Text className="text-ink">{recent}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Loading */}
              {isLoadingSuggestions && value.length >= 2 && (
                <View className="p-4 items-center">
                  <Text className="text-ink-muted text-sm">Searching...</Text>
                </View>
              )}
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}
