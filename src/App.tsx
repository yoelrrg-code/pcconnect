import { useState, useEffect, useRef } from 'react';
import { SettingsProvider } from './components/settings/settings-provider';
import { ThemeProvider } from './theme';
import DashboardLayout from './layouts/dashboard';
import AppView from './sections/overview/view/app-view';
import LoginView from './sections/auth/login-view';
import SettingsDrawer from './components/settings/settings-drawer';
import ActiveIncompleteCasesView from './sections/activecases/view/active-incomplete-cases-view';
import EnrollmentManagementView from './sections/enrollment/view/enrollment-management-view';
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
// ----------------------------------------------------------------------

/**
 * Propiedades para el componente principal de contenido una vez autenticado.
 */
interface AppContentProps {
  onLogout: () => void;
}

/**
 * Renderiza el layout principal y el contenido de la pestaña (ruta simulada) activa.
 * Mantiene el estado de navegación (activeTab) y coordina las transiciones visuales.
 * 
 * @param props - Las propiedades del componente.
 * @param props.onLogout - Función callback que se ejecuta para cerrar la sesión del usuario.
 */
function AppContent({ onLogout }: AppContentProps) {
  const [activeTab, setActiveTab] = useState('#dashboard');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabChange = (newTab: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    const isClientSubTransition = 
      (activeTab === '#client-management' && newTab === '#client-profile') ||
      (activeTab === '#client-profile' && newTab === '#client-management');

    if (isClientSubTransition) {
      setActiveTab(newTab);
    } else {
      setIsLoading(true);
      setActiveTab(newTab);
      timerRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const renderTabContent = () => {
    // Map paths from mockup navigation sections
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
        return <EnrollmentManagementView />;
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
        onLogout={onLogout}
      />
    </DashboardLayout>
  );
}

/**
 * Componente raíz de la aplicación.
 * Se encarga de inicializar los proveedores globales (Settings, Theme)
 * y manejar el estado de autenticación y carga inicial.
 */
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Initial load loading effect (F5)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsAppLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsAppLoading(false);
    }, 800);
  };

  return (
    <SettingsProvider>
      <ThemeProvider>
        {isAppLoading ? (
          <LoadingScreen />
        ) : isAuthenticated ? (
          <AppContent onLogout={() => setIsAuthenticated(false)} />
        ) : (
          //onLogin={handleLogin} parametro de LoginView
          <LoginView onLogin={handleLogin} />
        )}
      </ThemeProvider>
    </SettingsProvider>
  );
}
export { App };
