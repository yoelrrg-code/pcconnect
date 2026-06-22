export function px(value: number) {
  return `${value}px`;
}

export function responsiveFontSizes({ sm, md, lg }: { sm: number; md: number; lg: number }) {
  return {
    '@media (min-width:600px)': {
      fontSize: px(sm),
    },
    '@media (min-width:900px)': {
      fontSize: px(md),
    },
    '@media (min-width:1200px)': {
      fontSize: px(lg),
    },
  };
}

// ----------------------------------------------------------------------

const FONT_PRIMARY = 'Poppins, sans-serif';

export const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 800,
    lineHeight: 80 / 64,
    fontSize: px(40),
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 800,
    lineHeight: 64 / 48,
    fontSize: px(32),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 48 / 32,
    fontSize: px(24),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontWeight: 600,
    lineHeight: 36 / 22,
    fontSize: px(28),
    ...responsiveFontSizes({ sm: 18, md: 20, lg: 28 }), // Adjusted to be more balanced and not overly large
  },
  h5: {
    fontWeight: 700,
    lineHeight: 32 / 18,
    fontSize: px(16),
    ...responsiveFontSizes({ sm: 18, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 28 / 16,
    fontSize: px(14),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 16 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 24 / 16,
    fontSize: px(24),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 22 / 14,
    fontSize: px(14),
  },
  body1: {
    lineHeight: 24 / 16,
    fontSize: px(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: px(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: px(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: px(12),
    textTransform: 'uppercase' as const,
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: px(14),
    textTransform: 'unset' as const,
  },
};
