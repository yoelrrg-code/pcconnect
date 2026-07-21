import type { ButtonProps } from '@mui/material';

import { Button } from '@mui/material';
import { LogOut } from 'lucide-react';

import { signOut } from '../../auth/context/jwt/action';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const handleLogout = async () => {
    try {
      await signOut();
      onClose?.();
      // Reload to reset the app state
      window.location.reload();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <Button
      fullWidth
      variant="signIn"
      size="large"
      color="error"
      onClick={handleLogout}
      startIcon={<LogOut size={18} />}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
