// Stamp Identification API Client
// Calls your secure backend which then calls OpenRouter
// API key is ONLY on the backend, never in this app

import { API_CONFIG } from './config';
import { supabase } from '../supabase/client';

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
  model_used?: string;
  error?: string;
}

interface IdentifyStampParams {
  imageBase64: string; // Base64 encoded image (with or without data: prefix)
  imageUrl?: string;   // Alternative: URL to image
}

/**
 * Identify a stamp using AI
 * Sends image to secure backend which calls OpenRouter
 */
export async function identifyStamp(
  params: IdentifyStampParams
): Promise<StampIdentificationResult> {
  const { imageBase64, imageUrl } = params;

  // Validate input
  if (!imageBase64 && !imageUrl) {
    throw new Error('Either imageBase64 or imageUrl is required');
  }

  // Check if API URL is configured
  if (!API_CONFIG.IDENTIFY_STAMP_URL) {
    // Fallback: Try Supabase RPC if no external API configured
    return identifyViaSupabase(imageBase64 || '');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    const response = await fetch(API_CONFIG.IDENTIFY_STAMP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include auth token if user is logged in
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({
        image_base64: imageBase64,
        image_url: imageUrl,
        model: API_CONFIG.AI_MODEL,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const result = await response.json();
    return result as StampIdentificationResult;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
}

/**
 * Fallback: Call Supabase RPC function
 * Useful if you set up the database function approach
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
 * Works with both file:// URIs and http:// URLs
 */
export async function imageToBase64(uri: string): Promise<string> {
  // For React Native, we'll use fetch to get the blob
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

/**
 * Compress and resize image before sending
 * Reduces bandwidth and API costs
 */
export function compressImageUri(uri: string, maxWidth = 1024): Promise<string> {
  // This would use expo-image-manipulator in a real implementation
  // For now, return the original URI
  return Promise.resolve(uri);
}
