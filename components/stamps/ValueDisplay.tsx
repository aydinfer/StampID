import React from 'react';
import { View, Text } from 'react-native';
import {
  ValueEstimate,
  ValueConfidence,
  getConfidenceInfo,
  calculateStampValue,
  RarityTier,
} from '@/lib/stamps/catalog';

interface ValueDisplayProps {
  low: number | null;
  high: number | null;
  condition?: string | null;
  rarity?: RarityTier | null;
  currency?: string;
  confidence?: ValueConfidence;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
}

export function ValueDisplay({
  low,
  high,
  condition,
  rarity,
  currency = 'USD',
  confidence = 'ai_estimate',
  size = 'md',
  showConfidence = true,
}: ValueDisplayProps) {
  // Calculate adjusted value if condition/rarity provided
  const estimate = calculateStampValue({
    baseValueLow: low,
    baseValueHigh: high,
    condition: condition || null,
    rarity: rarity || null,
  });

  const confidenceInfo = getConfidenceInfo(confidence);

  const formatValue = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(2)}`;
  };

  const sizeClasses = {
    sm: { value: 'text-sm', label: 'text-xs' },
    md: { value: 'text-lg', label: 'text-xs' },
    lg: { value: 'text-2xl', label: 'text-sm' },
  };

  if (estimate.average === 0) {
    return (
      <View>
        <Text className={`text-ink-muted ${sizeClasses[size].value}`}>
          Value unknown
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row items-baseline">
        <Text className={`font-bold text-forest-900 ${sizeClasses[size].value}`}>
          {formatValue(estimate.low)}
        </Text>
        <Text className={`text-ink-muted mx-1 ${sizeClasses[size].label}`}>-</Text>
        <Text className={`font-bold text-forest-900 ${sizeClasses[size].value}`}>
          {formatValue(estimate.high)}
        </Text>
        <Text className={`text-ink-muted ml-1 ${sizeClasses[size].label}`}>
          {currency}
        </Text>
      </View>

      {showConfidence && (
        <View className="flex-row items-center mt-1">
          <View className={`rounded px-1.5 py-0.5 ${confidenceInfo.colorClass}`}>
            <Text className="text-xs font-medium">{confidenceInfo.label}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// Simple inline value badge
interface ValueBadgeProps {
  low: number | null;
  high: number | null;
  size?: 'sm' | 'md';
}

export function ValueBadge({ low, high, size = 'md' }: ValueBadgeProps) {
  const avg = ((low || 0) + (high || 0)) / 2;

  if (avg === 0) return null;

  const formatValue = (value: number): string => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    if (value >= 100) {
      return `$${Math.round(value)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
  };

  return (
    <View className={`bg-forest-900/10 rounded-full ${sizeClasses[size]}`}>
      <Text className="text-forest-900 font-medium">{formatValue(avg)}</Text>
    </View>
  );
}
