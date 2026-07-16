import { keyframes } from '@mui/system';

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(0.76);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
  100% {
    transform: scale(0.76);
    opacity: 0.6;
  }
`;