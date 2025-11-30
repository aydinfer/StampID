// Stamp Identification API Client
// Calls your secure backend which then calls OpenRouter
// API key is ONLY on the backend, never in this app

import { API_CONFIG } from './config';
import { supabase } from '../supabase/client';
import { prepareImageForUpload, getBase64SizeKB } from '../utils/image';

// Bounding box for stamp location in image
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  normalized: boolean; // true = 0-1 range, false = pixels
}

// Single stamp identification result
export interface StampIdentificationResult {
  identified: boolean;
  confidence: number;
  name: string;
  country: string | null;
  year_issued: number | null;
  catalog_number: string | null;
  denomination: string | null;
  category: 'definitive' | 'commemorative' | 'airmail' | 'special' | 'other' | null;
  theme: string | null;
  condition: 'mint' | 'mint_hinged' | 'used' | 'damaged' | null;
  condition_notes: string | null;
  estimated_value_low: number | null;
  estimated_value_high: number | null;
  currency: string;
  description: string | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | null;
  bounding_box?: BoundingBox | null;
  error?: string;
}

// Multi-stamp API response
export interface MultiStampResponse {
  stamps: StampIdentificationResult[];
  total_stamps_detected: number;
  image_quality: 'good' | 'fair' | 'poor' | 'unknown';
  suggestions?: string | null;
  model_used?: string;
  error?: string;
}

interface IdentifyStampParams {
  imageUri: string;     // Local file URI
  imageBase64?: string; // Pre-encoded base64 (optional)
  imageUrl?: string;    // Remote URL (optional)
}

/**
 * Identify stamps in an image using AI
 * Supports multiple stamps in a single image
 * Automatically compresses image before upload
 */
export async function identifyStamps(
  params: IdentifyStampParams
): Promise<MultiStampResponse> {
  const { imageUri, imageBase64, imageUrl } = params;

  // Validate input
  if (!imageUri && !imageBase64 && !imageUrl) {
    throw new Error('imageUri, imageBase64, or imageUrl is required');
  }

  // Compress and prepare image for upload
  let base64Data: string;
  if (imageBase64) {
    base64Data = imageBase64;
  } else if (imageUri) {
    base64Data = await prepareImageForUpload(imageUri);
    console.log(`Image compressed to ${getBase64SizeKB(base64Data)}KB`);
  } else {
    base64Data = '';
  }

  // Check if API URL is configured
  if (!API_CONFIG.IDENTIFY_STAMP_URL) {
    // Fallback: Try Supabase RPC if no external API configured
    const result = await identifyViaSupabase(base64Data);
    return {
      stamps: [result],
      total_stamps_detected: 1,
      image_quality: 'good',
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    const response = await fetch(API_CONFIG.IDENTIFY_STAMP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({
        image_base64: base64Data,
        image_url: imageUrl,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const result: MultiStampResponse = await response.json();

    // Handle legacy single-stamp response
    if (!result.stamps && (result as any).identified !== undefined) {
      return {
        stamps: [result as unknown as StampIdentificationResult],
        total_stamps_detected: 1,
        image_quality: 'good',
      };
    }

    return result;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

/**
 * Legacy function for single stamp identification
 * @deprecated Use identifyStamps() instead
 */
export async function identifyStamp(
  params: { imageBase64?: string; imageUrl?: string }
): Promise<StampIdentificationResult> {
  const response = await identifyStamps({
    imageUri: '',
    imageBase64: params.imageBase64,
    imageUrl: params.imageUrl,
  });

  if (response.stamps.length > 0) {
    return response.stamps[0];
  }

  return {
    identified: false,
    confidence: 0,
    name: 'No stamp detected',
    country: null,
    year_issued: null,
    catalog_number: null,
    denomination: null,
    category: null,
    theme: null,
    condition: null,
    condition_notes: null,
    estimated_value_low: null,
    estimated_value_high: null,
    currency: 'USD',
    description: null,
    rarity: null,
  };
}

/**
 * Fallback: Call Supabase RPC function
 */
async function identifyViaSupabase(imageBase64: string): Promise<StampIdentificationResult> {
  const { data, error } = await supabase.rpc('identify_stamp', {
    image_base64: imageBase64,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as StampIdentificationResult;
}

/**
 * Get auth headers for API requests
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    return {
      'Authorization': `Bearer ${session.access_token}`,
    };
  }

  return {};
}

/**
 * Convert image URI to base64
 * @deprecated Use prepareImageForUpload() from lib/utils/image.ts instead
 */
export async function imageToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
