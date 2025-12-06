import { useState, useEffect, useCallback } from 'react';
import { audioEngineAdapter } from '../../../core/adapters/AudioEngineAdapter';

export const useAudioContext = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we are in the browser
    if (typeof window !== 'undefined') {
      setIsReady(true);
    }
  }, []);

  const resume = useCallback(async () => {
    if (!isReady) return;
    try {
      await audioEngineAdapter.resume();
    } catch (err) {
      console.error('Failed to resume audio context:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [isReady]);

  return {
    isReady,
    resume,
    error,
    audioEngine: audioEngineAdapter
  };
};