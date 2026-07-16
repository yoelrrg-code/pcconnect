import { useState, useMemo, useCallback } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  InputAdornment, 
  useTheme, 
  alpha,
  TablePagination,
  IconButton,
  NativeSelect,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Popover
} from '@mui/material';
import { Search, Filter, Download, UserPlus, History, X } from 'lucide-react';
import { GREY } from '../../../theme/palette';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

export interface PlaidConnection {
  id: string;
  dataSet: string;
  url: string;
  bankName: string;
  shortBankName: string;
  lastDate: string; // YYYY-MM-DD
  error: string;
  active: 'Yes' | 'No';
}

const MOCK_CONNECTIONS: PlaidConnection[] = [
  { id: '1', dataSet: 'G34', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=2d47c8f0-0278-4d0c-bae5-e2de760fcc75', bankName: 'Banc of California (Previously Pacific Western Bank) - Business', shortBankName: '', lastDate: '2026-07-15', error: 'Deposit was empty. CAESJWDzajdkSzFBN01JdnJ4NE5WYWEycT5aeVptbFPbXQ4S', active: 'Yes' },
  { id: '2', dataSet: 'G34', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=87e65633-1faf-44d9-b3e5-d0a53442ac94', bankName: 'Columbia Bank - Commercial', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '3', dataSet: 'E09', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=f17ad8a2-c1a3-44d7-b852-97da34a61574', bankName: 'Columbia Bank - Commercial', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '4', dataSet: 'G58', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=cfe2b5ff-77b3-4fc2-98b8-6e11082f589c', bankName: 'Bank of Marin', shortBankName: '', lastDate: '2026-07-15', error: 'Deposit was empty. CAESJWDoWKxxSk9QYnZzdjF5cnB0QeEJLY2E3T0pOMVJnd2M2', active: 'Yes' },
  { id: '5', dataSet: 'G58', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=c02788e8-b90f-44d9-a3e8-abfdf112f7bc', bankName: 'U.S. Bank', shortBankName: '', lastDate: '2026-07-01', error: 'TooManyRequests - rate limit exceeded for attempts to access "transactions/sync", please try again later', active: 'No' },
  { id: '6', dataSet: 'H02', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=a40b3968-38e1-4877-a7dc-08d6cecea724', bankName: 'Bank of America', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '7', dataSet: 'G24', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=21112581-f8eb-4682-a0ff-34b7100a5808', bankName: 'Citizens Business Bank', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '8', dataSet: 'G64', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=76c1bb21-cd42-44bf-b95a-cc60z948b281', bankName: 'Citizens Business Bank', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '9', dataSet: 'A01', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=ee1ff7bf-d2bc-4aa5-8e66-d049f9c0f891', bankName: 'Columbia Bank - Commercial', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '10', dataSet: 'A12', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=26d77955-4fc3-457e-a8cd-dcf3b52af850', bankName: 'Lincoln Savings Bank (IA) - Online Banking', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '11', dataSet: 'G68', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=bc5aa135-21b5-4ed9-8259-fc011a5b3444', bankName: 'Fremont Bank', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '12', dataSet: 'G68', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=d1ce3cc8-be17-44ba-8841-ca585cb57d5b', bankName: 'Fremont Bank', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '13', dataSet: 'H03', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=5ae47b70-8499-4675-ac7b-86f2ad042c15', bankName: 'Chase', shortBankName: '', lastDate: '2026-07-15', error: '', active: 'Yes' },
  { id: '14', dataSet: 'S01', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=00000000-0000-0000-0000-000000000000', bankName: 'IncredibleBank', shortBankName: '', lastDate: '2026-03-04', error: '', active: 'No' },
  { id: '15', dataSet: 'E07', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=c4daa82e-1c2a-4d3b-85aa-fb542f974ef4', bankName: '', shortBankName: '', lastDate: '2025-06-18', error: '', active: 'No' },
  { id: '16', dataSet: 'E07', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=90930c7b-46f9-40bd-9990-e571768d6b72', bankName: '', shortBankName: '', lastDate: '2026-06-18', error: '', active: 'No' },
  { id: '17', dataSet: 'E07', url: 'https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=9cc3cd10-3dbe-491f-b029-e0cf7682ddb9', bankName: '', shortBankName: '', lastDate: '2026-06-19', error: '', active: 'No' },
];

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }
  return dateStr;
};

export default function PlaidManagementView() {
  const theme = useTheme();

  // Connections States
  const [connections, setConnections] = useState<PlaidConnection[]>(MOCK_CONNECTIONS);
  const [originalConnections, setOriginalConnections] = useState<Record<string, PlaidConnection>>(() => 
    MOCK_CONNECTIONS.reduce((acc, c) => ({ ...acc, [c.id]: c }), {})
  );

  // Dialog State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    dataSet: 'G34',
    email: ''
  });

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterDataSet, setFilterDataSet] = useState('');
  const [filterUrl, setFilterUrl] = useState('');
  const [filterBankName, setFilterBankName] = useState('');
  const [filterShortBankName, setFilterShortBankName] = useState('');
  const [filterLastDate, setFilterLastDate] = useState('');
  const [filterError, setFilterError] = useState('');
  const [filterActive, setFilterActive] = useState('All');

  // Popover States
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterColumn, setFilterColumn] = useState<keyof PlaidConnection>('dataSet');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };
  const isFiltersOpen = Boolean(filterAnchorEl);

  const REPORT_COLUMNS: { key: keyof PlaidConnection; label: string }[] = [
    { key: 'dataSet', label: 'Data Set' },
    { key: 'url', label: 'URL' },
    { key: 'bankName', label: 'Bank Name' },
    { key: 'shortBankName', label: 'Short Bank Name' },
    { key: 'lastDate', label: 'Last Date' },
    { key: 'error', label: 'Error' },
    { key: 'active', label: 'Active' },
  ];

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Cell editing handler (only active is editable in this view)
  const handleCellEdit = (connId: string, field: 'active', value: 'Yes' | 'No') => {
    setConnections(prev => prev.map(c => c.id === connId ? { ...c, [field]: value } : c));
  };

  // Discard changes in a row
  const handleDiscardRowChanges = (connId: string) => {
    const original = originalConnections[connId];
    if (original) {
      setConnections(prev => prev.map(c => c.id === connId ? { ...original } : c));
    }
  };

  // Determine if a row has unsaved modifications
  const isRowDirty = useCallback((row: PlaidConnection) => {
    const original = originalConnections[row.id];
    if (!original) return false;
    return row.active !== original.active;
  }, [originalConnections]);

  // Save all dirty changes
  const handleSaveAllChanges = () => {
    const newOriginals = connections.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
    setOriginalConnections(newOriginals);
  };

  // Discard all dirty changes
  const handleDiscardAllChanges = () => {
    setConnections(prev => prev.map(c => originalConnections[c.id] ? { ...originalConnections[c.id] } : c));
  };

  // Check if there are any pending changes
  const hasChanges = useMemo(() => {
    return connections.some(isRowDirty);
  }, [connections, isRowDirty]);

  // Filter logic
  const filteredConnections = useMemo(() => {
    return connections.filter((c) => {
      const matchesGlobal = 
        globalSearch === '' ||
        c.dataSet.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.url.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.bankName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.error.toLowerCase().includes(globalSearch.toLowerCase()) ||
        formatDateDisplay(c.lastDate).includes(globalSearch);

      const matchesDataSet = 
        filterDataSet === '' ||
        c.dataSet.toLowerCase().includes(filterDataSet.toLowerCase());

      const matchesUrl = 
        filterUrl === '' ||
        c.url.toLowerCase().includes(filterUrl.toLowerCase());

      const matchesBankName = 
        filterBankName === '' ||
        c.bankName.toLowerCase().includes(filterBankName.toLowerCase());

      const matchesShortBankName = 
        filterShortBankName === '' ||
        c.shortBankName.toLowerCase().includes(filterShortBankName.toLowerCase());

      const matchesLastDate = 
        filterLastDate === '' ||
        c.lastDate === filterLastDate;

      const matchesError = 
        filterError === '' ||
        c.error.toLowerCase().includes(filterError.toLowerCase());

      const matchesActive = 
        filterActive === 'All' ||
        c.active === filterActive;

      if (!(
        matchesGlobal &&
        matchesDataSet &&
        matchesUrl &&
        matchesBankName &&
        matchesShortBankName &&
        matchesLastDate &&
        matchesError &&
        matchesActive
      )) {
        return false;
      }

      // Popover Filter
      if (filterValue === '' && filterOperator !== 'is empty' && filterOperator !== 'is not empty') {
        return true;
      }

      const targetValue = 
        filterColumn === 'lastDate' ? formatDateDisplay(c.lastDate) :
        (c[filterColumn] ?? '').toString();

      const val = targetValue.toLowerCase();
      const term = filterValue.toLowerCase();

      switch (filterOperator) {
        case 'contains':
          return val.includes(term);
        case 'does not contain':
          return !val.includes(term);
        case 'equals':
          return val === term;
        case 'does not equal':
          return val !== term;
        case 'starts with':
          return val.startsWith(term);
        case 'ends with':
          return val.endsWith(term);
        case 'is empty':
          return val.trim() === '';
        case 'is not empty':
          return val.trim() !== '';
        case 'is any of': {
          const terms = term.split(',').map(t => t.trim()).filter(Boolean);
          return terms.length === 0 || terms.some(t => val.includes(t));
        }
        default:
          return true;
      }
    });
  }, [
    globalSearch,
    filterDataSet,
    filterUrl,
    filterBankName,
    filterShortBankName,
    filterLastDate,
    filterError,
    filterActive,
    filterColumn,
    filterOperator,
    filterValue,
    connections
  ]);

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // CSV export
  const handleExport = () => {
    const headers = ['Data Set', 'Url', 'Bank Name', 'Short Bank Name', 'Last Date', 'Error', 'Active'];
    const rows = filteredConnections.map(c => [
      `"${c.dataSet.replace(/"/g, '""')}"`,
      `"${c.url.replace(/"/g, '""')}"`,
      `"${c.bankName.replace(/"/g, '""')}"`,
      `"${c.shortBankName.replace(/"/g, '""')}"`,
      `"${formatDateDisplay(c.lastDate)}"`,
      `"${c.error.replace(/"/g, '""')}"`,
      `"${c.active}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plaid_connections.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleConnections = useMemo(() => {
    return filteredConnections.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredConnections, page, rowsPerPage]);

  const uniqueDataSets = useMemo(() => {
    const dataSets = new Set(connections.map(c => c.dataSet));
    return Array.from(dataSets);
  }, [connections]);

  // Add (Send Invitation)
  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvitation.email || !newInvitation.dataSet) return;
    
    const connection: PlaidConnection = {
      id: String(Date.now()),
      dataSet: newInvitation.dataSet,
      url: `https://secure.physchoice.com/pcconnect/36F45B95-AA81-485E-9FDE-997FC657D4D4?userId=${newInvitation.email}`,
      bankName: '',
      shortBankName: '',
      lastDate: dayjs().format('YYYY-MM-DD'),
      error: '',
      active: 'No'
    };
    
    setConnections(prev => [connection, ...prev]);
    setOriginalConnections(prev => ({ ...prev, [connection.id]: connection }));
    setIsModalOpen(false);
    
    // Reset form
    setNewInvitation({
      dataSet: 'G34',
      email: ''
    });
  };

  return (
    <Box sx={{ pt: 2.5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden', animation: `${fadeInUp} 0.3s ease-in-out` }}>
      
      {/* Action Toolbar */}
      <Box sx={{ px: 2.5, display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search..."
          value={globalSearch}
          onChange={(e) => {
            setGlobalSearch(e.target.value);
            setPage(0);
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
          startIcon={<UserPlus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add
        </Button>
        
        <Button
          variant="toolbar"
          startIcon={<Filter size={16} />}
          onClick={handleOpenFilters}
        >
          Filters
        </Button>

        <Popover
          open={isFiltersOpen}
          anchorEl={filterAnchorEl}
          onClose={handleCloseFilters}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                p: 3,
                mt: 0.5,
                borderRadius: 2,
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
                background: 'linear-gradient(135deg, rgba(255, 240, 240, 0.95) 0%, rgba(240, 248, 255, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }
            }
          }}
        >
          <IconButton 
            size="small" 
            onClick={() => {
              setFilterValue('');
              handleCloseFilters();
            }}
            sx={{ color: GREY[700] }}
          >
            <X size={18} />
          </IconButton>

          <TextField
            select
            label="Columns"
            value={filterColumn}
            onChange={(e) => {
              setFilterColumn(e.target.value as keyof PlaidConnection);
              setPage(0);
            }}
            slotProps={{
              select: { native: true }
            }}
            sx={{ minWidth: 140 }}
          >
            {REPORT_COLUMNS.map((col) => (
              <option key={col.key} value={col.key}>
                {col.label}
              </option>
            ))}
          </TextField>

          <TextField
            select
            label="Operator"
            value={filterOperator}
            onChange={(e) => {
              setFilterOperator(e.target.value);
              setPage(0);
            }}
            slotProps={{
              select: { native: true }
            }}
            sx={{ minWidth: 160 }}
          >
            <option value="contains">contains</option>
            <option value="does not contain">does not contain</option>
            <option value="equals">equals</option>
            <option value="does not equal">does not equal</option>
            <option value="starts with">starts with</option>
            <option value="ends with">ends with</option>
            <option value="is empty">is empty</option>
            <option value="is not empty">is not empty</option>
            <option value="is any of">is any of</option>
          </TextField>

          <TextField
            label="Value"
            placeholder="Filter value"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 160 }}
          />
        </Popover>

        <Button
          variant="toolbar"
          startIcon={<Download size={16} />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', border: 'none' }}>
        <Table sx={{ minWidth: 1500 }} aria-label="plaid connections table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 50 }}>Data Set</TableCell>
              <TableCell sx={{ width: 280 }}>Url</TableCell>
              <TableCell sx={{ width: 250 }}>Bank Name</TableCell>
              <TableCell sx={{ width: 120 }}>Short Bank Name</TableCell>
              <TableCell sx={{ width: 80 }}>Last Date</TableCell>
              <TableCell sx={{ width: 250 }}>Error</TableCell>
              <TableCell sx={{ width: 80 }}>Active</TableCell>
              <TableCell sx={{ width: 80, textAlign: 'center' }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Filter Inputs Row */}
              <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                {/* Data Set Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterDataSet}
                    onChange={(e) => {
                      setFilterDataSet(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* Url Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterUrl}
                    onChange={(e) => {
                      setFilterUrl(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* Bank Name Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterBankName}
                    onChange={(e) => {
                      setFilterBankName(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* Short Bank Name Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterShortBankName}
                    onChange={(e) => {
                      setFilterShortBankName(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* Last Date Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Is"
                      value={filterLastDate ? dayjs(filterLastDate) : null}
                      onChange={(newValue) => {
                        setFilterLastDate(newValue ? newValue.format('YYYY-MM-DD') : '');
                        setPage(0);
                      }}
                      slotProps={{
                        textField: { 
                          className: 'small'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </TableCell>

                {/* Error Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterError}
                    onChange={(e) => {
                      setFilterError(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* Active Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    select
                    size="small"
                    label="Is"
                    value={filterActive}
                    className="inline"
                    onChange={(e) => {
                      setFilterActive(e.target.value);
                      setPage(0);
                    }}
                    slotProps={{
                      select: { native: true }
                    }}
                    fullWidth
                  >
                    <option value="All">All</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </TextField>
                </TableCell>

                {/* Reset button empty space */}
                <TableCell sx={{ p: 1.5 }}></TableCell>
              </TableRow>

            {/* List Rows */}
            {visibleConnections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No Plaid connections found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              visibleConnections.map((row, index) => {
                const isCream = index % 2 === 0;
                const rowBg = theme.palette.mode === 'light' 
                  ? (isCream ? '#FEF4E4' : '#FFFFFF')
                  : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');

                const dirty = isRowDirty(row);

                return (
                  <TableRow 
                    key={row.id}
                    sx={{ 
                      bgcolor: rowBg,
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: theme.palette.primary.hover,
                      }
                    }}
                  >
                    {/* Data Set */}
                    <TableCell sx={{ fontSize: '14px', px: 2 }}>{row.dataSet}</TableCell>

                    {/* Url */}
                    <TableCell sx={{ px: 2, maxWidth: 340 }}>
                      <Typography variant="body1" sx={{ fontSize: '13px', wordBreak: 'break-all' }}>
                        {row.url}
                      </Typography>
                    </TableCell>

                    {/* Bank Name */}
                    <TableCell sx={{ px: 2 }}>{row.bankName || '—'}</TableCell>

                    {/* Short Bank Name */}
                    <TableCell sx={{ px: 2 }}>{row.shortBankName || '—'}</TableCell>

                    {/* Last Date */}
                    <TableCell sx={{ px: 2 }}>{formatDateDisplay(row.lastDate)}</TableCell>

                    {/* Error */}
                    <TableCell sx={{ px: 2, maxWidth: 340 }}>
                      <Box sx={{ fontSize: '13px', color: 'error.main', wordBreak: 'break-word' }}>
                        {row.error || '—'}
                      </Box>
                    </TableCell>

                    {/* Active (Editable Select) */}
                    <TableCell sx={{ px: 2 }}>
                      <NativeSelect
                        className="cellEdit"
                        value={row.active}
                        onChange={(e) => handleCellEdit(row.id, 'active', e.target.value as 'Yes' | 'No')}
                        disableUnderline
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </NativeSelect>
                    </TableCell>

                    {/* Reset Button */}
                    <TableCell sx={{ px: 1, textAlign: 'center' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleDiscardRowChanges(row.id)}
                        disabled={!dirty}
                        sx={{
                          color: dirty ? 'primary.main' : 'text.disabled',
                          transition: 'color 0.2s',
                        }}
                        title="Discard changes"
                      >
                        <History size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Bottom Actions and Pagination */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: 2,
            px: 2.5,
            py: 1.5,
          }}
        >
          {/* Bulk Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="signInV2"
              disabled={!hasChanges}
              onClick={handleSaveAllChanges}
            >
              Save All
            </Button>
            <Button
              variant="signInV2"
              disabled={!hasChanges}
              onClick={handleDiscardAllChanges}
            >
              Discard All Changes
            </Button>
          </Box>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredConnections.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ 
              borderTop: 'none',
              '& .MuiTablePagination-toolbar': {
                padding: 0,
                minHeight: 'auto',
              }
            }}
          />
        </Box>
      </TableContainer>

      {/* Send Invitation Dialog Form */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSendInvitation,
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
            <UserPlus size={18} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: 0, fontSize: '18px' }}>
            Send Invitation
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 4, pt: 5, pb: 3, px: 4.5 }}>
            <TextField
              select
              fullWidth
              label="Data Set"
              value={newInvitation.dataSet}
              onChange={(e) => setNewInvitation(prev => ({ ...prev, dataSet: e.target.value }))}
              slotProps={{ select: { native: true } }}
            >
              {uniqueDataSets.map(ds => (
                <option key={ds} value={ds}>{ds}</option>
              ))}
            </TextField>

            <TextField
              required
              fullWidth
              type="email"
              label="Email"
              placeholder="Email address"
              value={newInvitation.email}
              onChange={(e) => setNewInvitation(prev => ({ ...prev, email: e.target.value }))}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3.5, pb: 3, bgcolor: theme.palette.background.default, justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="modalCancel"
              onClick={() => setIsModalOpen(false)}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="modalAdd" 
              disabled={!newInvitation.email || !newInvitation.dataSet}
              sx={{ minWidth: 100 }}
            >
              Send
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
