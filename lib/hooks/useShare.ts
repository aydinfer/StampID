import { useRef, useCallback, useState } from 'react';
import { View, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import type { Stamp } from '../supabase/types';
import type { ShareCardStyle } from '@/components/share/ShareCard';

interface ShareOptions {
  stamp?: Stamp;
  style?: ShareCardStyle;
  title?: string;
  message?: string;
}

interface CollectionShareOptions {
  stampCount: number;
  totalValue: number;
  topStamps: Stamp[];
  title?: string;
  message?: string;
}

// Hook for sharing stamp cards
export function useShareStamp() {
  const cardRef = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const captureAndShare = useCallback(async (options: ShareOptions) => {
    if (!cardRef.current) {
      throw new Error('Card ref not set');
    }

    setIsCapturing(true);

    try {
      // Capture the card as an image
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      setIsCapturing(false);
      setIsSharing(true);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      // Generate share message
      const title = options.title || `Check out this stamp: ${options.stamp?.name || 'Unknown'}`;
      const message = options.message || generateShareMessage(options.stamp);

      // Share the image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: title,
        UTI: 'public.png', // iOS specific
      });

      setIsSharing(false);
      return true;
    } catch (error) {
      setIsCapturing(false);
      setIsSharing(false);
      throw error;
    }
  }, []);

  return {
    cardRef,
    isCapturing,
    isSharing,
    captureAndShare,
  };
}

// Hook for sharing collection summary
export function useShareCollection() {
  const cardRef = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const captureAndShare = useCallback(async (options: CollectionShareOptions) => {
    if (!cardRef.current) {
      throw new Error('Card ref not set');
    }

    setIsCapturing(true);

    try {
      // Capture the card as an image
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      setIsCapturing(false);
      setIsSharing(true);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      // Generate share message
      const title = options.title || 'My Stamp Collection';
      const message = options.message || generateCollectionMessage(options);

      // Share the image
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: title,
        UTI: 'public.png',
      });

      setIsSharing(false);
      return true;
    } catch (error) {
      setIsCapturing(false);
      setIsSharing(false);
      throw error;
    }
  }, []);

  return {
    cardRef,
    isCapturing,
    isSharing,
    captureAndShare,
  };
}

// Generate share message for a stamp
function generateShareMessage(stamp?: Stamp): string {
  if (!stamp) return 'Check out this stamp on StampID!';

  const parts: string[] = [];

  parts.push(`Found: ${stamp.name || 'Unknown Stamp'}`);

  if (stamp.country) {
    parts.push(`Country: ${stamp.country}`);
  }

  if (stamp.year_issued) {
    parts.push(`Year: ${stamp.year_issued}`);
  }

  const avgValue = ((stamp.estimated_value_low || 0) + (stamp.estimated_value_high || 0)) / 2;
  if (avgValue > 0) {
    parts.push(`Est. Value: $${avgValue.toFixed(2)}`);
  }

  parts.push('');
  parts.push('Identified with StampID');

  return parts.join('\n');
}

// Generate share message for collection
function generateCollectionMessage(options: CollectionShareOptions): string {
  const parts: string[] = [];

  parts.push('My Stamp Collection');
  parts.push(`${options.stampCount} stamps worth $${options.totalValue.toLocaleString()}`);
  parts.push('');
  parts.push('Built with StampID');

  return parts.join('\n');
}

// Determine best share card style based on stamp
export function getRecommendedShareStyle(stamp: Stamp): ShareCardStyle {
  // Rare or very rare stamps
  if (stamp.rarity === 'rare' || stamp.rarity === 'very_rare') {
    return 'rare_find';
  }

  // High value stamps
  const avgValue = ((stamp.estimated_value_low || 0) + (stamp.estimated_value_high || 0)) / 2;
  if (avgValue >= 100) {
    return 'rare_find';
  }

  // Favorite stamps
  if (stamp.is_favorite) {
    return 'collection_highlight';
  }

  // Default
  return 'default';
}
