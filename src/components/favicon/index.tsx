import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import faviconImg from '../../assets/favicon.svg';

// ----------------------------------------------------------------------

interface FaviconProps extends BoxProps {
  disabledLink?: boolean;
  height?: number;
}

export default function Favicon({ disabledLink = false, height, sx, ...other }: FaviconProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const favicon = (
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
        src={faviconImg}
        alt="PC Connect Logo"
        sx={{
          height: height ?? 34, // 40 height by default inside the app, custom height option
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
    return favicon;
  }

  return (
    <a href="#" style={{ display: 'contents', textDecoration: 'none' }}>
      {favicon}
    </a>
  );
}
export { Favicon };
