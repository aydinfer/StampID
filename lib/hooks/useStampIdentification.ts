import { useState, useCallback } from 'react';
import {
  identifyStamp,
  imageToBase64,
  StampIdentificationResult,
} from '../api/identify-stamp';

interface UseStampIdentificationReturn {
  identify: (imageUri: string) => Promise<StampIdentificationResult>;
  result: StampIdentificationResult | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for identifying stamps from images
 *
 * @example
 * const { identify, result, loading, error } = useStampIdentification();
 *
 * const handleCapture = async (uri: string) => {
 *   try {
 *     const result = await identify(uri);
 *     console.log('Identified:', result.name);
 *   } catch (err) {
 *     console.error('Failed:', err);
 *   }
 * };
 */
export function useStampIdentification(): UseStampIdentificationReturn {
  const [result, setResult] = useState<StampIdentificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const identify = useCallback(async (imageUri: string): Promise<StampIdentificationResult> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert image to base64
      const base64 = await imageToBase64(imageUri);

      // Call API
      const identificationResult = await identifyStamp({
        imageBase64: base64,
      });

      setResult(identificationResult);
      return identificationResult;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to identify stamp';
      setError(errorMessage);
      throw new Error(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    identify,
    result,
    loading,
    error,
    reset,
  };
}
