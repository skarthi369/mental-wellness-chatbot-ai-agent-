import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'openrouter_api_key';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>('');

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      setApiKeyState(stored);
    }
  }, []);

  const setApiKey = (key: string) => {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
    setApiKeyState(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState('');
  };

  return {
    apiKey,
    setApiKey,
    clearApiKey,
    hasApiKey: !!apiKey,
  };
}
