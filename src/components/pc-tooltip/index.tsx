import { alpha, styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import type { TooltipProps } from '@mui/material/Tooltip';
import { tooltipClasses } from '@mui/material/Tooltip';

// ----------------------------------------------------------------------

const PCTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip describeChild {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '7px 13px',
    backgroundColor: alpha('#000000', 0.7),
    fontSize: 12,
    fontWeight: 600,
  },
}));

export default PCTooltip;
