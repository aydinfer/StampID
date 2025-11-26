import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useUpdateStamp } from '@/lib/hooks/useStamps';
import { ConditionSelector } from './ConditionSelector';
import type { Stamp, StampCondition } from '@/lib/supabase/types';

interface StampEditModalProps {
  visible: boolean;
  stamp: Stamp;
  onClose: () => void;
}

export function StampEditModal({ visible, stamp, onClose }: StampEditModalProps) {
  const updateStamp = useUpdateStamp();

  const [name, setName] = useState(stamp.name);
  const [country, setCountry] = useState(stamp.country || '');
  const [yearIssued, setYearIssued] = useState(stamp.year_issued?.toString() || '');
  const [catalogNumber, setCatalogNumber] = useState(stamp.catalog_number || '');
  const [denomination, setDenomination] = useState(stamp.denomination || '');
  const [condition, setCondition] = useState<StampCondition | null>(stamp.condition);
  const [conditionNotes, setConditionNotes] = useState(stamp.condition_notes || '');
  const [valueLow, setValueLow] = useState(stamp.estimated_value_low?.toString() || '');
  const [valueHigh, setValueHigh] = useState(stamp.estimated_value_high?.toString() || '');
  const [notes, setNotes] = useState(stamp.notes || '');

  // Reset form when stamp changes
  useEffect(() => {
    setName(stamp.name);
    setCountry(stamp.country || '');
    setYearIssued(stamp.year_issued?.toString() || '');
    setCatalogNumber(stamp.catalog_number || '');
    setDenomination(stamp.denomination || '');
    setCondition(stamp.condition);
    setConditionNotes(stamp.condition_notes || '');
    setValueLow(stamp.estimated_value_low?.toString() || '');
    setValueHigh(stamp.estimated_value_high?.toString() || '');
    setNotes(stamp.notes || '');
  }, [stamp]);

  const handleSave = async () => {
    try {
      await updateStamp.mutateAsync({
        id: stamp.id,
        name,
        country: country || null,
        year_issued: yearIssued ? parseInt(yearIssued, 10) : null,
        catalog_number: catalogNumber || null,
        denomination: denomination || null,
        condition,
        condition_notes: conditionNotes || null,
        estimated_value_low: valueLow ? parseFloat(valueLow) : null,
        estimated_value_high: valueHigh ? parseFloat(valueHigh) : null,
        notes: notes || null,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update stamp:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={onClose}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <BlurView intensity={30} tint="light" className="rounded-t-3xl overflow-hidden">
              <View className="bg-white/95 max-h-[85%]">
                {/* Header */}
                <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                  <Pressable onPress={onClose} className="py-2">
                    <Text className="text-ink-light font-medium">Cancel</Text>
                  </Pressable>
                  <Text className="text-lg font-semibold text-ink">Edit Stamp</Text>
                  <Pressable
                    onPress={handleSave}
                    disabled={updateStamp.isPending || !name.trim()}
                    className="py-2"
                  >
                    <Text className={`font-semibold ${
                      updateStamp.isPending || !name.trim()
                        ? 'text-ink-muted'
                        : 'text-forest-900'
                    }`}>
                      {updateStamp.isPending ? 'Saving...' : 'Save'}
                    </Text>
                  </Pressable>
                </View>

                {/* Form */}
                <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 40 }}>
                  {/* Name */}
                  <FormField label="Name *">
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Stamp name"
                      placeholderTextColor="#9CA3AF"
                      className="bg-cream rounded-xl px-4 py-3 text-ink"
                    />
                  </FormField>

                  {/* Country & Year */}
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <FormField label="Country">
                        <TextInput
                          value={country}
                          onChangeText={setCountry}
                          placeholder="e.g. USA"
                          placeholderTextColor="#9CA3AF"
                          className="bg-cream rounded-xl px-4 py-3 text-ink"
                        />
                      </FormField>
                    </View>
                    <View className="flex-1">
                      <FormField label="Year">
                        <TextInput
                          value={yearIssued}
                          onChangeText={setYearIssued}
                          placeholder="e.g. 1950"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="number-pad"
                          className="bg-cream rounded-xl px-4 py-3 text-ink"
                        />
                      </FormField>
                    </View>
                  </View>

                  {/* Catalog Number & Denomination */}
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <FormField label="Catalog #">
                        <TextInput
                          value={catalogNumber}
                          onChangeText={setCatalogNumber}
                          placeholder="Scott #123"
                          placeholderTextColor="#9CA3AF"
                          className="bg-cream rounded-xl px-4 py-3 text-ink"
                        />
                      </FormField>
                    </View>
                    <View className="flex-1">
                      <FormField label="Denomination">
                        <TextInput
                          value={denomination}
                          onChangeText={setDenomination}
                          placeholder="5 cents"
                          placeholderTextColor="#9CA3AF"
                          className="bg-cream rounded-xl px-4 py-3 text-ink"
                        />
                      </FormField>
                    </View>
                  </View>

                  {/* Condition */}
                  <FormField label="Condition">
                    <ConditionSelector
                      value={condition}
                      onChange={setCondition}
                    />
                  </FormField>

                  {/* Condition Notes */}
                  <FormField label="Condition Notes">
                    <TextInput
                      value={conditionNotes}
                      onChangeText={setConditionNotes}
                      placeholder="Describe the condition..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={2}
                      className="bg-cream rounded-xl px-4 py-3 text-ink min-h-[60px]"
                      textAlignVertical="top"
                    />
                  </FormField>

                  {/* Value */}
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <FormField label="Value Low ($)">
                        <TextInput
                          value={valueLow}
                          onChangeText={setValueLow}
                          placeholder="0.00"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="decimal-pad"
                          className="bg-cream rounded-xl px-4 py-3 text-ink"
                        />
                      </FormField>
                    </View>
                    <View className="flex-1">
                      <FormField label="Value High ($)">
                        <TextInput
                          value={valueHigh}
                          onChangeText={setValueHigh}
                          placeholder="0.00"
                          placeholderTextColor="#9CA3AF"
                          keyboardType="decimal-pad"
                          className="bg-cream rounded-xl px-4 py-3 text-ink"
                        />
                      </FormField>
                    </View>
                  </View>

                  {/* Notes */}
                  <FormField label="Personal Notes">
                    <TextInput
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="Add your notes about this stamp..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                      className="bg-cream rounded-xl px-4 py-3 text-ink min-h-[80px]"
                      textAlignVertical="top"
                    />
                  </FormField>
                </ScrollView>
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      <Text className="text-ink-light text-sm mb-1.5 ml-1">{label}</Text>
      {children}
    </View>
  );
}
