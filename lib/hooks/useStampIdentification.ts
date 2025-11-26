import { useState, useCallback } from 'react';
import {
  identifyStamps,
  StampIdentificationResult,
  MultiStampResponse,
} from '../api/identify-stamp';

interface UseStampIdentificationReturn {
  identify: (imageUri: string) => Promise<MultiStampResponse>;
  result: StampIdentificationResult | null; // First/primary stamp
  results: StampIdentificationResult[];     // All stamps detected
  response: MultiStampResponse | null;      // Full API response
  totalStamps: number;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for identifying stamps from images
 * Supports single and multi-stamp detection
 *
 * @example
 * const { identify, results, totalStamps, loading, error } = useStampIdentification();
 *
 * const handleCapture = async (uri: string) => {
 *   try {
 *     const response = await identify(uri);
 *     console.log(`Found ${response.total_stamps_detected} stamps`);
 *     response.stamps.forEach(stamp => {
 *       console.log('Identified:', stamp.name);
 *     });
 *   } catch (err) {
 *     console.error('Failed:', err);
 *   }
 * };
 */
export function useStampIdentification(): UseStampIdentificationReturn {
  const [response, setResponse] = useState<MultiStampResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const identify = useCallback(async (imageUri: string): Promise<MultiStampResponse> => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Image compression is handled internally by identifyStamps
      const apiResponse = await identifyStamps({ imageUri });

      setResponse(apiResponse);
      return apiResponse;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to identify stamp';
      setError(errorMessage);
      throw new Error(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    identify,
    result: response?.stamps[0] ?? null,
    results: response?.stamps ?? [],
    response,
    totalStamps: response?.total_stamps_detected ?? 0,
    loading,
    error,
    reset,
  };
}
