import { useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  enableAnimations: boolean;
  showSavingsGoal: boolean;
  showCategories: boolean;
  enable3DBackground: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  enableAnimations: true,
  showSavingsGoal: true,
  showCategories: true,
  enable3DBackground: true,
};

const STORAGE_KEY = 'dejung_app_settings_v1';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            enableAnimations: parsed.enableAnimations !== false,
            showSavingsGoal: parsed.showSavingsGoal !== false,
            showCategories: parsed.showCategories !== false,
            enable3DBackground: parsed.enable3DBackground !== false,
          };
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_APP_SETTINGS;
  });

  // Sync to localStorage and HTML class
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      }
      if (settings.enableAnimations) {
        document.documentElement.classList.remove('no-motion');
      } else {
        document.documentElement.classList.add('no-motion');
      }
    } catch {
      // ignore
    }
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_APP_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}
