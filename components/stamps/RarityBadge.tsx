import React from 'react';
import { View, Text } from 'react-native';
import {
  RarityTier,
  getRarityLabel,
  getRarityColorClass,
} from '@/lib/stamps/catalog';

interface RarityBadgeProps {
  rarity: RarityTier | string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const VALID_RARITIES: RarityTier[] = ['common', 'uncommon', 'rare', 'very_rare', 'legendary'];

function isValidRarity(value: string | null): value is RarityTier {
  return value !== null && VALID_RARITIES.includes(value as RarityTier);
}

export function RarityBadge({
  rarity,
  size = 'md',
  showLabel = true,
}: RarityBadgeProps) {
  const validRarity: RarityTier = isValidRarity(rarity) ? rarity : 'common';
  const label = getRarityLabel(validRarity);
  const colorClass = getRarityColorClass(validRarity);

  const sizeClasses = {
    sm: 'px-1.5 py-0.5',
    md: 'px-2 py-1',
    lg: 'px-3 py-1.5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <View className={`rounded-full ${colorClass} ${sizeClasses[size]}`}>
      <Text className={`font-medium ${textSizeClasses[size]}`}>
        {showLabel ? label : validRarity.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
