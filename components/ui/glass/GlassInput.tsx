import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  intensity?: number;
  className?: string;
}

/**
 * GlassInput - A glassmorphic text input
 *
 * @example
 * <GlassInput
 *   label="Email"
 *   placeholder="you@example.com"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 */
export function GlassInput({
  label,
  error,
  intensity = 30,
  className = '',
  ...props
}: GlassInputProps) {
  return (
    <View className={className}>
      {label && <Text className="text-white/70 text-sm font-medium mb-2">{label}</Text>}

      <BlurView intensity={intensity} tint="dark" className="rounded-xl overflow-hidden">
        <View className="bg-white/5 border border-white/10">
          <TextInput
            className="px-4 py-3 text-white text-base"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            {...props}
          />
        </View>
      </BlurView>

      {error && <Text className="text-error-400 text-sm mt-1">{error}</Text>}
    </View>
  );
}
