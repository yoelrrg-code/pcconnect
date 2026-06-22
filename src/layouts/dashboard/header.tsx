import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { 
  Menu, 
  Settings as SettingsIcon,
  User
} from 'lucide-react';
import { Typography } from '@mui/material';


// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 100;

interface HeaderProps {
  onOpenNav: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  activeTab: string;
  navWidth?: number;
}

const TAB_TITLES: Record<string, string> = {
  '#dashboard': 'Hi, Welcome Back 👋',
  '#users-management': 'Users Management',
  '#insurance-payers': 'Insurance Payers',
  '#plaid': 'Plaid Integration',
  '#enrollment-dashboard': 'Enrollment Analytics',
  '#provider-management': 'Provider Management',
  '#client-management': 'Client Management',
  '#client-group': 'Client Groups',
  '#active-incomplete-cases': 'Active Incomplete Cases',
  '#ed-floor-visits': 'ED Floor Visits',
  '#educational-resources': 'Educational Resources',
  '#report-management': 'Report Management',
};

export default function Header({ onOpenNav, onOpenSettings, onLogout, activeTab, navWidth = 360 }: HeaderProps) {
  const theme = useTheme();
  const pageTitle = TAB_TITLES[activeTab] || 'Dashboard';

  return (
    <AppBar
      position="absolute"
      sx={{
        boxShadow: 'none',
        height: HEADER_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        background: 'transparent',
        borderBottom: 'none',
        transition: theme.transitions.create(['width', 'margin-left'], {
          duration: theme.transitions.duration.shorter,
        }),
        [theme.breakpoints.up('lg')]: {
          height: HEADER_DESKTOP,
          width: `calc(100% - ${navWidth}px)`,
          ml: `${navWidth}px`,
        },
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={onOpenNav}
            sx={{
              mr: 1,
              color: '#2B3445',
              display: { lg: 'none' },
            }}
          >
            <Menu size={22} />
          </IconButton>

          {/* Figma-Style Page Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 400,
              color: theme.palette.text.primary,
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: -0.5,
              display: { xs: 'block' },
            }}
          >
            {pageTitle}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Settings Icon */}
          <IconButton 
            onClick={onOpenSettings}
            sx={{ 
              animation: 'spin 12s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }}
          >
            <SettingsIcon size={20} />
          </IconButton>

          {/* Figma-Style User Outline Circular Icon */}
          <IconButton
            onClick={onLogout}
            title="Cerrar sesión"
            sx={{
              width: 38,
              height: 38,
              border: `2px solid ${alpha('#2B3445', 0.25)}`,
              p: 0.8,
              '&:hover': {
                bgcolor: alpha('#2B3445', 0.04),
                borderColor: '#2B3445',
              }
            }}
          >
            <User size={20} strokeWidth={2.2} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export { HEADER_MOBILE, HEADER_DESKTOP };
