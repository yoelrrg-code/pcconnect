import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Header from './header';
import Nav from './nav';
import Main from './main';

// ----------------------------------------------------------------------

/**
 * Propiedades del Layout principal (Dashboard).
 */
interface DashboardLayoutProps {
  children: ReactNode;
  onOpenSettings: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

/**
 * Layout principal de la aplicación (Dashboard).
 * Gestiona la estructura general incluyendo el sidebar de navegación (Nav), la cabecera (Header) 
 * y el área principal de contenido (Main). Además, coordina el estado de colapso del menú lateral.
 * 
 * @param props - Propiedades del layout
 */
export default function DashboardLayout({ 
  children, 
  onOpenSettings,
  activeTab,
  setActiveTab
}: DashboardLayoutProps) {
  const [openNav, setOpenNav] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic navigation sidebar width
  const navWidth = isCollapsed ? 90 : 360;

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <Header 
        onOpenNav={() => setOpenNav(true)} 
        onOpenSettings={onOpenSettings}
        activeTab={activeTab}
        navWidth={navWidth}
      />

      <Nav 
        openNav={openNav} 
        onCloseNav={() => setOpenNav(false)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <Main navWidth={navWidth}>{children}</Main>
    </Box>
  );
}
export { DashboardLayout };
