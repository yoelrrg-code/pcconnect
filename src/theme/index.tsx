import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import type { ThemeOptions, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSettings } from '../components/settings/settings-context';
import { getPalette } from './palette';
import { typography } from './typography';
import { lightShadows, darkShadows } from './shadows';
import { getCustomShadows } from './custom-shadows';
import type { CustomShadows } from './custom-shadows';
import { getComponents } from './overrides';

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
    hover: string;
    lighter: string;
    darker: string;
  }
  interface SimplePaletteColorOptions {
    hover?: string;
    lighter?: string;
    darker?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    toolbar: true;
    signIn: true;
    signInV2: true;
    modalAdd: true;
    modalCancel: true;
  }
}

declare module '@mui/material/InputBase' {
  interface InputBaseProps {
    variant?: 'cellEdit' | 'cellEditLarge';
  }
  interface InputBasePropsVariantOverrides {
    cellEdit: true;
    cellEditLarge: true;
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
      components: getComponents(themeMode, palette as unknown as Theme['palette'], customShadows),
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
