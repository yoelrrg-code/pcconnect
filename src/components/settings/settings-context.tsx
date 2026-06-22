import { createContext, useContext } from 'react';
import type { ColorPresetId } from '../../theme/palette';

// ----------------------------------------------------------------------

export interface SettingsContextType {
  themeMode: 'light' | 'dark';
  themeColorPreset: ColorPresetId;
  onToggleMode: () => void;
  onChangeColorPreset: (preset: ColorPresetId) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
