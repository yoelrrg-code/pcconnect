import { useTheme } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { 
  Menu, 
} from 'lucide-react';
import { Typography } from '@mui/material';
import { fadeInUp } from '../../theme/effects';

const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6406 0.258582C6.58508 1.57477 1.93122 6.14212 0.362104 12.3091C-0.11479 14.1841 -0.121776 17.7472 0.347948 19.6713C0.812157 21.5726 2.4572 24.8496 3.63988 26.2289C6.94284 30.0808 11.0849 32.0079 16.0437 32C20.5251 31.9926 24.2055 30.4756 27.3566 27.3364C30.4438 24.2608 32 20.4582 32 15.9902C32 13.0761 31.6498 11.5882 30.3322 8.90407C28.1137 4.38512 24.1132 1.25156 19.289 0.253981C17.6421 -0.086523 14.2174 -0.0843144 12.6406 0.258582ZM19.8662 3.73227C21.9159 4.38586 23.4915 5.35914 25.1097 6.97148C29.0055 10.853 29.9488 17.0167 27.391 21.8771C27.0439 22.5367 26.5633 23.3219 26.3232 23.6219L25.8864 24.1677L25.1595 23.686C19.3125 19.8121 12.4058 19.9108 6.50235 23.9523C6.05229 24.2604 5.60684 23.7896 4.70397 22.0519C2.79548 18.3795 2.69786 13.9006 4.45045 10.4061C6.31317 6.6919 9.34404 4.3161 13.4316 3.36637C15.0942 2.98004 18.0303 3.14697 19.8662 3.73227ZM14.167 7.57518C11.9206 8.49344 10.6219 10.179 10.4432 12.409C10.3087 14.0858 10.7444 15.3674 11.8664 16.5967C13.0691 17.914 14.2635 18.4494 16.0055 18.452C18.1892 18.4553 19.9637 17.3581 21.0285 15.346C21.4451 14.5592 21.6566 14.199 21.6569 12.8613C21.6573 11.5858 21.439 11.1508 21.0971 10.5063C19.9929 8.42515 18.4745 7.46217 16.1893 7.3937C15.3458 7.36848 14.4834 7.44579 14.167 7.57518ZM16.8909 10.6756C17.9614 11.2274 18.1225 11.6358 18.316 12.3555C18.6924 13.7549 17.5018 15.254 16.0139 15.254C14.4481 15.254 13.5517 14.1467 13.6787 12.3693C13.7406 11.5035 14.5417 10.8613 15.0712 10.6469C15.6227 10.4236 16.4267 10.4363 16.8909 10.6756ZM19.1082 24.4509C19.8864 24.6502 21.1934 25.1625 22.0126 25.5891L23.5021 26.3649L22.9712 26.7914C22.6791 27.026 21.8304 27.4729 21.0851 27.7845C17.0709 29.4629 12.7847 29.1414 9.2216 26.8941L8.50442 26.4418L9.31352 25.9454C12.1541 24.2021 15.9025 23.6302 19.1082 24.4509Z" fill="currentColor"/>
  </svg>
);

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 110;

interface HeaderProps {
  onOpenNav: () => void;
  onOpenSettings: () => void;
  activeTab: string;
  navWidth?: number;
}

const TAB_TITLES: Record<string, string> = {
  '#dashboard': 'Hi, Welcome Back 👋',
  '#users-management': 'Users Management',
  '#insurance-payers': 'Insurance Payers',
  '#plaid': 'Plaid Integration',
  '#enrollment-dashboard': 'Enrollment Dashboard',
  '#provider-management': 'Enrollment Management',
  '#client-management': 'Client Management',
  '#client-profile': 'Client Profile',
  '#client-group': 'Client Groups',
  '#active-incomplete-cases': 'Active Incomplete Cases',
  '#ed-floor-visits': 'ED Floor Visits',
  '#educational-resources': 'Educational Resources',
  '#report-management': 'Report Management',
};

export default function Header({ onOpenNav, onOpenSettings, /*onLogout,*/ activeTab, navWidth = 360 }: HeaderProps) {
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
        key={activeTab}
        sx={{
          height: 1,
          ml: { lg: 7.5 },
          mr: { lg: 6 },
          p: { lg: 0, md: 0.5, sm: 0.5, xs: 0.5 },
          pr: { lg: 0, md: 2, sm: 2, xs: 2 },
          justifyContent: 'space-between',
          borderBottom: activeTab === '#dashboard' ? `1px solid ${theme.palette.divider}` : 'none',
          opacity: 0,
          animation: `${fadeInUp} 0.5s cubic-bezier(0.215, 0.610, 0.355, 1) forwards`,
          animationDelay: '450ms', // Puedes ajustar este valor (ej. 200ms, 300ms, etc.)
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: 2, 
        }}>
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
            variant="h1"
            sx={{
              color: theme.palette.text.primary,
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
            title="Mi cuenta"
            sx={{
              width: 38,
              height: 38,
              p: 0,
              color: '#737373',
              transition: theme.transitions.create(['color', 'background-color'], {
                duration: theme.transitions.duration.shorter,
              }),
              '&:hover': {
                color: 'primary.main',
              }
            }}
          >
            <UsersIcon/>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export { HEADER_MOBILE, HEADER_DESKTOP };
