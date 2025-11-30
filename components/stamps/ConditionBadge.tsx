import React from 'react';
import { View, Text } from 'react-native';
import {
  SimpleCondition,
  mapToSimpleCondition,
  getConditionLabel,
  getConditionColorClass,
} from '@/lib/stamps/catalog';

interface ConditionBadgeProps {
  condition: string | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ConditionBadge({
  condition,
  size = 'md',
  showLabel = true,
}: ConditionBadgeProps) {
  const simpleCondition = mapToSimpleCondition(condition);
  const label = getConditionLabel(simpleCondition);
  const colorClass = getConditionColorClass(simpleCondition);

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <View className={`rounded-full ${colorClass} ${sizeClasses[size]}`}>
      <Text
        className={`font-medium ${
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm'
        }`}
        style={{ color: 'inherit' }}
      >
        {showLabel ? label : simpleCondition.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}
