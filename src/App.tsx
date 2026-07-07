import { useState, useEffect, useRef } from 'react';
import { SettingsProvider } from './components/settings/settings-provider';
import { ThemeProvider } from './theme';
import DashboardLayout from './layouts/dashboard';
import AppView from './sections/overview/view/app-view';
import LoginView from './sections/auth/login-view';
import SettingsDrawer from './components/settings/settings-drawer';
import ActiveIncompleteCasesView from './sections/enrollment/view/active-incomplete-cases-view';
import UsersManagementView from './sections/umanagement/view/users-management-view';
import ClientManagementView from './sections/cmanagement/view/client-management-view';
import EducationalResourcesView from './sections/educational/view/educational-resources-view';
import LoadingScreen from './components/loading-screen';
import { 
  Box, 
  Typography, 
  Card, 
  Button, 
  useTheme
} from '@mui/material';

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
  const theme = useTheme();
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
        return (
          <Box sx={{ py: 3, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Configure payor API keys, gateways, and active compliance rules.
            </Typography>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                Active Insurance Integrations
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Configure electronic claims transfer details.
              </Typography>
              <Button variant="contained" color="primary">Add Payer Connection</Button>
            </Card>
          </Box>
        );
      case '#plaid':
        return (
          <Box sx={{ py: 3, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Secure bank account verification and transaction processing settings.
            </Typography>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                Link Account Credentials
              </Typography>
              <Button variant="contained" color="primary">Launch Plaid Link</Button>
            </Card>
          </Box>
        );
      case '#enrollment-dashboard':
        return (
          <Box sx={{ py: 3, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Visual statistics for active patient enrollments and clinical files.
            </Typography>
            <Card sx={{ p: 4, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                Enrollment Overview
              </Typography>
              <Button variant="contained" color="primary">View Full Report</Button>
            </Card>
          </Box>
        );
      case '#provider-management':
        return (
          <Box sx={{ py: 3, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Directory and credentials of medical providers and doctors in network.
            </Typography>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Button variant="contained" color="primary">Add Provider</Button>
            </Card>
          </Box>
        );
      case '#client-management':
      case '#client-profile':
        return (
          <ClientManagementView activeTab={activeTab} setActiveTab={handleTabChange} />
        );
      case '#client-group':
        return (
          <Box sx={{ py: 3, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Configure corporate accounts, group discounts, and compliance units.
            </Typography>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Button variant="contained" color="primary">Create Group</Button>
            </Card>
          </Box>
        );
      case '#active-incomplete-cases':
        return <ActiveIncompleteCasesView />;
      case '#ed-floor-visits':
        return (
          <Box sx={{ py: 3, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Real-time patient floor visits feed and medical device allocations.
            </Typography>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Button variant="contained" color="primary">Refresh Visit Feed</Button>
            </Card>
          </Box>
        );
      case '#educational-resources':
        return <EducationalResourcesView />;
      case '#report-management':
        return (
          <Box sx={{ py: 3, mt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Compile spreadsheets, medical audits, and PDF files.
            </Typography>
            <Card sx={{ p: 4, borderRadius: 3 }}>
              <Button variant="contained" color="primary">Compile Spreadsheet</Button>
            </Card>
          </Box>
        );
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
    }, 800);
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
          <LoginView onLogin={handleLogin} />
        )}
      </ThemeProvider>
    </SettingsProvider>
  );
}
export { App };
