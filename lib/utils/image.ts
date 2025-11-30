// Image compression and manipulation utilities
import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.7,
};

/**
 * Compress and resize an image for API upload
 * Reduces file size significantly while maintaining quality for AI identification
 */
export async function compressImage(
  uri: string,
  options: CompressionOptions = {}
): Promise<{ uri: string; base64?: string }> {
  const { maxWidth, maxHeight, quality } = { ...DEFAULT_OPTIONS, ...options };

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: {
          width: maxWidth,
          height: maxHeight,
        },
      },
    ],
    {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    }
  );

  return {
    uri: result.uri,
    base64: result.base64,
  };
}

/**
 * Compress image and return base64 for API upload
 * Optimized for stamp identification (square aspect, moderate quality)
 */
export async function prepareImageForUpload(uri: string): Promise<string> {
  const { base64 } = await compressImage(uri, {
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.75,
  });

  if (!base64) {
    throw new Error('Failed to compress image');
  }

  return base64;
}

/**
 * Get estimated file size from base64 string (in KB)
 */
export function getBase64SizeKB(base64: string): number {
  // Base64 encoding increases size by ~33%, decode to get actual size
  const padding = (base64.match(/=/g) || []).length;
  const bytes = (base64.length * 3) / 4 - padding;
  return Math.round(bytes / 1024);
}
