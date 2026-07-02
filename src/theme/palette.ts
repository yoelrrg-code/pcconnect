import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorPresetId = 'default';

export interface ColorPreset {
  name: string;
  primary: {
    hover: string;
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
    contrastText: string;
  };
}

export const colorPresets: Record<ColorPresetId, ColorPreset> = {
  default: {
    name: 'Magenta (Corporate)',
    primary: {
      hover: '#FDEEF7',
      lighter: '#FEE7F2',
      light: '#D01A8E',
      main: '#B81A80',
      dark: '#80004E',
      darker: '#4D002E',
      contrastText: '#FFFFFF',
    },
  },
};

// Colors
export const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#F4F4F6',
  400: '#90949C',
  500: '#DCDCDC',
  600: '#637381',
  700: '#30394A',
  800: '#737373',
  900: '#30394A',
};

export const PRIMARY = colorPresets.default.primary;

export const SECONDARY = {
  lighter: '#FFF8E7',
  light: '#FFC84B',
  main: '#E4A11B',
  dark: '#A16F00',
  darker: '#6A4600',
  contrastText: '#FFFFFF',
};

export const INFO = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#007896',
  darker: '#003749',
  contrastText: '#FFFFFF',
};

export const SUCCESS = {
  lighter: '#D3F9D8',
  light: '#77ED8B',
  main: '#22C55E',
  dark: '#118D57',
  darker: '#065E49',
  contrastText: '#FFFFFF',
};

export const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: '#1C252E',
};

export const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const COMMON = {
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: GREY[500],
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export function getPalette(mode: 'light' | 'dark', presetId: ColorPresetId = 'default') {
  const activePrimary = colorPresets[presetId].primary;

  const lightPalette = {
    ...COMMON,
    mode: 'light' as const,
    primary: activePrimary,
    text: {
      primary: GREY[700],
      secondary: GREY[800],
      disabled: GREY[400],
    },
    background: {
      paper: GREY[0],
      default: GREY[300],
      neutral: GREY[200],
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const darkPalette = {
    ...COMMON,
    mode: 'dark' as const,
    primary: activePrimary,
    text: {
      primary: GREY[0],
      secondary: GREY[400],
      disabled: GREY[600],
    },
    background: {
      paper: '#161C24',
      default: '#0C1017', // Elegant deeper dark theme background
      neutral: alpha(GREY[500], 0.12),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  };

  return mode === 'light' ? lightPalette : darkPalette;
}
