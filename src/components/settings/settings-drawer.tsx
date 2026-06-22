import { 
  Box, 
  Drawer, 
  IconButton, 
  Typography, 
  Divider, 
  Button
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { X, Sun, Moon, Check } from 'lucide-react';
import { useSettings } from './settings-context';
import { colorPresets } from '../../theme/palette';
import type { ColorPresetId } from '../../theme/palette';

// ----------------------------------------------------------------------

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const theme = useTheme();
  const { themeMode, themeColorPreset, onToggleMode, onChangeColorPreset } = useSettings();

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
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Configuración Visual
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X size={18} />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>
        {/* Mode Toggler */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1.5, display: 'block' }}>
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
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Claro</Typography>
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
            <Typography variant="caption" sx={{ fontWeight: 700 }}>Oscuro</Typography>
          </Button>
        </Box>

        {/* Color Presets */}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 1.5, display: 'block' }}>
          COLORES CORPORATIVOS
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          {(Object.keys(colorPresets) as ColorPresetId[]).map((key) => {
            const preset = colorPresets[key];
            const isSelected = themeColorPreset === key;

            return (
              <Button
                key={key}
                onClick={() => onChangeColorPreset(key)}
                sx={{
                  py: 1.5,
                  borderRadius: 1.5,
                  flexDirection: 'column',
                  gap: 0.5,
                  border: `1px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.8)}`,
                  bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                  color: isSelected ? 'text.primary' : 'text.secondary',
                  '&:hover': {
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.grey[500], 0.08),
                  }
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: preset.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                  }}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 700, mt: 0.5 }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
              </Button>
            );
          })}
        </Box>
      </Box>

      <Divider />

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            onChangeColorPreset('default');
            if (themeMode === 'light') onToggleMode();
          }}
          sx={{ py: 1, fontWeight: 700 }}
        >
          Restablecer Valores
        </Button>
      </Box>
    </Drawer>
  );
}
export { SettingsDrawer };
