import { 
  alpha,
  Box, 
  Drawer, 
  IconButton, 
  Avatar,
  // MenuItem,
  // MenuList,
  // Link, 
  Typography
} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import { X } from 'lucide-react';
import { SignOutButton } from '../signout-button';

import type { IconButtonProps } from '@mui/material/IconButton';
import { useAuthContext } from '../../auth/hooks/use-auth-context';

// ----------------------------------------------------------------------

export type SettingsDrawerProps = IconButtonProps & {
  open: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
}

export default function SettingsDrawer({ open, onClose, /* onNavigate, data = []  */ }: SettingsDrawerProps) {
  const theme = useTheme();
  const { user } = useAuthContext();
  const displayName = user ? `${user.firstName} ${user.lastName}` : '';
  const userName = user ? `${user.userName}` : '';

  // const renderList = () => (
  //   <MenuList
  //     disablePadding
  //     sx={[
  //       (theme) => ({
  //         py: 1,
  //         px: 0,
  //         borderTop: `dashed 1px ${theme.palette.divider}`,
  //         borderBottom: `dashed 1px ${theme.palette.divider}`,
  //         '& li': { p: 0 },
  //       }),
  //     ]}
  //   >
  //     {data.map((option) => {
  //       const rootLabel = 'Home';
  //       const rootHref = '#dashboard';
  //       const targetHref = option.label === 'Home' ? rootHref : option.href;

  //       return (
  //         <MenuItem key={option.label}>
  //           <Link
  //             href={targetHref}
  //             color="inherit"
  //             underline="none"
  //             onClick={(e) => {
  //               e.preventDefault();
  //               onNavigate?.(targetHref);
  //               onClose();
  //             }}
  //             sx={{
  //               p: 1,
  //               width: 1,
  //               display: 'flex',
  //               typography: 'body2',
  //               alignItems: 'center',
  //               color: 'text.secondary',
  //               '& svg': { width: 24, height: 24 },
  //               '&:hover': { color: 'text.primary' },
  //             }}
  //           >
  //             {option.icon}

  //             <Box component="span" sx={{ ml: 2 }}>
  //               {option.label === 'Home' ? rootLabel : option.label}
  //             </Box>

  //             {option.info && (
  //               <Box sx={{ ml: 1 }}>
  //                 {option.info}
  //               </Box>
  //             )}
  //           </Link>
  //         </MenuItem>
  //       );
  //     })}
  //   </MenuList>
  // );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'transparent',
          },
        },
        paper: {
          sx: {
            width: 360,
            bgcolor: alpha(theme.palette.background.default, 0.8),
            boxShadow: theme.customShadows.dialog,
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
          },
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, px: 2.5 }}>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Avatar alt={displayName} sx={{ width: 60, height: 60 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Typography variant="subtitle1" align='center' noWrap sx={{ mt: 2, mb: 0 }}>
          {displayName}
        </Typography>
        <Typography variant="subtitle2" align='center' noWrap sx={{ mt: 1, mb: 4 }}>
          {userName}
        </Typography>

        {/* {renderList()} */}
      </Box>
      

      <Box sx={{ p: 2.5 }}>
        <SignOutButton
          fullWidth
          variant="signIn"
          onClose={onClose}
        />
      </Box>
    </Drawer>
  );
}
export { SettingsDrawer };
