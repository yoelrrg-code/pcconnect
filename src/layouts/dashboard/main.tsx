import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { HEADER_DESKTOP, HEADER_MOBILE } from './header';

// ----------------------------------------------------------------------

interface MainProps extends BoxProps {
  children: ReactNode;
  navWidth?: number; // Add dynamic width prop
}

export default function Main({ children, navWidth = 360, sx, ...other }: MainProps) {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minWidth: 0,
        py: `${HEADER_MOBILE + 24}px`,
        px: 2,
        mb: 0,
        transition: theme.transitions.create(['width', 'margin-left'], {
          duration: theme.transitions.duration.shorter,
        }),
        [theme.breakpoints.up('lg')]: {
          py: `${HEADER_DESKTOP}px`,
          mb: 0,
          pb: 0,
          pl: 7.5,
          pr: 6,
          width: `calc(100% - ${navWidth}px)`,
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
