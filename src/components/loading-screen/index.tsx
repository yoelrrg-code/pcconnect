import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Favicon from '../favicon';
import { pulse } from '../../theme/effects';

// ----------------------------------------------------------------------

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px',
        width: '100%',
        flexGrow: 1,
        // Smooth backdrop blur and fade-in
        animation: 'fadeIn 0.8s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Track circle (gray/white background) */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={100}
          thickness={2.5}
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
          }}
        />
        {/* Active spinning progress arc */}
        <CircularProgress
          variant="indeterminate"
          size={100}
          thickness={2.5}
          sx={{
            color: 'primary.main',
            position: 'absolute',
            left: 0,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        {/* Favicon in the center */}
        <Box sx={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `${pulse} 1s infinite ease-in-out`, }}>
          <Favicon disabledLink height={36} />
        </Box>
      </Box>
    </Box>
  );
}

