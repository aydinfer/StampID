import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ChevronLeft, Save, Trash2 } from 'lucide-react-native';
import { useStamp, useUpdateStamp, useDeleteStamp } from '@/lib/hooks/useStamps';
import type { StampCondition, StampCategory } from '@/lib/supabase/types';

const CONDITIONS: { value: StampCondition; label: string }[] = [
  { value: 'mint', label: 'Mint' },
  { value: 'mint_hinged', label: 'Mint Hinged' },
  { value: 'used', label: 'Used' },
  { value: 'damaged', label: 'Damaged' },
];

const CATEGORIES: { value: StampCategory; label: string }[] = [
  { value: 'definitive', label: 'Definitive' },
  { value: 'commemorative', label: 'Commemorative' },
  { value: 'airmail', label: 'Airmail' },
  { value: 'special', label: 'Special' },
  { value: 'other', label: 'Other' },
];

const RARITIES = [
  { value: 'common', label: 'Common' },
  { value: 'uncommon', label: 'Uncommon' },
  { value: 'rare', label: 'Rare' },
  { value: 'very_rare', label: 'Very Rare' },
] as const;

export default function EditStampScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: stamp, isLoading } = useStamp(id!);
  const updateStamp = useUpdateStamp();
  const deleteStamp = useDeleteStamp();

  // Form state
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [yearIssued, setYearIssued] = useState('');
  const [catalogNumber, setCatalogNumber] = useState('');
  const [denomination, setDenomination] = useState('');
  const [category, setCategory] = useState<StampCategory | null>(null);
  const [theme, setTheme] = useState('');
  const [condition, setCondition] = useState<StampCondition | null>(null);
  const [conditionNotes, setConditionNotes] = useState('');
  const [rarity, setRarity] = useState<string | null>(null);
  const [valueLow, setValueLow] = useState('');
  const [valueHigh, setValueHigh] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  // Populate form when stamp loads
  useEffect(() => {
    if (stamp) {
      setName(stamp.name || '');
      setCountry(stamp.country || '');
      setYearIssued(stamp.year_issued?.toString() || '');
      setCatalogNumber(stamp.catalog_number || '');
      setDenomination(stamp.denomination || '');
      setCategory(stamp.category);
      setTheme(stamp.theme || '');
      setCondition(stamp.condition);
      setConditionNotes(stamp.condition_notes || '');
      setRarity(stamp.rarity);
      setValueLow(stamp.estimated_value_low?.toString() || '');
      setValueHigh(stamp.estimated_value_high?.toString() || '');
      setDescription(stamp.description || '');
      setNotes(stamp.notes || '');
    }
  }, [stamp]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Stamp name is required');
      return;
    }

    try {
      await updateStamp.mutateAsync({
        id: id!,
        name: name.trim(),
        country: country.trim() || null,
        year_issued: yearIssued ? parseInt(yearIssued, 10) : null,
        catalog_number: catalogNumber.trim() || null,
        denomination: denomination.trim() || null,
        category,
        theme: theme.trim() || null,
        condition,
        condition_notes: conditionNotes.trim() || null,
        rarity: rarity as 'common' | 'uncommon' | 'rare' | 'very_rare' | null,
        estimated_value_low: valueLow ? parseFloat(valueLow) : null,
        estimated_value_high: valueHigh ? parseFloat(valueHigh) : null,
        description: description.trim() || null,
        notes: notes.trim() || null,
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Stamp',
      'Are you sure you want to delete this stamp? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteStamp.mutateAsync(id!);
              router.replace('/(tabs)/collection');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete stamp');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1B4332" />
      </SafeAreaView>
    );
  }

  if (!stamp) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <Text className="text-ink-light">Stamp not found</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-forest-900 font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-forest-900/10">
          <Pressable onPress={() => router.back()} className="flex-row items-center py-2">
            <ChevronLeft size={24} color="#1B4332" />
            <Text className="text-forest-900 font-medium">Cancel</Text>
          </Pressable>
          <Text className="text-lg font-semibold text-ink">Edit Stamp</Text>
          <Pressable
            onPress={handleSave}
            disabled={updateStamp.isPending}
            className="flex-row items-center py-2"
          >
            {updateStamp.isPending ? (
              <ActivityIndicator size="small" color="#1B4332" />
            ) : (
              <>
                <Save size={20} color="#1B4332" />
                <Text className="text-forest-900 font-medium ml-1">Save</Text>
              </>
            )}
          </Pressable>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="pb-32">
          {/* Stamp Image */}
          <Animated.View entering={FadeIn.duration(400)} className="items-center py-6">
            <View className="w-40 h-40 rounded-2xl overflow-hidden shadow-glass">
              <Image
                source={{ uri: stamp.image_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} className="px-4">
            {/* Basic Info Section */}
            <SectionTitle title="Basic Information" />

            <FormInput
              label="Name *"
              value={name}
              onChangeText={setName}
              placeholder="Stamp name"
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <FormInput
                  label="Country"
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Country of origin"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Year Issued"
                  value={yearIssued}
                  onChangeText={setYearIssued}
                  placeholder="1990"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <FormInput
                  label="Catalog Number"
                  value={catalogNumber}
                  onChangeText={setCatalogNumber}
                  placeholder="e.g. SG 1234"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Denomination"
                  value={denomination}
                  onChangeText={setDenomination}
                  placeholder="e.g. 50c"
                />
              </View>
            </View>

            {/* Classification Section */}
            <SectionTitle title="Classification" />

            <FormPicker
              label="Category"
              value={category}
              options={CATEGORIES}
              onChange={setCategory}
            />

            <FormInput
              label="Theme"
              value={theme}
              onChangeText={setTheme}
              placeholder="e.g. Birds, Sports, History"
            />

            {/* Condition & Value Section */}
            <SectionTitle title="Condition & Value" />

            <FormPicker
              label="Condition"
              value={condition}
              options={CONDITIONS}
              onChange={setCondition}
            />

            <FormInput
              label="Condition Notes"
              value={conditionNotes}
              onChangeText={setConditionNotes}
              placeholder="Any defects or special notes"
              multiline
            />

            <FormPicker
              label="Rarity"
              value={rarity}
              options={RARITIES as unknown as { value: string; label: string }[]}
              onChange={setRarity}
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <FormInput
                  label="Value (Low)"
                  value={valueLow}
                  onChangeText={setValueLow}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
              <View className="flex-1">
                <FormInput
                  label="Value (High)"
                  value={valueHigh}
                  onChangeText={setValueHigh}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Additional Info Section */}
            <SectionTitle title="Additional Information" />

            <FormInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="About this stamp..."
              multiline
              numberOfLines={4}
            />

            <FormInput
              label="Personal Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Your private notes..."
              multiline
              numberOfLines={3}
            />

            {/* Delete Button */}
            <View className="mt-8 mb-4">
              <Pressable
                onPress={handleDelete}
                disabled={deleteStamp.isPending}
                className="flex-row items-center justify-center py-4 bg-error/10 rounded-xl active:bg-error/20"
              >
                <Trash2 size={20} color="#EF4444" />
                <Text className="text-error font-semibold ml-2">Delete Stamp</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Section title component
function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-lg font-semibold text-ink mt-6 mb-3">{title}</Text>
  );
}

// Form input component
interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
  numberOfLines?: number;
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}: FormInputProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-ink-light mb-1.5">{label}</Text>
      <BlurView intensity={15} tint="light" className="rounded-xl overflow-hidden">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          className={`bg-white/60 px-4 text-ink ${
            multiline ? 'py-3 min-h-[100]' : 'py-3'
          }`}
        />
      </BlurView>
    </View>
  );
}

// Form picker component
interface FormPickerProps<T> {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T | null) => void;
}

function FormPicker<T extends string>({
  label,
  value,
  options,
  onChange,
}: FormPickerProps<T>) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-ink-light mb-1.5">{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-1"
      >
        <Pressable
          onPress={() => onChange(null)}
          className={`mx-1 px-4 py-2.5 rounded-xl ${
            value === null
              ? 'bg-forest-900'
              : 'bg-white/60 border border-forest-900/10'
          }`}
        >
          <Text
            className={`font-medium ${
              value === null ? 'text-white' : 'text-ink-light'
            }`}
          >
            None
          </Text>
        </Pressable>
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`mx-1 px-4 py-2.5 rounded-xl ${
              value === option.value
                ? 'bg-forest-900'
                : 'bg-white/60 border border-forest-900/10'
            }`}
          >
            <Text
              className={`font-medium ${
                value === option.value ? 'text-white' : 'text-ink'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
