/**
 * Font Configuration for StampID
 *
 * Uses Plus Jakarta Sans (similar to Satoshi) and JetBrains Mono
 * Both are clean, modern fonts that work beautifully with frosted glass
 */

import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';

/**
 * Font name constants - use these in styles
 */
export const FontNames = {
  // Sans-serif family
  sansRegular: 'PlusJakartaSans_400Regular',
  sansMedium: 'PlusJakartaSans_500Medium',
  sansSemiBold: 'PlusJakartaSans_600SemiBold',
  sansBold: 'PlusJakartaSans_700Bold',

  // Monospace family
  monoRegular: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

/**
 * Font map for Tailwind/NativeWind
 */
export const fontFamilyMap = {
  sans: FontNames.sansRegular,
  'sans-medium': FontNames.sansMedium,
  'sans-semibold': FontNames.sansSemiBold,
  'sans-bold': FontNames.sansBold,
  mono: FontNames.monoRegular,
  'mono-medium': FontNames.monoMedium,
} as const;

/**
 * Hook to load all app fonts
 * Use in app/_layout.tsx
 */
export function useAppFonts() {
  const [fontsLoaded, fontError] = useFonts({
    [FontNames.sansRegular]: PlusJakartaSans_400Regular,
    [FontNames.sansMedium]: PlusJakartaSans_500Medium,
    [FontNames.sansSemiBold]: PlusJakartaSans_600SemiBold,
    [FontNames.sansBold]: PlusJakartaSans_700Bold,
    [FontNames.monoRegular]: JetBrainsMono_400Regular,
    [FontNames.monoMedium]: JetBrainsMono_500Medium,
  });

  return {
    fontsLoaded,
    fontError,
    isReady: fontsLoaded && !fontError,
  };
}

/**
 * Get font style for a specific weight
 */
export function getFontStyle(weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') {
  const fontMap = {
    regular: FontNames.sansRegular,
    medium: FontNames.sansMedium,
    semibold: FontNames.sansSemiBold,
    bold: FontNames.sansBold,
  };

  return {
    fontFamily: fontMap[weight],
  };
}

/**
 * Get mono font style
 */
export function getMonoFontStyle(weight: 'regular' | 'medium' = 'regular') {
  const fontMap = {
    regular: FontNames.monoRegular,
    medium: FontNames.monoMedium,
  };

  return {
    fontFamily: fontMap[weight],
  };
}
