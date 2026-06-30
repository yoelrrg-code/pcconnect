import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import logoImg from '../../assets/logo.png';
import logoCompactImg from '../../assets/logo-small.svg';

// ----------------------------------------------------------------------

interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  compact?: boolean;
  height?: number;
}

export default function Logo({ disabledLink = false, compact = false, height, sx, ...other }: LogoProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const logo = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabledLink ? 'default' : 'pointer',
        ...sx,
      }}
      {...other}
    >
      <Box
        component="img"
        src={compact ? logoCompactImg : logoImg}
        alt="PC Connect Logo"
        sx={{
          height: height ?? (compact ? 40 : 40), // 40 height by default inside the app, custom height option
          width: 'auto',
          objectFit: 'contain',
          // Apply brightness filters in dark mode
          ...(isDark && {
            filter: 'brightness(1.8) contrast(1.2)',
          }),
          transition: 'all 0.2s ease',
        }}
      />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <a href="#" style={{ display: 'contents', textDecoration: 'none' }}>
      {logo}
    </a>
  );
}
export { Logo };
