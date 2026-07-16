import React, { useState, useMemo, useCallback } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Button, 
  InputAdornment, 
  useTheme, 
  alpha,
  TablePagination,
  IconButton,
  InputBase,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Card
} from '@mui/material';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  RotateCw, 
  UserCheck, 
  Building, 
  Trash2, 
  UserPlus, 
  Check, 
  History,
  Users
} from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

interface TopTableRow {
  id: string;
  name: string;
  dataSet: string;
  note: string;
  created: string;
}

const MOCK_TOP_ROWS: TopTableRow[] = [
  { id: '1', name: 'Brian McBeth, MD', dataSet: '', note: 'Revalidation approved on 08/12/19 -CS', created: '2019-08-12' },
  { id: '2', name: 'Heather Taher, MD', dataSet: '', note: 'Received email from Avanti Gupta stating Dr. Taher has resigned from EPA. Departure date 4/30/2020', created: '2020-10-07' },
  { id: '3', name: 'Aadil Vora, DO', dataSet: '', note: '11/25/2024-received email from provider that he is joining EPA Fremont', created: '2024-12-06' },
  { id: '4', name: 'Aadil Vora, DO', dataSet: '', note: '', created: '2024-12-06' },
  { id: '5', name: 'Erica McEnery, MD', dataSet: 'G66', note: 'Received email from Avanti Gupta on 10/7/2020 stating Dr. Taher has resigned from EPA (G66). Departure date 7/31/2020 based on Monthend Compprov report.', created: '2020-10-07' },
  { id: '6', name: 'John Doe, MD', dataSet: 'A01', note: 'Pending signature', created: '2025-01-10' },
  { id: '7', name: 'Jane Smith, DO', dataSet: 'H03', note: 'Revalidation submitted', created: '2025-02-15' },
];

interface PotentialProvider {
  id: string;
  notification: string;
  dataSet: string;
  firstName: string;
  lastName: string;
  title: string;
  npi: string;
  email: string;
  start: string;
}

const MOCK_POTENTIAL_PROVIDERS: PotentialProvider[] = [
  { id: '1', notification: '2026-04-24', dataSet: 'E09', firstName: 'Omar', lastName: 'Alazzawi', title: 'MD', npi: '', email: 'omar.alazzawi91@gmail.com', start: '2026-06-01' },
  { id: '2', notification: '2026-04-28', dataSet: 'E09', firstName: 'Rene', lastName: 'Monzon', title: 'MD', npi: '', email: 'renemonzon2020@gmail.com', start: '2026-06-01' },
  { id: '3', notification: '2026-05-05', dataSet: 'E09', firstName: 'Mohammad', lastName: 'Alwattar', title: 'MD', npi: '', email: 'mohammadsalimalwattar@yahoo.com', start: '2026-06-01' },
  { id: '4', notification: '2026-06-05', dataSet: 'G24', firstName: 'Marice', lastName: 'Salib', title: 'MD', npi: '', email: 'maricesalib.medicine@gmail.com', start: '2026-07-01' },
];

interface ProviderEnrollment {
  id: string;
  dataSet: string;
  providerName: string;
  providerEmail: string;
  first: string;
  last: string;
  program: string;
  providerNum: string;
  trackingNum: string;
  notification: string;
  entryDate: string;
  entryDays: number;
  sentDate: string;
  sentDays?: number;
  notes: string;
  carrierDate: string;
  carrierDays?: number;
  completed: boolean;
}

const MOCK_ENROLLMENTS: ProviderEnrollment[] = [
  { id: '1', dataSet: 'E09', providerName: 'Betsy Therese Oppezzo', providerEmail: 'betsyoppezzo@gmail.com', first: 'Betsy Therese', last: 'Oppezzo', program: 'Medicaid-OR', providerNum: 'pending', trackingNum: '', notification: '2026-08-15', entryDate: '2026-08-15', entryDays: 30, sentDate: '', notes: '', carrierDate: '', completed: false },
  { id: '2', dataSet: 'E09', providerName: 'Behrang Dehkordi', providerEmail: 'behrang_h@gmail.com', first: 'Behrang', last: 'Dehkordi', program: 'Medicaid-OR', providerNum: 'pending', trackingNum: '', notification: '2026-08-15', entryDate: '2026-08-15', entryDays: 30, sentDate: '', notes: '', carrierDate: '', completed: false },
  { id: '3', dataSet: 'A01', providerName: 'Hugh Hart', providerEmail: 'hhart18373@gmail.com', first: 'Hugh', last: 'Hart', program: 'UPHP', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '06/11/2026-sent an email to the payer asking how to add the provider to the group', carrierDate: '', completed: false },
  { id: '4', dataSet: 'A01', providerName: 'Hugh Hart', providerEmail: 'hhart18373@gmail.com', first: 'Hugh', last: 'Hart', program: 'BCBS-MI', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '06/11/2026-receiving errors when adding provider via Availity, created a ticket in Availity and emailed BCBS MI (Availity Support Ticket 18578025)', carrierDate: '', completed: false },
  { id: '5', dataSet: 'A01', providerName: 'Hugh Hart', providerEmail: 'hhart18373@gmail.com', first: 'Hugh', last: 'Hart', program: 'Medicaid-MI', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '06/12/2026-submitted domain access request form to payer; 06/11/2026-sent domain access request form to provider for signature', carrierDate: '', completed: false },
  { id: '6', dataSet: 'A01', providerName: 'Hugh Hart', providerEmail: 'hhart18373@gmail.com', first: 'Hugh', last: 'Hart', program: 'Medicare-MI', providerNum: 'pending', trackingNum: 'TD61120260007612', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '2026-06-11', sentDays: 0, notes: '06/12/2026-application signed; 06/11/2026-submitted application and sent the provider an email with instructions to sign', carrierDate: '2026-06-11', carrierDays: 34, completed: false },
  { id: '7', dataSet: 'H03', providerName: 'Mudassir Sayeed', providerEmail: 'mudassirsayeed@gmail.com', first: 'Mudassir', last: 'Sayeed', program: 'CMS Identity & Access', providerNum: 'pending', trackingNum: 'S9626158', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 5, sentDate: '2026-06-11', sentDays: 0, notes: '06/11/2026-submitted surrogacy request and sent the client an email with instructions for the provider to approve', carrierDate: '2026-06-11', carrierDays: 34, completed: false },
  { id: '8', dataSet: 'H03', providerName: 'Anila Ashraf', providerEmail: 'bintinaseher@yahoo.com', first: 'Anila', last: 'Ashraf', program: 'Medicaid-IL', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '06/11/2026-pending COI, provider not enrolled, needs full application submitted', carrierDate: '', completed: false },
  { id: '9', dataSet: 'H03', providerName: 'Anila Ashraf', providerEmail: 'bintinaseher@yahoo.com', first: 'Anila', last: 'Ashraf', program: 'Medicare-IL', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '', carrierDate: '', completed: false },
  { id: '10', dataSet: 'H03', providerName: 'Syed Najeemuddin', providerEmail: 'syednajeemuddin@yahoo.com', first: 'Syed', last: 'Najeemuddin', program: 'Medicaid-IL', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '06/12/2026-submitted domain access request form to the payer; 06/11/2026-sent domain access request form to client for signature, pending COI', carrierDate: '', completed: false },
  { id: '11', dataSet: 'H03', providerName: 'Syed Najeemuddin', providerEmail: 'syednajeemuddin@yahoo.com', first: 'Syed', last: 'Najeemuddin', program: 'Medicare-IL', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '', carrierDate: '', completed: false },
  { id: '12', dataSet: 'H03', providerName: 'Evelyn Ukpolo', providerEmail: 'eukpolo@gmail.com', first: 'Evelyn', last: 'Ukpolo', program: 'Medicaid-IL', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '06/12/2026-submitted domain access request form to the payer; 06/11/2026-sent domain access request form to client for signature, pending COI', carrierDate: '', completed: false },
  { id: '13', dataSet: 'H03', providerName: 'Evelyn Ukpolo', providerEmail: 'eukpolo@gmail.com', first: 'Evelyn', last: 'Ukpolo', program: 'Medicare-IL', providerNum: 'pending', trackingNum: 'TD61220260004308', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '2026-06-12', sentDays: 0, notes: '06/12/2026-submitted application, sent client an email regarding the provider signing', carrierDate: '2026-06-12', carrierDays: 33, completed: false },
  { id: '14', dataSet: 'H03', providerName: 'Mudassir Sayeed', providerEmail: 'mudassirsayeed@gmail.com', first: 'Mudassir', last: 'Sayeed', program: 'Medicaid-IL', providerNum: 'pending', trackingNum: '', notification: '2026-06-11', entryDate: '2026-06-11', entryDays: 34, sentDate: '', notes: '06/12/2026-submitted domain access request form to the payer; 06/11/2026-sent domain access request form to client for signature, pending COI', carrierDate: '', completed: false }
];

export default function EnrollmentDashboardView() {
  const theme = useTheme();

  // --- Top Table States (Revalidation Tasks) ---
  const [topSearch, setTopSearch] = useState('');
  const [topRows] = useState<TopTableRow[]>(MOCK_TOP_ROWS);
  const [topPage, setTopPage] = useState(0);
  const [topRowsPerPage, setTopRowsPerPage] = useState(5);

  // --- Tabs States ---
  const [activeTab, setActiveTab] = useState(0);

  // --- Bottom Table States (Potential Providers - Editable) ---
  const [bottomSearch, setBottomSearch] = useState('');
  const [potentialProviders, setPotentialProviders] = useState<PotentialProvider[]>(MOCK_POTENTIAL_PROVIDERS);
  const [originalProviders, setOriginalProviders] = useState<Record<string, PotentialProvider>>(() => 
    MOCK_POTENTIAL_PROVIDERS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
  );
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPP, setNewPP] = useState<Omit<PotentialProvider, 'id'>>({
    notification: dayjs().format('YYYY-MM-DD'),
    dataSet: '',
    firstName: '',
    lastName: '',
    title: '',
    npi: '',
    email: '',
    start: dayjs().add(1, 'month').format('YYYY-MM-DD')
  });

  const [bottomPage, setBottomPage] = useState(0);
  const [bottomRowsPerPage, setBottomRowsPerPage] = useState(25);

  // Handle cell edit for potential providers
  const handlePPCellEdit = (id: string, field: keyof PotentialProvider, value: string) => {
    setPotentialProviders(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDiscardPPRow = (id: string) => {
    const original = originalProviders[id];
    if (original) {
      setPotentialProviders(prev => prev.map(p => p.id === id ? { ...original } : p));
    }
  };

  const isPPRowDirty = useCallback((row: PotentialProvider) => {
    const original = originalProviders[row.id];
    if (!original) return false;
    return (
      row.notification !== original.notification ||
      row.dataSet !== original.dataSet ||
      row.firstName !== original.firstName ||
      row.lastName !== original.lastName ||
      row.title !== original.title ||
      row.npi !== original.npi ||
      row.email !== original.email ||
      row.start !== original.start
    );
  }, [originalProviders]);

  const hasPPChanges = useMemo(() => {
    return potentialProviders.some(isPPRowDirty);
  }, [potentialProviders, isPPRowDirty]);

  const handleSaveAllPP = () => {
    const newOriginals = potentialProviders.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
    setOriginalProviders(newOriginals);
    alert('Changes saved successfully!');
  };

  const handleDiscardAllPP = () => {
    setPotentialProviders(prev => prev.map(p => originalProviders[p.id] ? { ...originalProviders[p.id] } : p));
  };

  const handleAddPP = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = String(Date.now());
    const addedPP: PotentialProvider = {
      id: newId,
      ...newPP
    };
    setPotentialProviders(prev => [addedPP, ...prev]);
    setOriginalProviders(prev => ({ ...prev, [newId]: addedPP }));
    setIsAddDialogOpen(false);
    setNewPP({
      notification: dayjs().format('YYYY-MM-DD'),
      dataSet: '',
      firstName: '',
      lastName: '',
      title: '',
      npi: '',
      email: '',
      start: dayjs().add(1, 'month').format('YYYY-MM-DD')
    });
  };

  const handleDeletePP = (id: string) => {
    setPotentialProviders(prev => prev.filter(p => p.id !== id));
  };

  // --- Enrollment Tab States (Tab 2) ---
  const [enrollSearch, setEnrollSearch] = useState('');
  const [enrollPage, setEnrollPage] = useState(0);
  const [enrollRowsPerPage, setEnrollRowsPerPage] = useState(10);

  // --- Filters ---
  const filteredTopRows = useMemo(() => {
    return topRows.filter(r => 
      r.name.toLowerCase().includes(topSearch.toLowerCase()) ||
      r.note.toLowerCase().includes(topSearch.toLowerCase()) ||
      r.dataSet.toLowerCase().includes(topSearch.toLowerCase())
    );
  }, [topRows, topSearch]);

  const filteredPP = useMemo(() => {
    return potentialProviders.filter(p => 
      p.firstName.toLowerCase().includes(bottomSearch.toLowerCase()) ||
      p.lastName.toLowerCase().includes(bottomSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(bottomSearch.toLowerCase()) ||
      p.dataSet.toLowerCase().includes(bottomSearch.toLowerCase())
    );
  }, [potentialProviders, bottomSearch]);

  const filteredEnrollments = useMemo(() => {
    return MOCK_ENROLLMENTS.filter(e => 
      e.providerName.toLowerCase().includes(enrollSearch.toLowerCase()) ||
      e.program.toLowerCase().includes(enrollSearch.toLowerCase()) ||
      e.dataSet.toLowerCase().includes(enrollSearch.toLowerCase()) ||
      e.notes.toLowerCase().includes(enrollSearch.toLowerCase())
    );
  }, [enrollSearch]);

  return (
    <Box sx={{ width: 1, pb: 5, animation: `${fadeInUp} 0.3s ease-in-out` }}>
      
      {/* -------------------- 1. TOP TABLE (Revalidations) -------------------- */}
      <Box sx={{ pt: 2.5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden', mb: 5 }}>
        {/* Top Toolbar */}
        <Box sx={{ px: 2.5, display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search..."
            value={topSearch}
            onChange={(e) => {
              setTopSearch(e.target.value);
              setTopPage(0);
            }}
            slotProps={{
              input: {
                className: 'large',
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ color: theme.palette.text.disabled }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: 1, sm: 300 } }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="toolbar" startIcon={<Filter size={16} />}>
            Filters
          </Button>
          <Button variant="toolbar" startIcon={<Download size={16} />}>
            Export
          </Button>
        </Box>

        {/* Top Table */}
        <TableContainer sx={{ overflowX: 'auto', width: '100%', border: 'none' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 600, fontSize: '13px' } }}>
                <TableCell sx={{ width: '25%' }}>Name</TableCell>
                <TableCell sx={{ width: '15%' }}>Data Set</TableCell>
                <TableCell sx={{ width: '40%' }}>Note</TableCell>
                <TableCell sx={{ width: '15%' }}>Created</TableCell>
                <TableCell align="center" sx={{ width: '5%' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTopRows
                .slice(topPage * topRowsPerPage, topPage * topRowsPerPage + topRowsPerPage)
                .map((row, idx) => {
                  const isCream = idx % 2 === 0;
                  const rowBg = theme.palette.mode === 'light' 
                    ? (isCream ? '#FEF4E4' : '#FFFFFF')
                    : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');
                  return (
                    <TableRow 
                      key={row.id} 
                      sx={{ 
                        bgcolor: rowBg,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.primary.hover,
                          '& .MuiTableCell-root:first-of-type': {
                            '&, & .MuiTypography-root, & .MuiInputBase-input': {
                              color: theme.palette.primary.main,
                              transition: 'color 0.2s',
                              textDecoration: 'none',
                            }
                          }
                        },
                        '& td': { py: 1.2, px: 2 }
                      }}
                    >
                      <TableCell sx={{ fontSize: '14px', fontWeight: 400, textDecoration: 'underline' }}>
                        {row.name}
                      </TableCell>
                      <TableCell>{row.dataSet || '—'}</TableCell>
                      <TableCell>{row.note || '—'}</TableCell>
                      <TableCell>{dayjs(row.created).format('MM/DD/YYYY')}</TableCell>
                      <TableCell align="center">
                        <Check size={16} style={{ color: theme.palette.text.secondary }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          
          {/* Top Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, py: 1.5 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTopRows.length}
              rowsPerPage={topRowsPerPage}
              page={topPage}
              onPageChange={(_e, page) => setTopPage(page)}
              onRowsPerPageChange={(e) => {
                setTopRowsPerPage(parseInt(e.target.value, 10));
                setTopPage(0);
              }}
              sx={{ borderTop: 'none', '& .MuiTablePagination-toolbar': { padding: 0, minHeight: 'auto' } }}
            />
          </Box>
        </TableContainer>
      </Box>

      {/* -------------------- 2. MIDDLE TABS BAR -------------------- */}
      <Tabs 
        value={activeTab} 
        onChange={(_e, val) => setActiveTab(val)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ 
          mb: 3, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& .MuiTab-root': {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'none',
            px: 3,
            py: 1.5,
          }
        }}
      >
        <Tab icon={<RotateCw size={16} />} iconPosition="start" label="Potential Provider" />
        <Tab icon={<UserCheck size={16} />} iconPosition="start" label="Provider Enrollment" />
        <Tab icon={<Building size={16} />} iconPosition="start" label="Client Revalidation" />
        <Tab icon={<Users size={16} />} iconPosition="start" label="Provider Revalidation" />
      </Tabs>

      {/* -------------------- 3. BOTTOM TAB CONTENT -------------------- */}
      
      {/* --- TAB 1: POTENTIAL PROVIDER (EDITABLE TABLE) --- */}
      {activeTab === 0 && (
        <Box sx={{ pt: 2.5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden' }}>
          {/* Toolbar */}
          <Box sx={{ px: 2.5, display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search..."
              value={bottomSearch}
              onChange={(e) => {
                setBottomSearch(e.target.value);
                setBottomPage(0);
              }}
              slotProps={{
                input: {
                  className: 'large',
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} style={{ color: theme.palette.text.disabled }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: { xs: 1, sm: 300 } }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button 
              variant="toolbar" 
              startIcon={<Plus size={16} />}
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add
            </Button>
            <Button variant="toolbar" startIcon={<Filter size={16} />}>
              Filters
            </Button>
            <Button variant="toolbar" startIcon={<Download size={16} />}>
              Export
            </Button>
          </Box>

          {/* Table Container */}
          <TableContainer sx={{ overflowX: 'auto', width: '100%', border: 'none' }}>
            <Table sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow sx={{ '& th': { fontSize: '13px' } }}>
                  <TableCell>Notification</TableCell>
                  <TableCell>Data Set</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>NPI (required)</TableCell>
                  <TableCell>Email (optional)</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPP
                  .slice(bottomPage * bottomRowsPerPage, bottomPage * bottomRowsPerPage + bottomRowsPerPage)
                  .map((row, idx) => {
                    const isCream = idx % 2 === 0;
                    const rowBg = theme.palette.mode === 'light' 
                      ? (isCream ? '#FEF4E4' : '#FFFFFF')
                      : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');
                    const isDirty = isPPRowDirty(row);
                    return (
                      <TableRow 
                        key={row.id} 
                        sx={{ 
                          bgcolor: rowBg,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: theme.palette.primary.hover,
                            '& .MuiTableCell-root:first-of-type': {
                              '&, & .MuiTypography-root, & .MuiInputBase-input': {
                                color: theme.palette.primary.main,
                                transition: 'color 0.2s',
                                textDecoration: 'none',
                              }
                            }
                          },
                          '& td': { py: 1, px: 1.5, fontSize: '13px' }
                        }}
                      >
                        {/* Notification (Editable Date) */}
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              value={row.notification ? dayjs(row.notification) : null}
                              onChange={(newValue) => {
                                handlePPCellEdit(row.id, 'notification', newValue ? newValue.format('YYYY-MM-DD') : '');
                              }}
                              slotProps={{
                                textField: {
                                  className: 'inline'
                                }
                              }}
                            />
                          </LocalizationProvider>
                        </TableCell>

                        {/* Data Set (Editable Text) */}
                        <TableCell>
                          <InputBase
                            variant="cellEdit"
                            value={row.dataSet}
                            onChange={(e) => handlePPCellEdit(row.id, 'dataSet', e.target.value)}
                          />
                        </TableCell>

                        {/* First Name */}
                        <TableCell>
                          <InputBase
                            variant="cellEdit"
                            value={row.firstName}
                            onChange={(e) => handlePPCellEdit(row.id, 'firstName', e.target.value)}
                          />
                        </TableCell>

                        {/* Last Name */}
                        <TableCell>
                          <InputBase
                            variant="cellEdit"
                            value={row.lastName}
                            onChange={(e) => handlePPCellEdit(row.id, 'lastName', e.target.value)}
                          />
                        </TableCell>

                        {/* Title */}
                        <TableCell>
                          <InputBase
                            variant="cellEdit"
                            value={row.title}
                            onChange={(e) => handlePPCellEdit(row.id, 'title', e.target.value)}
                          />
                        </TableCell>

                        {/* NPI */}
                        <TableCell>
                          <InputBase
                            variant="cellEdit"
                            value={row.npi}
                            placeholder="NPI required"
                            onChange={(e) => handlePPCellEdit(row.id, 'npi', e.target.value)}
                          />
                        </TableCell>

                        {/* Email */}
                        <TableCell>
                          <InputBase
                            variant="cellEdit"
                            value={row.email}
                            onChange={(e) => handlePPCellEdit(row.id, 'email', e.target.value)}
                          />
                        </TableCell>

                        {/* Start (Editable Date) */}
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              value={row.start ? dayjs(row.start) : null}
                              onChange={(newValue) => {
                                handlePPCellEdit(row.id, 'start', newValue ? newValue.format('YYYY-MM-DD') : '');
                              }}
                              slotProps={{
                                textField: {
                                  className: 'inline'
                                }
                              }}
                            />
                          </LocalizationProvider>
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <IconButton size="small">
                              <UserPlus size={16} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDiscardPPRow(row.id)}
                              disabled={!isDirty}
                              sx={{ color: isDirty ? 'primary.main' : 'text.disabled' }}
                            >
                              <History size={16} />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDeletePP(row.id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Save/Discard & Pagination Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button 
                variant="signInV2" 
                color="primary"
                disabled={!hasPPChanges}
                onClick={handleSaveAllPP}
              >
                Save All
              </Button>
              <Button 
                variant="signInV2"
                disabled={!hasPPChanges}
                onClick={handleDiscardAllPP}
              >
                Discard All Changes
              </Button>
            </Box>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredPP.length}
              rowsPerPage={bottomRowsPerPage}
              page={bottomPage}
              onPageChange={(_e, page) => setBottomPage(page)}
              onRowsPerPageChange={(e) => {
                setBottomRowsPerPage(parseInt(e.target.value, 10));
                setBottomPage(0);
              }}
              sx={{ borderTop: 'none', '& .MuiTablePagination-toolbar': { padding: 0, minHeight: 'auto' } }}
            />
          </Box>
        </Box>
      )}

      {/* --- TAB 2: PROVIDER ENROLLMENT (NESTED HEADERS TABLE) --- */}
      {activeTab === 1 && (
        <Box sx={{ pt: 2.5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden' }}>
          {/* Toolbar */}
          <Box sx={{ px: 2.5, display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search..."
              value={enrollSearch}
              onChange={(e) => {
                setEnrollSearch(e.target.value);
                setEnrollPage(0);
              }}
              slotProps={{
                input: {
                  className: 'large',
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} style={{ color: theme.palette.text.disabled }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: { xs: 1, sm: 300 } }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="toolbar" startIcon={<Filter size={16} />}>
              Filters
            </Button>
            <Button variant="toolbar" startIcon={<Download size={16} />}>
              Export
            </Button>
          </Box>

          {/* Nested Header Table */}
          <TableContainer sx={{ overflowX: 'auto', width: '100%', border: 'none' }}>
            <Table sx={{ minWidth: 1500 }}>
              <TableHead>
                {/* Row 1: Top Level */}
                <TableRow sx={{ '& th': { borderBottom: '1px solid #E0E0E0', borderRight: '1px solid #E0E0E0', textAlign: 'center' } }}>
                  <TableCell rowSpan={3} sx={{ borderRight: '1px solid #E0E0E0', textAlign: 'left !important' }}>Data Set</TableCell>
                  <TableCell rowSpan={3} sx={{ borderRight: '1px solid #E0E0E0', textAlign: 'left !important' }}>Provider</TableCell>
                  <TableCell rowSpan={3} sx={{ borderRight: '1px solid #E0E0E0', textAlign: 'left !important' }}>First</TableCell>
                  <TableCell rowSpan={3} sx={{ borderRight: '1px solid #E0E0E0', textAlign: 'left !important' }}>Last</TableCell>
                  <TableCell rowSpan={3} sx={{ borderRight: '1px solid #E0E0E0', textAlign: 'left !important' }}>Program</TableCell>
                  <TableCell rowSpan={3} sx={{ borderRight: '1px solid #E0E0E0', textAlign: 'left !important' }}>Provider#</TableCell>
                  <TableCell rowSpan={3} sx={{ borderRight: '1px solid #E0E0E0', textAlign: 'left !important' }}>Tracking#</TableCell>
                  <TableCell colSpan={6}>Enrollment</TableCell>
                </TableRow>
                {/* Row 2: Mid Level */}
                <TableRow sx={{ '& th': { borderBottom: '1px solid #E0E0E0', borderRight: '1px solid #E0E0E0', textAlign: 'center' } }}>
                  <TableCell rowSpan={2} sx={{ borderRight: '1px solid #E0E0E0' }}>Notification</TableCell>
                  <TableCell colSpan={3} sx={{ borderRight: '1px solid #E0E0E0' }}>Provider</TableCell>
                  <TableCell rowSpan={2} sx={{ borderRight: '1px solid #E0E0E0' }}>Carrier</TableCell>
                  <TableCell rowSpan={2}>Completed</TableCell>
                </TableRow>
                {/* Row 3: Bottom Level */}
                <TableRow sx={{ '& th': { borderBottom: '1px solid #E0E0E0', borderRight: '1px solid #E0E0E0' } }}>
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0' }}>Entry</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0' }}>Sent</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0' }}>Missing/Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEnrollments
                  .slice(enrollPage * enrollRowsPerPage, enrollPage * enrollRowsPerPage + enrollRowsPerPage)
                  .map((row, idx) => {
                    const isCream = idx % 2 === 0;
                    const rowBg = theme.palette.mode === 'light' 
                      ? (isCream ? '#FEF4E4' : '#FFFFFF')
                      : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');
                    return (
                      <TableRow 
                        key={row.id} 
                        sx={{ 
                          bgcolor: rowBg,
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: theme.palette.primary.hover,
                            '& .MuiTableCell-root:first-of-type': {
                              '&, & .MuiTypography-root, & .MuiInputBase-input': {
                                color: theme.palette.primary.main,
                                transition: 'color 0.2s',
                                textDecoration: 'none',
                              }
                            }
                          },
                          '& td': { py: 1.5, px: 1, fontSize: '13px', borderBottom: '1px solid #EEE', borderRight: '1px solid #EEE', verticalAlign: 'top', color: '#333' }
                        }}
                      >
                        <TableCell sx={{ fontSize: '14px', fontWeight: 600 }}>{row.dataSet}</TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: theme.palette.primary.main }}>
                            {row.providerName}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                            {row.providerEmail}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.first}</TableCell>
                        <TableCell>{row.last}</TableCell>
                        <TableCell>{row.program}</TableCell>
                        <TableCell>{row.providerNum}</TableCell>
                        <TableCell>{row.trackingNum || '—'}</TableCell>
                        
                        {/* Notification */}
                        <TableCell>{dayjs(row.notification).format('MM/DD/YYYY')}</TableCell>
                        
                        {/* Entry */}
                        <TableCell>
                          <Typography sx={{ fontSize: '13px' }}>
                            {dayjs(row.entryDate).format('MM/DD/YYYY')}
                          </Typography>
                          <Box sx={{ mt: 0.5, bgcolor: '#4caf50', color: '#FFF', px: 1, py: 0.2, borderRadius: 1, display: 'inline-block', fontSize: '12px', fontWeight: 700 }}>
                            {row.entryDays} Days
                          </Box>
                        </TableCell>

                        {/* Sent */}
                        <TableCell>
                          {row.sentDate ? (
                            <>
                              <Typography sx={{ fontSize: '13px' }}>
                                {dayjs(row.sentDate).format('MM/DD/YYYY')}
                              </Typography>
                              {row.sentDays !== undefined && (
                                <Box sx={{ mt: 0.5, bgcolor: '#4caf50', color: '#FFF', px: 1, py: 0.2, borderRadius: 1, display: 'inline-block', fontSize: '12px', fontWeight: 700 }}>
                                  {row.sentDays} Days
                                </Box>
                              )}
                            </>
                          ) : '—'}
                        </TableCell>

                        {/* Missing/Notes */}
                        <TableCell sx={{ maxWidth: 300 }}>{row.notes || '—'}</TableCell>

                        {/* Carrier */}
                        <TableCell>
                          {row.carrierDate ? (
                            <>
                              <Typography sx={{ fontSize: '13px' }}>
                                {dayjs(row.carrierDate).format('MM/DD/YYYY')}
                              </Typography>
                              {row.carrierDays !== undefined && (
                                <Box sx={{ mt: 0.5, bgcolor: '#4caf50', color: '#FFF', px: 1, py: 0.2, borderRadius: 1, display: 'inline-block', fontSize: '12px', fontWeight: 700 }}>
                                  {row.carrierDays} Days
                                </Box>
                              )}
                            </>
                          ) : '—'}
                        </TableCell>

                        {/* Completed */}
                        <TableCell align="center">
                          {row.completed ? <Check size={16} /> : '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Tab 2 Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, py: 1.5 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredEnrollments.length}
              rowsPerPage={enrollRowsPerPage}
              page={enrollPage}
              onPageChange={(_e, page) => setEnrollPage(page)}
              onRowsPerPageChange={(e) => {
                setEnrollRowsPerPage(parseInt(e.target.value, 10));
                setEnrollPage(0);
              }}
              sx={{ borderTop: 'none', '& .MuiTablePagination-toolbar': { padding: 0, minHeight: 'auto' } }}
            />
          </Box>
        </Box>
      )}

      {/* --- TAB 3: CLIENT REVALIDATION (EMPTY STATE) --- */}
      {activeTab === 2 && (
        <Card sx={{ p: 8, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
          <Building size={48} style={{ color: theme.palette.text.disabled, marginBottom: 16 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Client Revalidation
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', mt: 1 }}>
            There are currently no clients requiring revalidation.
          </Typography>
        </Card>
      )}

      {/* --- TAB 4: PROVIDER REVALIDATION (EMPTY STATE) --- */}
      {activeTab === 3 && (
        <Card sx={{ p: 8, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
          <UserCheck size={48} style={{ color: theme.palette.text.disabled, marginBottom: 16 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Provider Revalidation
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', mt: 1 }}>
            There are currently no providers requiring revalidation.
          </Typography>
        </Card>
      )}

      <Dialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleAddPP,
            sx: {
              borderRadius: 2,
              boxShadow: theme.customShadows.z24,
              animation: `${fadeInUp} 0.3s ease-in-out`
            }
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 2.5, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            bgcolor: 'background.paper'
          }}
        >
          <Box 
            sx={{ 
              width: 22, 
              height: 22, 
              borderRadius: '50%', 
              padding: '0',
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: theme.palette.primary.main
            }}
          >
            <UserPlus size={20} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: 0, fontSize: '18px' }}>
            Add Potential Provider
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, pt: 5, pb: 3, px: 4.5 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Notification"
                value={newPP.notification ? dayjs(newPP.notification) : null}
                onChange={(newValue) => {
                  setNewPP(prev => ({ ...prev, notification: newValue ? newValue.format('YYYY-MM-DD') : '' }));
                }}
                slotProps={{
                  textField: { 
                    required: true, 
                    className: 'large-input'
                  }
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Data Set"
              required
              placeholder="e.g. E09"
              value={newPP.dataSet}
              onChange={(e) => setNewPP(prev => ({ ...prev, dataSet: e.target.value }))}
            />

            <TextField
              label="First Name"
              required
              placeholder="First Name"
              value={newPP.firstName}
              onChange={(e) => setNewPP(prev => ({ ...prev, firstName: e.target.value }))}
            />

            <TextField
              label="Last Name"
              required
              placeholder="Last Name"
              value={newPP.lastName}
              onChange={(e) => setNewPP(prev => ({ ...prev, lastName: e.target.value }))}
            />

            <TextField
              label="Title"
              required
              placeholder="e.g. MD"
              value={newPP.title}
              onChange={(e) => setNewPP(prev => ({ ...prev, title: e.target.value }))}
            />

            <TextField
              label="NPI (optional)"
              placeholder="NPI number"
              value={newPP.npi}
              onChange={(e) => setNewPP(prev => ({ ...prev, npi: e.target.value }))}
            />

            <TextField
              label="Email (optional)"
              placeholder="email@example.com"
              type="email"
              value={newPP.email}
              onChange={(e) => setNewPP(prev => ({ ...prev, email: e.target.value }))}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Start"
                value={newPP.start ? dayjs(newPP.start) : null}
                onChange={(newValue) => {
                  setNewPP(prev => ({ ...prev, start: newValue ? newValue.format('YYYY-MM-DD') : '' }));
                }}
                slotProps={{
                  textField: { 
                    required: true, 
                    className: 'large-input'
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 7, pb: 5, gap: 1.5, bgcolor: theme.palette.background.default }}>
          <Button 
            variant="modalCancel" 
            color="inherit"
            onClick={() => setIsAddDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="modalAdd"
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
