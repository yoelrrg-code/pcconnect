import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { styled, alpha } from '@mui/material/styles';
import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

const StyledRoot = styled(ScrollAreaPrimitive.Root)(() => ({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledViewport = styled(ScrollAreaPrimitive.Viewport)(() => ({
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
  '& > div': {
    display: 'block !important',
  },
}));

const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar)(({ theme }) => ({
  display: 'flex',
  userSelect: 'none',
  touchAction: 'none',
  padding: 2,
  background: 'transparent',
  transition: 'background 160ms ease-out',
  zIndex: 10,
  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.05),
  },
  '&[data-orientation="vertical"]': {
    width: 8,
  },
  '&[data-orientation="horizontal"]': {
    flexDirection: 'column',
    height: 8,
  },
}));

const StyledThumb = styled(ScrollAreaPrimitive.Thumb)(({ theme }) => ({
  flex: 1,
  background: alpha(theme.palette.text.primary, 0.25),
  borderRadius: 4,
  position: 'relative',
  transition: 'background 160ms ease-out',
  '&:hover': {
    background: alpha(theme.palette.text.primary, 0.45),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
}));

const StyledCorner = styled(ScrollAreaPrimitive.Corner)(() => ({
  background: 'transparent',
}));

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  children: React.ReactNode;
  sx?: BoxProps['sx'];
  viewportRef?: React.Ref<HTMLDivElement>;
}

export function ScrollArea({ children, sx, viewportRef, ...props }: ScrollAreaProps) {
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', ...sx }}>
      <StyledRoot {...props}>
        <StyledViewport ref={viewportRef}>
          {children}
        </StyledViewport>
        <StyledScrollbar orientation="vertical">
          <StyledThumb />
        </StyledScrollbar>
        <StyledScrollbar orientation="horizontal">
          <StyledThumb />
        </StyledScrollbar>
        <StyledCorner />
      </StyledRoot>
    </Box>
  );
}

export default ScrollArea;
