import { useState, useEffect, useRef, useCallback } from 'react';
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
import EnrollmentDashboardView from './sections/enrollmentdashboard/view/enrollment-dashboard-view';
import LoadingScreen from './components/loading-screen';
import { AuthProvider } from './auth/context/jwt/auth-provider';
import { useAuthContext } from './auth/hooks/use-auth-context';
import { navConfig } from './layouts/dashboard/config-navigation';

// ----------------------------------------------------------------------

/**
 * Renderiza el layout principal y el contenido de la pestaña (ruta simulada) activa.
 * Mantiene el estado de navegación (activeTab) y coordina las transiciones visuales.
 */
function AppContent() {
  const [activeTab, setActiveTab] = useState(window.location.hash || '#dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = useCallback((newTab: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const isClientSubTransition =
      (activeTab === '#client-management' && newTab === '#client-profile') ||
      (activeTab === '#client-profile' && newTab === '#client-management');

    if (window.location.hash !== newTab) {
      window.location.hash = newTab;
    }

    if (isClientSubTransition) {
      setActiveTab(newTab);
    } else {
      setIsLoading(true);
      setActiveTab(newTab);
      timerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#dashboard';
    }

    const handleHashChange = () => {
      const currentHash = window.location.hash || '#dashboard';
      if (currentHash !== activeTab) {
        handleTabChange(currentHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeTab, handleTabChange]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case '#dashboard':
        return <AppView onNavigate={handleTabChange} />;
      case '#users-management':
        return <UsersManagementView />;
      case '#insurance-payers':
        return <InsurancePayersView />;
      case '#plaid':
        return <PlaidManagementView />;
      case '#enrollment-dashboard':
        return <EnrollmentDashboardView />;
      case '#provider-management':
        return <ProviderManagementView />;
      case '#client-management':
      case '#client-profile':
        return (
          <ClientManagementView activeTab={activeTab} setActiveTab={handleTabChange} />
        );
      case '#client-group':
        return <ClientGroupsView />;
      case '#active-incomplete-cases':
        return <ActiveIncompleteCasesView />;
      case '#ed-floor-visits':
        return <EDFloorVisitsView />;
      case '#educational-resources':
        return <EducationalResourcesView />;
      case '#report-management':
        return <ReportManagementView />;
      default:
        return <AppView />;
    }
  };

  return (
    <DashboardLayout
      onOpenSettings={() => setSettingsOpen(true)}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
    >
      {isLoading ? <LoadingScreen /> : renderTabContent()}
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
 * Inicializa los proveedores globales (Settings, Theme, Auth).
 */
export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}

export { App };
