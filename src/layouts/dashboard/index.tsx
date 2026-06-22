import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Header from './header';
import Nav from './nav';
import Main from './main';

// ----------------------------------------------------------------------

interface DashboardLayoutProps {
  children: ReactNode;
  onOpenSettings: () => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardLayout({ 
  children, 
  onOpenSettings,
  onLogout,
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
        onLogout={onLogout}
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
