import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  useTheme, 
} from '@mui/material';
import { fadeInUp } from '../../../theme/effects';
import { BarChart } from '@mui/x-charts/BarChart';

// ----------------------------------------------------------------------

type TabType = 'acuity' | 'deficiency' | 'rvu';

export default function LogsReportsView() {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState<TabType>('acuity');

  // Filter state for Acuity
  const [acuityAdminFilter, setAcuityAdminFilter] = useState('');
  const [acuityTimeFilter, setAcuityTimeFilter] = useState('');
  const [acuitySecondaryFilter, setAcuitySecondaryFilter] = useState('');

  // Filter state for Deficiency
  const [deficiencyAdminFilter, setDeficiencyAdminFilter] = useState('');
  const [deficiencyTimeFilter, setDeficiencyTimeFilter] = useState('');
  const [deficiencySecondaryFilter, setDeficiencySecondaryFilter] = useState('');

  // Filter state for Relative Value Units
  const [rvuAdminFilter, setRvuAdminFilter] = useState('');
  const [rvuTimeFilter, setRvuTimeFilter] = useState('');
  const [rvuSecondaryFilter, setRvuSecondaryFilter] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    setCurrentTab(newValue);
  };

  const renderTabContent = (
    adminFilter: string,
    setAdminFilter: (val: string) => void,
    timeFilter: string,
    setTimeFilter: (val: string) => void,
    secondaryFilter: string,
    setSecondaryFilter: (val: string) => void
  ) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, animation: `${fadeInUp} 0.3s ease-in-out` }}>
      {/* Top Filter Cards */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Admin Filter Card */}
        <Card
          sx={{
            pt: 3,
            pb: 4,
            px: 3,
            flex: { xs: '1 1 100%', md: '0 0 calc(35% - 12px)' },
            minWidth: 280,
            borderRadius: 3,
            boxShadow: 'none',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Admin Filter
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>

            <TextField
                select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                slotProps={{
                    select: { native: true }
                }}
                sx={{
                    '& .MuiInputBase-root': {
                        height: 40,
                    }
                }}
                >
                <option value=""></option>
                <option value="admin1">Admin 1</option>
                <option value="admin2">Admin 2</option>
                <option value="admin3">Admin 3</option>
            </TextField>

            <Button
              variant="modalAdd"
            >
              Filter
            </Button>
          </Box>
        </Card>

        {/* Filter Card */}
        <Card
          sx={{
            pt: 3,
            pb: 4,
            px: 3,
            flex: { xs: '1 1 100%', md: '1 1 calc(65% - 12px)' },
            minWidth: 320,
            borderRadius: 3,
            boxShadow: 'none',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Filter
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>

            <TextField
                select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                slotProps={{
                    select: { native: true }
                }}
                sx={{
                    '& .MuiInputBase-root': {
                        height: 40,
                    }
                }}
                >
                <option value=""></option>
                <option value="Last 3 Months">Last 3 Months</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Year">Last Year</option>
            </TextField>

            <TextField
                select
                value={secondaryFilter}
                onChange={(e) => setSecondaryFilter(e.target.value)}
                slotProps={{
                    select: { native: true }
                }}
                sx={{
                    '& .MuiInputBase-root': {
                        height: 40,
                    }
                }}
                >
                <option value=""></option>
                <option value="Option 1">Option 1</option>
                <option value="Option 2">Option 2</option>
                <option value="Option 3">Option 3</option>
            </TextField>

            <Button
              variant="modalAdd"
            >
              Filter
            </Button>
          </Box>
        </Card>
      </Box>

      {/* Main Charts Placeholder Area */}
      <Card
        sx={{
          p: 3,
          minHeight: '65vh',
          borderRadius: 3,
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}>
          <BarChart
            series={series}
            xAxis={[
              {
                scaleType: 'band',
                data: Array.from({ length: 5 }, (_, i) => `${i + 1}`),
                categoryGapRatio: 0.6,
              },
            ]}
            yAxis={[
              {
                width: 50,
                valueFormatter: new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  style: 'percent',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format,
              },
            ]}
            height={700}
            slotProps={{
              legend: {
                direction: 'vertical',
                position: { vertical: 'top', horizontal: 'start' },
              },
            }}
            margin={{ left: 50 }}
            sx={{
              '& .MuiBarLabel-root, & .MuiChartsBarLabel-root, & text': {
                fill: '#ffffff !important',
                fontSize: 14,
                fontWeight: 600,
              },
            }}
          />
        </Box>
      </Card>
    </Box>
  );

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
          }
        }}
      >
        <Tab value="acuity" label="Acuity" />
        <Tab value="deficiency" label="Deficiency" />
        <Tab value="rvu" label="Relative Value Units" />
      </Tabs>

      {/* Tab Panels */}
      {currentTab === 'acuity' &&
        renderTabContent(
          acuityAdminFilter,
          setAcuityAdminFilter,
          acuityTimeFilter,
          setAcuityTimeFilter,
          acuitySecondaryFilter,
          setAcuitySecondaryFilter
        )}

      {currentTab === 'deficiency' &&
        renderTabContent(
          deficiencyAdminFilter,
          setDeficiencyAdminFilter,
          deficiencyTimeFilter,
          setDeficiencyTimeFilter,
          deficiencySecondaryFilter,
          setDeficiencySecondaryFilter
        )}

      {currentTab === 'rvu' &&
        renderTabContent(
          rvuAdminFilter,
          setRvuAdminFilter,
          rvuTimeFilter,
          setRvuTimeFilter,
          rvuSecondaryFilter,
          setRvuSecondaryFilter
        )}
    </Box>
  );
}

const series = [
  {
    label: '99282',
    data: [
      2423, 2210, 764, 1879, 1478, 1373, 1891, 2171, 620, 
    ],
    color: '#FF88D0',
    stack: 'total',
    barLabel: 'value' as const,
  },
  {
    label: '99283',
    data: [
      2362, 2254, 1962, 1336, 586, 1069, 2194, 1629, 2173, 
    ],
    color: '#00B79F',
    stack: 'total',
    barLabel: 'value' as const,
  },
  {
    label: '99284',
    data: [
      1145, 1214, 975, 2266, 1768, 2341, 747, 1282, 1780, 
    ],
    color: '#FFB63B',
    stack: 'total',
    barLabel: 'value' as const,
  },
  {
    label: '99285',
    data: [
      2361, 979, 2430, 1768, 1913, 2342, 1868, 1319, 1038, 
    ],
    color: '#9F146C',
    stack: 'total',
    barLabel: 'value' as const,
  },
  {
    label: '99281',
    data: [
      968, 1371, 1381, 1060, 1327, 934, 1779, 1361, 878, 1055,
    ],
    color: '#728AAB',
    stack: 'total',
    barLabel: 'value' as const,
  },
];