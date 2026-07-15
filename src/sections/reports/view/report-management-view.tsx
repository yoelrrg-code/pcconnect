import { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  IconButton, 
  useTheme, 
  alpha,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Button,
  Tabs,
  Tab,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Download, 
  Printer, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

type TabCategory = 'deficient' | 'enrollment' | 'caqh';

interface ReportOption {
  id: string;
  title: string;
}

const REPORT_CATEGORIES: Record<TabCategory, ReportOption[]> = {
  deficient: [
    { id: 'deficient-summary', title: 'Deficient Chart' },
    { id: 'provider-summary', title: 'Provider Summary' },
    { id: 'unlinked-providers', title: 'Unlinked Providers' },
    { id: 'unmapped-physicians', title: 'Unmapped Physicians' },
  ],
  enrollment: [
    { id: 'new-provider', title: 'New Provider' },
    { id: 'clients-report', title: 'Clients Report' },
    { id: 'roster-contact', title: 'Roster Contact' },
    { id: 'roster-identification', title: 'Roster Identification' },
    { id: 'roster-demographics', title: 'Roster Demographics' },
    { id: 'provider-listing', title: 'Provider Listing' },
    { id: 'provider-enrollment-status', title: 'Provider Enrollment Status' },
    { id: 'enrollment-status', title: 'Enrollment Status' },
    { id: 'enrollment-volume', title: 'Enrollment Volume' },
  ],
  caqh: [
    { id: 'caqh-report', title: 'CAQH Report' },
    { id: 'caqh-report-client', title: 'CAQH Report by Client' },
    { id: 'caqh-report-group', title: 'CAQH Report by Client Group' },
    { id: 'caqh-history-client', title: 'CAQH Provider History by Client' },
    { id: 'caqh-history-group', title: 'CAQH Provider History by Client Group' },
    { id: 'caqh-single-provider', title: 'CAQH Single Provider' },
  ],
};

export default function ReportManagementView() {
  const theme = useTheme();

  // Active Category (Tab)
  const [activeCategory, setActiveCategory] = useState<TabCategory>('deficient');
  
  // Selected Report within Category
  const [selectedReportId, setSelectedReportId] = useState<string>('deficient-summary');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabCategory) => {
    setActiveCategory(newValue);
    // Auto-select the first report in the new category
    const firstReport = REPORT_CATEGORIES[newValue][0];
    if (firstReport) {
      setSelectedReportId(firstReport.id);
    }
  };

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
  };

  const handleDownload = () => {
    alert(`Downloading report data...`);
  };

  return (
    <Box sx={{ width: 1, pb: 5, animation: `${fadeInUp} 0.3s ease-in-out` }}>
      
      {/* Top Tabs */}
      <Tabs 
        value={activeCategory} 
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
        <Tab value="deficient" label="Deficient Charts" />
        <Tab value="enrollment" label="Enrollment" />
        <Tab value="caqh" label="CAQH" />
      </Tabs>

      {/* Main 2-Column Layout */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, 
          gap: 2.5, 
          alignItems: 'start' 
        }}
      >
        {/* Left Side: Report Sidebar Menu */}
        <Card 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            boxShadow: 'none',
            bgcolor: theme.palette.background.paper,
            minHeight: '80vh',
            height: '100%'
          }}
        >
          <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
            {REPORT_CATEGORIES[activeCategory].map((report) => {
              const isSelected = report.id === selectedReportId;
              
              return (
                <ListItemButton
                  key={report.id}
                  onClick={() => handleSelectReport(report.id)}
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    px: 2,
                    width: '100%',
                    fontWeight: 600,
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    color: isSelected ? theme.palette.primary.main : 'text.primary',
                    '&:hover': {
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                      color: theme.palette.primary.main,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 32, 
                      color: isSelected ? theme.palette.primary.main : 'text.secondary',
                    }}
                  >
                    <FileText size={18} />
                  </ListItemIcon>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '14px',
                      color: isSelected ? theme.palette.primary.main : 'text.primary',
                    }}
                  >
                    {report.title}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
        </Card>

        {/* Right Side: Simulated Report Card */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Actions toolbar */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Download size={16} />}
              onClick={handleDownload}
              sx={{ borderRadius: '24px', px: 3, textTransform: 'none', fontWeight: 600 }}
            >
              Download
            </Button>
            <Button
              variant="outlined"
              startIcon={<Printer size={16} />}
              onClick={() => window.print()}
              sx={{ borderRadius: '24px', px: 3, textTransform: 'none', fontWeight: 600, borderColor: theme.palette.divider, color: 'text.secondary' }}
            >
              Print
            </Button>
          </Box>

          {/* Report Sheet */}
          <Card 
            sx={{ 
              borderRadius: 2, 
              boxShadow: 'none', 
              bgcolor: '#FFFFFF', // Clean white page representation
              display: 'flex',
              flexDirection: 'column',
              minHeight: '75vh',
              overflow: 'hidden'
            }}
          >
            {/* Sheet Page Container */}
            <Box sx={{ p: 4, flexGrow: 1, color: '#333333' }}>
              
              {/* Sheet Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                {/* Brand Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 900, 
                      color: theme.palette.primary.main, 
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '28px',
                      letterSpacing: -1
                    }}
                  >
                    PC
                  </Typography>
                  <Box sx={{ borderLeft: '2px solid #DDD', pl: 1, lineHeight: 1.1 }}>
                    <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#444', letterSpacing: 0.5 }}>
                      REVENUE
                    </Typography>
                    <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#444', letterSpacing: 0.5 }}>
                      CYCLE
                    </Typography>
                    <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#444', letterSpacing: 0.5 }}>
                      MANAGEMENT
                    </Typography>
                  </Box>
                </Box>

                {/* Report Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 700, 
                    color: '#333333',
                    fontSize: '18px'
                  }}
                >
                  {selectedReportId === 'deficient-summary' && 'Open Deficient Chart Summary'}
                  {selectedReportId === 'clients-report' && 'Clients Report'}
                  {selectedReportId === 'caqh-report' && 'CAQH Report'}
                  {!['deficient-summary', 'clients-report', 'caqh-report'].includes(selectedReportId) && 
                    REPORT_CATEGORIES[activeCategory].find(r => r.id === selectedReportId)?.title
                  }
                </Typography>
              </Box>

              <Divider sx={{ mb: 3, borderColor: '#EEEEEE' }} />

              {/* Sheet Content Body */}
              <Box sx={{ overflowX: 'auto' }}>
                {selectedReportId === 'deficient-summary' && <DeficientChartReport />}
                {selectedReportId === 'clients-report' && <ClientsReport />}
                {selectedReportId === 'caqh-report' && <CaqhReport />}
                {!['deficient-summary', 'clients-report', 'caqh-report'].includes(selectedReportId) && (
                  <Box sx={{ py: 10, textAlign: 'center', color: '#888' }}>
                    <FileText size={48} style={{ opacity: 0.5, marginBottom: 12 }} />
                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                      No data available for this mock report.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Sheet Footer */}
            {selectedReportId === 'deficient-summary' && (
              <Box sx={{ borderTop: '1px solid #EEEEEE', px: 4, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#FAFAFA' }}>
                <Typography sx={{ fontSize: '12px', color: '#666' }}>
                  1/15/2026 1:01 PM
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton size="small" disabled>
                    <ChevronLeft size={16} />
                  </IconButton>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
                    Page 1 of 17
                  </Typography>
                  <IconButton size="small">
                    <ChevronRight size={16} />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Sub-Components for Report Contents
// ----------------------------------------------------------------------

function DeficientChartReport() {
  const data = [
    {
      client: 'A03',
      items: [
        { name: 'CHRISTENSEN, JAVIES UNMAP', comment: false, count: 1 },
        { name: 'LIVERMORE, FELICIA UNMAP', comment: false, count: 3 },
        { name: 'SLADE, JOEL UNMAP', comment: false, count: 1 },
        { name: 'UNKNOWN', comment: false, count: 4 },
        { name: 'WACHTER, MELISSA UNMAP', comment: false, count: 4 },
        { name: 'WORDEN, MICHAEL UNMAP', comment: false, count: 5 },
      ],
      total: 18
    },
    {
      client: 'A08',
      items: [
        { name: 'STAFF', comment: true, count: 1 }
      ],
      total: 1
    },
    {
      client: 'A12',
      items: [
        { name: 'STAFF', comment: true, count: 132 },
        { name: 'BLAYLOCK, BENJAMIN UNMAP', comment: true, count: 7 },
        { name: 'Cheryl Encarnacion', comment: true, count: 1 },
        { name: 'Delya Levy, CRNA', comment: true, count: 6 },
        { name: 'HESTED, BRYAN UNMAP', comment: false, count: 4 },
        { name: 'Thomas Mahoney, CRNA', comment: false, count: 8 },
        { name: 'Trent Bassman, CRNA', comment: false, count: 2 },
        { name: 'UNKNOWN', comment: false, count: 11 },
      ],
      total: 165
    }
  ];

  return (
    <Box sx={{ width: 1, fontFamily: 'Poppins, sans-serif' }}>
      <Table sx={{ minWidth: 600 }}>
        <TableHead>
          <TableRow sx={{ '& th': { borderBottom: '2px solid #333', color: '#111', fontWeight: 600, fontSize: '13px', px: 1, py: 1 } }}>
            <TableCell sx={{ width: '60%' }}>Name</TableCell>
            <TableCell align="center" sx={{ width: '20%' }}>Has Comment</TableCell>
            <TableCell align="right" sx={{ width: '20%' }}>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((group) => (
            <React.Fragment key={group.client}>
              {/* Category Header (Pink Banner) */}
              <TableRow>
                <TableCell colSpan={3} sx={{ bgcolor: '#D8588C', color: '#FFF', fontWeight: 700, py: 0.8, px: 1.5, fontSize: '13px' }}>
                  {group.client}
                </TableCell>
              </TableRow>
              {/* Items */}
              {group.items.map((item, idx) => (
                <TableRow key={idx} sx={{ '& td': { borderBottom: '1px solid #EEE', py: 0.8, px: 1.5, fontSize: '13px', color: '#444' } }}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" checked={item.comment} readOnly sx={{ p: 0 }} />
                  </TableCell>
                  <TableCell align="right">{item.count}</TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow sx={{ '& td': { borderBottom: '2px solid #333', py: 1, px: 1.5, fontWeight: 700, fontSize: '13px', color: '#111' } }}>
                <TableCell colSpan={2}>TOTAL FOR CLIENT</TableCell>
                <TableCell align="right">{group.total}</TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

import React from 'react';

function ClientsReport() {
  const data = [
    {
      dataSet: 'A01',
      name: 'South Shore Anesthesia Staffing, LLC',
      taxId: '85-1930565',
      npi: '1013525112',
      start: '11/17/2020',
      contacts: [
        { type: 'Facility', address1: '1414 W Fair Ave., Ste. 235', address2: '', city: 'MARQUETTE', state: 'MI', zip: '49855', phone: '906-361-4901' },
        { type: 'Client Pay', address1: 'PO Box 4419', address2: '', city: 'WOODLAND HILLS', state: 'CA', zip: '91365', phone: '818-340-9988' }
      ]
    },
    {
      dataSet: 'A02',
      name: 'Elite Anesthesia LLC',
      taxId: '',
      npi: '',
      start: '3/1/2022',
      contacts: [
        { type: 'Facility', address1: '', address2: '', city: '', state: '', zip: '', phone: '' },
        { type: 'Client Pay', address1: '', address2: '', city: '', state: '', zip: '', phone: '' }
      ]
    },
    {
      dataSet: 'A03',
      name: 'UP Bell Hospital Anesthesia (Lifepoint)',
      taxId: '800935981',
      npi: '1699101345',
      start: '7/1/2022',
      contacts: [
        { type: 'Facility', address1: '901 Lakeshore Dr', address2: '', city: 'ISHPEMING', state: 'MI', zip: '49849', phone: '' }
      ]
    },
    {
      dataSet: 'A04',
      name: 'Fairfax Colon & Rectal Surgery',
      taxId: '510571797',
      npi: '1306957485',
      start: '2/1/2023',
      contacts: [
        { type: 'Facility', address1: '2710 Prosperity Ave Ste 200', address2: '', city: 'FAIRFAX', state: 'VA', zip: '22031', phone: '7036502333' }
      ]
    },
    {
      dataSet: 'A05',
      name: 'AAS Indiana, LLC',
      taxId: '883142926',
      npi: '1831827021',
      start: '3/1/2023',
      contacts: [
        { type: 'Facility', address1: '4105 Dicke Rd', address2: '', city: 'FORT WAYNE', state: 'IN', zip: '46804', phone: '2483784100' },
        { type: 'Client Pay', address1: '43422 W Oaks Dr', address2: 'Ste 332', city: 'NOVI', state: 'MI', zip: '48377', phone: '' }
      ]
    },
    {
      dataSet: 'A05A',
      name: 'AAS Indiana, LLC',
      taxId: '',
      npi: '',
      start: '3/1/2023',
      contacts: [
        { type: 'Facility', address1: '2401 W University Ave', address2: '', city: 'MUNCIE', state: 'IN', zip: '47303', phone: '' }
      ]
    },
    {
      dataSet: 'A06',
      name: 'Detroit Anesthesia Group LLC',
      taxId: '45-4784439',
      npi: '1316212988',
      start: '5/1/2023',
      contacts: [
        { type: 'Facility', address1: '28750 Providence Pkwy', address2: '', city: 'NOVI', state: 'MI', zip: '48374', phone: '2486621500' }
      ]
    },
    {
      dataSet: 'A06A',
      name: 'Detroit Anesthesia Group LLC',
      taxId: '',
      npi: '',
      start: '',
      contacts: [
        { type: 'Facility', address1: '24430 Ford Rd', address2: '', city: 'DEARBORN HEIGHTS', state: 'MI', zip: '48127', phone: '3133572688' }
      ]
    }
  ];

  return (
    <Box sx={{ width: 1, fontFamily: 'Poppins, sans-serif' }}>
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow sx={{ '& th': { borderBottom: '2px solid #333', color: '#111', fontWeight: 600, fontSize: '11px', px: 1, py: 1 } }}>
            <TableCell sx={{ width: 60 }}>Data Set</TableCell>
            <TableCell sx={{ width: 260 }}>Name</TableCell>
            <TableCell colSpan={7} sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <Box sx={{ p: 1, fontWeight: 600, borderBottom: '1px solid #333' }}>Contact Information</Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '80px 180px 100px 120px 50px 70px 100px', p: 1, '& span': { fontWeight: 600 } }}>
                  <span>Type</span>
                  <span>Address 1</span>
                  <span>Address 2</span>
                  <span>City</span>
                  <span>State</span>
                  <span>Zip</span>
                  <span>Phone</span>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => {
            const isPinkRow = ['A02', 'A04', 'A05A', 'A06A'].includes(row.dataSet);
            const rowBg = isPinkRow ? '#FAD2D9' : 'transparent';
            
            return (
              <TableRow key={idx} sx={{ bgcolor: rowBg, '& td': { borderBottom: '1px solid #DDD', py: 1.5, px: 1, fontSize: '11px', verticalAlign: 'top', color: '#333' } }}>
                <TableCell sx={{ fontWeight: 600 }}>{row.dataSet}</TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 700, fontSize: '12px', mb: 0.5 }}>{row.name}</Typography>
                  {row.taxId && <Typography sx={{ fontSize: '10px', color: '#555' }}>Tax ID#: {row.taxId}</Typography>}
                  {row.npi && <Typography sx={{ fontSize: '10px', color: '#555' }}>NPI#: {row.npi}</Typography>}
                  {row.start && <Typography sx={{ fontSize: '10px', color: '#555' }}>Start: {row.start}</Typography>}
                </TableCell>
                <TableCell colSpan={7} sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {row.contacts.map((contact, cIdx) => (
                      <Box 
                        key={cIdx} 
                        sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '80px 180px 100px 120px 50px 70px 100px', 
                          p: 1, 
                          borderBottom: cIdx < row.contacts.length - 1 ? '1px solid #EEE' : 'none',
                          fontSize: '11px',
                          color: '#444'
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{contact.type}</span>
                        <span>{contact.address1 || '—'}</span>
                        <span>{contact.address2 || '—'}</span>
                        <span>{contact.city || '—'}</span>
                        <span>{contact.state || '—'}</span>
                        <span>{contact.zip || '—'}</span>
                        <span>{contact.phone || '—'}</span>
                      </Box>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}

function CaqhReport() {
  const data = [
    { provider: 'Adams, Kenicia', number: '13511855', user: 'keniciaadams2015', pass: 'Nautical0621$', last: '10/10/2025', due: '1/10/2026' },
    { provider: 'Akinbiyi, Olubukola', number: '14137656', user: '14137656', pass: 'Galena09*', last: '11/4/2025', due: '2/4/2026' },
    { provider: 'Aldanal, Jillian', number: '13598112', user: 'Jaldanal', pass: 'Lucas0109', last: '9/9/2025', due: '12/9/2025' },
    { provider: 'Alverson, Mable', number: '11909327', user: '11909327', pass: 'Papercrap@2', last: '10/21/2025', due: '1/21/2026' },
    { provider: 'Ament, Jody', number: '12173383', user: '12173383', pass: 'Paperapp1!', last: '11/7/2025', due: '2/7/2026' },
    { provider: 'Anderson, Michael', number: '15007749', user: '15007749', pass: 'H@wk3y37276!', last: '4/8/2026', due: '7/8/2026' },
    { provider: 'Arbit, Phillip', number: '11270904', user: '11270904', pass: 'caqhpass', last: '9/4/2025', due: '12/4/2025' },
    { provider: 'Arter, Brenda', number: '12465399', user: 'arterbrenda', pass: 'SArtercrna1', last: '9/26/2025', due: '12/26/2025' },
    { provider: 'Auger, Mark', number: '11903315', user: '', pass: '', last: '', due: '' },
    { provider: 'Bagnell Leonardo, Jamie', number: '11909365', user: '', pass: '', last: '', due: '' },
    { provider: 'Balmaseda, Carlo', number: '15883307', user: '15883307CB', pass: 'Iuhp1984!', last: '9/2/2025', due: '12/2/2025' },
    { provider: 'Bates, Cody', number: '15689018', user: 'Cbates1990', pass: 'Cb121990!', last: '10/27/2025', due: '1/27/2026' }
  ];

  return (
    <Box sx={{ width: 1, fontFamily: 'Poppins, sans-serif' }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ '& th': { borderBottom: '2px solid #333', color: '#111', fontWeight: 800, fontSize: '11px', px: 1, py: 1.5, textTransform: 'uppercase' } }}>
            <TableCell sx={{ width: '25%' }}>Provider</TableCell>
            <TableCell sx={{ width: '15%' }}>Number</TableCell>
            <TableCell sx={{ width: '15%' }}>Username</TableCell>
            <TableCell sx={{ width: '15%' }}>Password</TableCell>
            <TableCell sx={{ width: '15%' }}>Last Attestation</TableCell>
            <TableCell sx={{ width: '15%' }}>Attestation Due</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} sx={{ '& td': { borderBottom: '1px solid #EEE', py: 1, px: 1, fontSize: '12px' } }}>
              {/* Provider (Maroon/Red Banner cell) */}
              <TableCell sx={{ bgcolor: '#8A0F35', color: '#FFF !important', fontWeight: 600, py: '12px !important', px: '12px !important' }}>
                {row.provider}
              </TableCell>
              <TableCell>{row.number}</TableCell>
              <TableCell>{row.user || '—'}</TableCell>
              <TableCell>{row.pass || '—'}</TableCell>
              <TableCell>{row.last || '—'}</TableCell>
              <TableCell>{row.due || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
