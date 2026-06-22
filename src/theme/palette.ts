import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorPresetId = 'default' | 'cyan' | 'blue' | 'purple' | 'orange' | 'red';

export interface ColorPreset {
  name: string;
  primary: {
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
      lighter: '#FEE7F2',
      light: '#E6007E',
      main: '#B4006E',
      dark: '#80004E',
      darker: '#4D002E',
      contrastText: '#FFFFFF',
    },
  },
  cyan: {
    name: 'Cyan',
    primary: {
      lighter: '#CAFDF5',
      light: '#61F3F3',
      main: '#00B8D9',
      dark: '#007896',
      darker: '#003749',
      contrastText: '#FFFFFF',
    },
  },
  blue: {
    name: 'Blue',
    primary: {
      lighter: '#D0E9FF',
      light: '#1890FF',
      main: '#2065D1',
      dark: '#103996',
      darker: '#061B64',
      contrastText: '#FFFFFF',
    },
  },
  purple: {
    name: 'Purple',
    primary: {
      lighter: '#E9D6FF',
      light: '#AE67FA',
      main: '#7635DC',
      dark: '#431A9E',
      darker: '#200A69',
      contrastText: '#FFFFFF',
    },
  },
  orange: {
    name: 'Orange',
    primary: {
      lighter: '#FFE9D5',
      light: '#FFC107',
      main: '#FDA92D',
      dark: '#B76E00',
      darker: '#7A4100',
      contrastText: '#1C252E',
    },
  },
  red: {
    name: 'Red',
    primary: {
      lighter: '#FFE5EC',
      light: '#FF6B8B',
      main: '#FF3030',
      dark: '#B71D3F',
      darker: '#7A092A',
      contrastText: '#FFFFFF',
    },
  },
};

// Colors
export const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
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
  divider: alpha(GREY[500], 0.2),
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
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: GREY[0],
      default: '#F4F4F6',
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
