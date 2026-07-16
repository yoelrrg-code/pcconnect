// import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
// import Typography from '@mui/material/Typography';
import Logo from '../logo';
import { pulse } from '../../theme/effects';
// ----------------------------------------------------------------------

// const loadingTexts = [
//   'Loading section...',
//   'Preparing enviroment...',
//   'Syncing data...',
//   'Loading components...',
// ];

export default function LoadingScreen() {
  // const [textIndex, setTextIndex] = useState(0);

  // useEffect(() => {
  //   const textInterval = setInterval(() => {
  //     setTextIndex((prev) => (prev + 1) % loadingTexts.length);
  //   }, 1500);

  //   return () => clearInterval(textInterval);
  // }, []);

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
        animation: 'fadeIn 0.3s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 3
        }}
      >
        {/* Pulsing logo */}
        <Box
          sx={{
            mb: 3,
            animation: `${pulse} 1s infinite ease-in-out`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo disabledLink height={34} />
        </Box>

        {/* Text with dynamic messages */}
        {/* <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 600,
            letterSpacing: 0.5,
            color: 'text.secondary',
            minHeight: '24px',
            textAlign: 'center',
            // Transition effect for text changes
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          {loadingTexts[textIndex]}
        </Typography> */}

        {/* Modern styled progress bar */}
        <Box sx={{ width: 180 }}>
          <LinearProgress
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.06)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                backgroundImage: (theme) =>
                  `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
