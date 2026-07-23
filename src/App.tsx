import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { SettingsProvider } from './components/settings/settings-provider';
import { ThemeProvider } from './theme';
import DashboardLayout from './layouts/dashboard';
import AppView from './sections/overview/view/app-view';
import LoginView from './sections/auth/login-view';
import SettingsDrawer from './components/settings/settings-drawer';
import ActiveIncompleteCasesView from './sections/activecases/view/active-incomplete-cases-view';
import ProviderManagementView from './sections/provider/view/provider-management-view';
import UsersManagementView from './sections/umanagement/view/users-management-view';
import ClientManagementView from './sections/cmanagement/view/client-management-view';
import EducationalResourcesView from './sections/educational/view/educational-resources-view';
import EDFloorVisitsView from './sections/edfloorvisits/view/ed-floor-visits-view';
import InsurancePayersView from './sections/insurancepayers/view/insurance-payers-view';
import PlaidManagementView from './sections/plaid/view/plaid-management-view';
import ClientGroupsView from './sections/clientgroups/view/client-groups-view';
import ReportManagementView from './sections/reports/view/report-management-view';
import LogsReportsView from './sections/clinicianlogs/view/logs-reports-view';
import EnrollmentDashboardView from './sections/enrollmentdashboard/view/enrollment-dashboard-view';
import LoadingScreen from './components/loading-screen';
import { AuthProvider } from './auth/context/jwt/auth-provider';
import { useAuthContext } from './auth/hooks/use-auth-context';
import { navConfig } from './layouts/dashboard/config-navigation';

// ----------------------------------------------------------------------

/**
 * Renderiza el layout principal y la vista correspondiente a la ruta actual.
 * Coordina la navegación con BrowserRouter y mantiene compatibilidad con URLs legacy con #.
 */
function AppContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Normaliza el pathname actual (ej: '/' -> '/dashboard', '#logs' -> '/logs')
  const normalizePath = (pathname: string, hash: string): string => {
    if (hash && hash.length > 1) {
      const cleanHash = hash.replace('#', '/');
      return cleanHash.startsWith('/') ? cleanHash : `/${cleanHash}`;
    }
    if (pathname === '/' || !pathname) {
      return '/dashboard';
    }
    return pathname;
  };

  const activeTab = normalizePath(location.pathname, location.hash);

  // Redirección automática si se accede con una URL legacy que contiene hash (ej: /#logs -> /logs)
  useEffect(() => {
    if (location.hash && location.hash.length > 1) {
      const targetPath = location.hash.replace('#', '/');
      const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
      navigate(cleanPath, { replace: true });
    } else if (location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [location.hash, location.pathname, navigate]);

  const handleTabChange = useCallback(
    (newTab: string) => {
      const targetPath = newTab.startsWith('#')
        ? newTab.replace('#', '/')
        : newTab;
      const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;

      if (cleanPath === activeTab) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const isClientSubTransition =
        (activeTab === '/client-management' && cleanPath === '/client-profile') ||
        (activeTab === '/client-profile' && cleanPath === '/client-management');

      navigate(cleanPath);

      if (!isClientSubTransition) {
        setIsLoading(true);
        timerRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 400);
      }
    },
    [activeTab, navigate]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case '/dashboard':
      case '#dashboard':
        return <AppView onNavigate={handleTabChange} />;
      case '/users-management':
      case '#users-management':
        return <UsersManagementView />;
      case '/insurance-payers':
      case '#insurance-payers':
        return <InsurancePayersView />;
      case '/plaid':
      case '#plaid':
        return <PlaidManagementView />;
      case '/enrollment-dashboard':
      case '#enrollment-dashboard':
        return <EnrollmentDashboardView />;
      case '/provider-management':
      case '#provider-management':
        return <ProviderManagementView />;
      case '/client-management':
      case '#client-management':
      case '/client-profile':
      case '#client-profile':
        return (
          <ClientManagementView activeTab={activeTab} setActiveTab={handleTabChange} />
        );
      case '/client-group':
      case '#client-group':
        return <ClientGroupsView />;
      case '/active-incomplete-cases':
      case '#active-incomplete-cases':
        return <ActiveIncompleteCasesView />;
      case '/ed-floor-visits':
      case '#ed-floor-visits':
        return <EDFloorVisitsView />;
      case '/educational-resources':
      case '#educational-resources':
        return <EducationalResourcesView />;
      case '/report-management':
      case '#report-management':
        return <ReportManagementView />;
      case '/logs':
      case '#logs':
        return <LogsReportsView />;
      default:
        return <AppView onNavigate={handleTabChange} />;
    }
  };

  return (
    <DashboardLayout
      onOpenSettings={() => setSettingsOpen(true)}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 220px)',
            width: '100%',
            transform: isMobile ? 'none' : 'translate(-50px, -50px)',
          }}
        >
          <LoadingScreen />
        </Box>
      ) : (
        renderTabContent()
      )}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onNavigate={handleTabChange}
        data={navConfig.flatMap((group) =>
          group.items.map((item) => ({
            label: item.title,
            href: item.path,
            icon: item.icon,
          }))
        )}
      />
    </DashboardLayout>
  );
}

// ----------------------------------------------------------------------

/**
 * Renderiza el contenido apropiado según el estado de autenticación
 * que provee el AuthProvider del contexto padre.
 */
function AppRouter() {
  const { authenticated, unauthenticated, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;
  if (authenticated) return <AppContent />;
  if (unauthenticated) return <LoginView />;

  return <LoadingScreen />;
}

// ----------------------------------------------------------------------

/**
 * Componente raíz de la aplicación.
 * Inicializa BrowserRouter y los proveedores globales (Settings, Theme, Auth).
 */
export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}

export { App };
