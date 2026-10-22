import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppSettings, DEFAULT_APP_SETTINGS } from '../src/hooks/useAppSettings';

describe('useAppSettings Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('initializes with default settings when localStorage is empty', () => {
    const { result } = renderHook(() => useAppSettings());

    expect(result.current.settings).toEqual(DEFAULT_APP_SETTINGS);
    expect(result.current.settings.enableAnimations).toBe(true);
    expect(result.current.settings.showSavingsGoal).toBe(true);
    expect(result.current.settings.showCategories).toBe(true);
    expect(result.current.settings.enable3DBackground).toBe(true);
    expect(document.documentElement.classList.contains('no-motion')).toBe(false);
  });

  it('toggles settings and updates localStorage and documentElement class', () => {
    const { result } = renderHook(() => useAppSettings());

    act(() => {
      result.current.updateSetting('enableAnimations', false);
    });

    expect(result.current.settings.enableAnimations).toBe(false);
    expect(document.documentElement.classList.contains('no-motion')).toBe(true);

    const stored = JSON.parse(localStorage.getItem('dejung_app_settings_v1') || '{}');
    expect(stored.enableAnimations).toBe(false);

    act(() => {
      result.current.updateSetting('showSavingsGoal', false);
    });

    expect(result.current.settings.showSavingsGoal).toBe(false);
  });

  it('resets settings to defaults when resetSettings is called', () => {
    const { result } = renderHook(() => useAppSettings());

    act(() => {
      result.current.updateSetting('enableAnimations', false);
      result.current.updateSetting('showCategories', false);
    });

    expect(result.current.settings.enableAnimations).toBe(false);
    expect(result.current.settings.showCategories).toBe(false);

    act(() => {
      result.current.resetSettings();
    });

    expect(result.current.settings).toEqual(DEFAULT_APP_SETTINGS);
    expect(document.documentElement.classList.contains('no-motion')).toBe(false);
  });
});
