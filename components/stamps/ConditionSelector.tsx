import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { StampCondition } from '@/lib/supabase/types';

interface ConditionSelectorProps {
  value: StampCondition | null;
  onChange: (condition: StampCondition | null) => void;
}

const CONDITIONS: { value: StampCondition; label: string; description: string; color: string }[] = [
  {
    value: 'mint',
    label: 'Mint',
    description: 'Never used, perfect condition',
    color: 'bg-green-100 border-green-300',
  },
  {
    value: 'mint_hinged',
    label: 'Mint Hinged',
    description: 'Unused with hinge mark',
    color: 'bg-lime-100 border-lime-300',
  },
  {
    value: 'used',
    label: 'Used',
    description: 'Postally used, good condition',
    color: 'bg-blue-100 border-blue-300',
  },
  {
    value: 'damaged',
    label: 'Damaged',
    description: 'Tears, thins, or defects',
    color: 'bg-red-100 border-red-300',
  },
];

export function ConditionSelector({ value, onChange }: ConditionSelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {CONDITIONS.map((condition) => {
        const isSelected = value === condition.value;

        return (
          <Pressable
            key={condition.value}
            onPress={() => onChange(isSelected ? null : condition.value)}
            className={`px-4 py-2.5 rounded-xl border-2 ${
              isSelected
                ? `${condition.color} border-opacity-100`
                : 'bg-cream border-transparent'
            }`}
          >
            <Text className={`font-medium ${isSelected ? 'text-ink' : 'text-ink-light'}`}>
              {condition.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Standalone condition guide component
export function ConditionGuide() {
  return (
    <View className="bg-cream rounded-xl p-4">
      <Text className="text-ink font-semibold mb-3">Condition Guide</Text>
      {CONDITIONS.map((condition) => (
        <View key={condition.value} className="flex-row items-start mb-2">
          <View className={`w-3 h-3 rounded-full ${condition.color.split(' ')[0]} mt-1.5 mr-2`} />
          <View className="flex-1">
            <Text className="text-ink font-medium">{condition.label}</Text>
            <Text className="text-ink-light text-sm">{condition.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
