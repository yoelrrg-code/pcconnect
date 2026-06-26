import { 
  Box, 
  Drawer, 
  IconButton, 
  Typography, 
  Divider, 
  Button
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { X, Sun, Moon, LogOut } from 'lucide-react';
import { useSettings } from './settings-context';
// ----------------------------------------------------------------------

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingsDrawer({ open, onClose, onLogout }: SettingsDrawerProps) {
  const theme = useTheme();
  const { themeMode, onToggleMode } = useSettings();

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
          Configuración Visual
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>
        {/* Mode Toggler */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1.5, display: 'block' }}>
          MODO DE TEMA
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 4 }}>
          <Button
            variant={themeMode === 'light' ? 'outlined' : 'text'}
            onClick={() => themeMode === 'dark' && onToggleMode()}
            sx={{
              py: 2,
              flexDirection: 'column',
              gap: 1,
              borderRadius: 1.5,
              color: themeMode === 'light' ? 'primary.main' : 'text.secondary',
              borderColor: themeMode === 'light' ? 'primary.main' : 'divider',
              bgcolor: themeMode === 'light' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&:hover': {
                bgcolor: themeMode === 'light' ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.grey[500], 0.08),
              }
            }}
          >
            <Sun size={24} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Claro</Typography>
          </Button>

          <Button
            variant={themeMode === 'dark' ? 'outlined' : 'text'}
            onClick={() => themeMode === 'light' && onToggleMode()}
            sx={{
              py: 2,
              flexDirection: 'column',
              gap: 1,
              borderRadius: 1.5,
              color: themeMode === 'dark' ? 'primary.main' : 'text.secondary',
              borderColor: themeMode === 'dark' ? 'primary.main' : 'divider',
              bgcolor: themeMode === 'dark' ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&:hover': {
                bgcolor: themeMode === 'dark' ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.grey[500], 0.08),
              }
            }}
          >
            <Moon size={24} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Oscuro</Typography>
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onLogout}
          startIcon={<LogOut size={18} />}
          sx={{ 
            mt: 1.5, 
            py: 1, 
            fontWeight: 600, 
            color: theme.palette.primary.lighter,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.lighter
            }
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Drawer>
  );
}
export { SettingsDrawer };
