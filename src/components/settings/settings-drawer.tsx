import { 
  Box, 
  Drawer, 
  IconButton, 
  Typography, 
  Divider, 
  Button
} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import { X, LogOut } from 'lucide-react';
// ----------------------------------------------------------------------

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingsDrawer({ open, onClose, onLogout }: SettingsDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 360,
            bgcolor: 'background.default',
            boxShadow: theme.customShadows.dialog,
            display: 'flex',
            flexDirection: 'column',
          },
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, px: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Ajustes
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }} />

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="signIn"
          onClick={onLogout}
          startIcon={<LogOut size={18} />}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
}
export { SettingsDrawer };
