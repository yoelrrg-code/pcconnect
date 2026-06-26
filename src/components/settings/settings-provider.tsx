import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ColorPresetId } from '../../theme/palette';
import { SettingsContext } from './settings-context';

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to dark mode for rich premium look
    return 'light';
  });

  const [themeColorPreset, setThemeColorPreset] = useState<ColorPresetId>(() => {
    const saved = localStorage.getItem('themeColorPreset');
    if (saved) return saved as ColorPresetId;
    return 'default';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('themeColorPreset', themeColorPreset);
  }, [themeColorPreset]);

  const onToggleMode = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const onChangeColorPreset = (preset: ColorPresetId) => {
    setThemeColorPreset(preset);
  };

  return (
    <SettingsContext.Provider
      value={{
        themeMode,
        themeColorPreset,
        onToggleMode,
        onChangeColorPreset,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
