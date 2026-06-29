import { alpha } from '@mui/material/styles';
import { colorPresets, GREY } from './palette';
import type { ColorPresetId } from './palette';

// ----------------------------------------------------------------------

export interface CustomShadows {
  z1: string;
  z4: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  //
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
  //
  card: string;
  dialog: string;
  dropdown: string;
}

export function getCustomShadows(mode: 'light' | 'dark', presetId: ColorPresetId = 'default'): CustomShadows {
  const color = mode === 'light' ? '#000000' : GREY[300];
  const activePrimary = colorPresets[presetId].primary;

  return {
    z1: `0 1px 2px 0 ${alpha(color, 0.04)}`,
    z4: `0 4px 8px 0 ${alpha(color, 0.04)}`,
    z8: `0 8px 16px 0 ${alpha(color, 0.08)}`,
    z12: `0 12px 24px -4px ${alpha(color, 0.12)}`,
    z16: `0 16px 32px -4px ${alpha(color, 0.16)}`,
    z20: `0 20px 40px -4px ${alpha(color, 0.2)}`,
    z24: `0 24px 48px -8px ${alpha(color, 0.24)}`,
    //
    primary: `0 8px 16px 0 ${alpha(activePrimary.main, 0.24)}`,
    secondary: `0 8px 16px 0 ${alpha('#8E33FF', 0.24)}`,
    info: `0 8px 16px 0 ${alpha('#00B8D9', 0.24)}`,
    success: `0 8px 16px 0 ${alpha('#22C55E', 0.24)}`,
    warning: `0 8px 16px 0 ${alpha('#FFAB00', 0.24)}`,
    error: `0 8px 16px 0 ${alpha('#FF5630', 0.24)}`,
    //
    card: mode === 'light' 
      ? `0 0px 24px 0px ${alpha(color, 0.15)}`
      : `0 0 2px 0 ${alpha('#000000', 0.4)}, 0 12px 24px -4px ${alpha('#000000', 0.24)}`,
    dialog: `-40px 40px 80px -8px ${alpha(color, 0.24)}`,
    dropdown: `0 12px 24px 0 ${alpha(color, 0.08)}, 0 0 2px 0 ${alpha(color, 0.1)}`,
  };
}
