import { useState } from 'react';
import { Box, Tabs, Tab, useTheme } from '@mui/material';
import AcuityView from './acuity-view';
import DeficiencyView from './deficiency-view';
import RvuView from './rvu-view';

// ----------------------------------------------------------------------

type TabType = 'acuity' | 'deficiency' | 'rvu';

export default function LogsReportsView() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState<TabType>('acuity');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Top Header Tabs */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            textTransform: 'none',
            px: 3,
            py: 1.5,
          },
        }}
      >
        <Tab value="acuity" label="Acuity" />
        <Tab value="deficiency" label="Deficiency" />
        <Tab value="rvu" label="Relative Value Units" />
      </Tabs>

      {/* Tab Views */}
      {currentTab === 'acuity' && <AcuityView />}
      {currentTab === 'deficiency' && <DeficiencyView />}
      {currentTab === 'rvu' && <RvuView />}
    </Box>
  );
}