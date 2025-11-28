import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const HAPTICS_ENABLED_KEY = '@stampid_haptics_enabled';
const SOUNDS_ENABLED_KEY = '@stampid_sounds_enabled';

// Global settings (cached in memory)
let hapticsEnabled = true;
let soundsEnabled = true;

// Sound cache
const soundCache: Record<string, Audio.Sound> = {};

// Initialize feedback settings from storage
export async function initializeFeedbackSettings(): Promise<void> {
  try {
    const [haptics, sounds] = await Promise.all([
      AsyncStorage.getItem(HAPTICS_ENABLED_KEY),
      AsyncStorage.getItem(SOUNDS_ENABLED_KEY),
    ]);

    hapticsEnabled = haptics !== 'false';
    soundsEnabled = sounds !== 'false';
  } catch (error) {
    console.error('Error loading feedback settings:', error);
  }
}

// Toggle haptics
export async function setHapticsEnabled(enabled: boolean): Promise<void> {
  hapticsEnabled = enabled;
  await AsyncStorage.setItem(HAPTICS_ENABLED_KEY, String(enabled));
}

// Toggle sounds
export async function setSoundsEnabled(enabled: boolean): Promise<void> {
  soundsEnabled = enabled;
  await AsyncStorage.setItem(SOUNDS_ENABLED_KEY, String(enabled));
}

// Get current settings
export function getFeedbackSettings(): { hapticsEnabled: boolean; soundsEnabled: boolean } {
  return { hapticsEnabled, soundsEnabled };
}

// Haptic feedback types
export type HapticType =
  | 'light'     // Light tap - button press
  | 'medium'    // Medium tap - action confirmed
  | 'heavy'     // Heavy tap - important action
  | 'success'   // Success notification
  | 'warning'   // Warning notification
  | 'error'     // Error notification
  | 'selection' // Selection changed
  | 'rare_find'; // Special celebration for rare stamps

// Trigger haptic feedback
export async function haptic(type: HapticType): Promise<void> {
  if (!hapticsEnabled) return;

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        await Haptics.selectionAsync();
        break;
      case 'rare_find':
        // Special pattern for rare finds - multiple vibrations
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await delay(100);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await delay(100);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  } catch (error) {
    console.error('Haptic feedback error:', error);
  }
}

// Sound types
export type SoundType =
  | 'tap'        // Light tap sound
  | 'success'    // Success/complete sound
  | 'scan'       // Camera shutter/scan sound
  | 'rare_find'  // Celebration sound for rare stamps
  | 'swipe'      // Swipe sound
  | 'favorite';  // Add to favorites sound

// Sound file paths (these would be actual sound files in production)
// For now, we'll use system sounds or skip if not available
const SOUND_FILES: Record<SoundType, string | null> = {
  tap: null,
  success: null,
  scan: null,
  rare_find: null,
  swipe: null,
  favorite: null,
};

// Play sound
export async function playSound(type: SoundType): Promise<void> {
  if (!soundsEnabled) return;

  const soundFile = SOUND_FILES[type];
  if (!soundFile) {
    // No sound file configured, just use haptic feedback instead
    return;
  }

  try {
    // Check cache first
    if (!soundCache[type]) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: soundFile },
        { shouldPlay: false }
      );
      soundCache[type] = sound;
    }

    await soundCache[type].setPositionAsync(0);
    await soundCache[type].playAsync();
  } catch (error) {
    console.error('Sound playback error:', error);
  }
}

// Combined feedback - haptic + sound
export async function feedback(
  hapticType: HapticType,
  soundType?: SoundType
): Promise<void> {
  const promises: Promise<void>[] = [haptic(hapticType)];

  if (soundType) {
    promises.push(playSound(soundType));
  }

  await Promise.all(promises);
}

// Pre-defined feedback combinations for common actions
export const Feedback = {
  // Button tap
  tap: () => haptic('light'),

  // Selection changed
  selection: () => haptic('selection'),

  // Action confirmed (save, submit)
  confirm: () => feedback('medium', 'success'),

  // Scan initiated
  scan: () => feedback('medium', 'scan'),

  // Scan success
  scanSuccess: () => feedback('success', 'success'),

  // Rare stamp found
  rareFind: () => feedback('rare_find', 'rare_find'),

  // Swipe action
  swipeLeft: () => haptic('light'),
  swipeRight: () => feedback('medium', 'favorite'),

  // Favorite toggled
  favorite: () => feedback('medium', 'favorite'),

  // Delete action
  delete: () => haptic('warning'),

  // Error occurred
  error: () => haptic('error'),

  // Share initiated
  share: () => haptic('light'),
};

// Utility function for delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Cleanup sounds when app is closing
export async function cleanupSounds(): Promise<void> {
  try {
    await Promise.all(
      Object.values(soundCache).map((sound) => sound.unloadAsync())
    );
  } catch (error) {
    console.error('Error cleaning up sounds:', error);
  }
}
