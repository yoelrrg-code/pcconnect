import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSettings } from '../components/settings/settings-context';
import { getPalette } from './palette';
import { typography } from './typography';
import { lightShadows, darkShadows } from './shadows';
import { getCustomShadows } from './custom-shadows';
import type { CustomShadows } from './custom-shadows';

// ----------------------------------------------------------------------

// Extend MUI theme to include custom shadows and palette colors
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
  }
}

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { themeMode, themeColorPreset } = useSettings();

  const themeOptions = useMemo<ThemeOptions>(() => {
    const palette = getPalette(themeMode, themeColorPreset);
    const shadows = themeMode === 'light' ? lightShadows : darkShadows;
    const customShadows = getCustomShadows(themeMode, themeColorPreset);

    return {
      palette,
      typography,
      shadows,
      customShadows,
      shape: { borderRadius: 8 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            '*': {
              boxSizing: 'border-box',
            },
            html: {
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              WebkitOverflowScrolling: 'touch',
            },
            body: {
              margin: 0,
              padding: 0,
              width: '100%',
              height: '100%',
              fontFamily: 'Poppins, sans-serif',
              backgroundColor: palette.background.default,
              color: palette.text.primary,
              transition: 'background-color 0.2s ease, color 0.2s ease',
            },
            '#root': {
              width: '100%',
              height: '100%',
            },
            /* Custom Scrollbar */
            '::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '::-webkit-scrollbar-track': {
              background: palette.background.default,
            },
            '::-webkit-scrollbar-thumb': {
              background: themeMode === 'light' ? '#DFE3E8' : '#454F5B',
              borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb:hover': {
              background: themeMode === 'light' ? '#C4CDD5' : '#637381',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: customShadows.card,
              borderRadius: 16,
              position: 'relative',
              zIndex: 0, // Fixes Safari overflow: hidden with border-radius
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            },
          },
        },
        MuiCardHeader: {
          styleOverrides: {
            root: {
              padding: '24px 24px 0px 24px',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              fontWeight: 600,
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: 8,
            },
            containedPrimary: {
              boxShadow: customShadows.primary,
              '&:hover': {
                boxShadow: 'none',
              },
            },
            containedSecondary: {
              boxShadow: customShadows.secondary,
              '&:hover': {
                boxShadow: 'none',
              },
            },
          },
        },
        MuiPaper: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    };
  }, [themeMode, themeColorPreset]);

  const theme = createTheme(themeOptions);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
export { ThemeProvider };
