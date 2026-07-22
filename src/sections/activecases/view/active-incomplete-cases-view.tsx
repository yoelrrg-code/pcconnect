import { useState, useMemo } from 'react';
import ActiveIncompleteCasesDetailsView from './active-incomplete-cases-details-view';
import ActiveIncompleteCasesChartView from './active-incomplete-cases-chart-view';
import { MOCK_PC_QUEUE, MOCK_WAITING_REVIEW } from './active-incomplete-cases-mock';
import type { PCQueueCase, WaitingReviewCase } from './active-incomplete-cases-mock';
import { 
  Box, 
  Typography, 
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
  Link, 
  useTheme, 
  alpha,
  TablePagination,
  Popover,
  IconButton
} from '@mui/material';
import { Search, Filter, Download, X } from 'lucide-react';
import { GREY } from '../../../theme/palette';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

/**
 * Interfaz que define la estructura de un caso activo o incompleto de inscripción.
 */
interface ActiveIncompleteCase {
  id: string;
  provider: string;
  caseCount: string;
  lastCommentDate: string;
  time?: string;
  isInvalidDate?: boolean;
}

const MOCK_CASES: ActiveIncompleteCase[] = [
  { id: '1', provider: 'Cardinal Emergency Providers 523-155', caseCount: '285/248', lastCommentDate: '05/27/2026', time: '3:12 pm' },
  { id: '2', provider: 'Ignite Emergency Physicians - [Desert Valley] 523-118', caseCount: '277/212', lastCommentDate: '05/04/2026', time: '4:13 pm' },
  { id: '3', provider: 'Mountain View Emergency', caseCount: '284/183', lastCommentDate: '04/30/2026', time: '2:10 pm' },
  { id: '4', provider: 'Heartland Anesthesia 523-131 - 3 (Apex City ASC)', caseCount: '150/48', lastCommentDate: '04/30/2026', time: '1:12 pm' },
  { id: '5', provider: 'EPA San Jose - SCValley Medical Center (Sc)', caseCount: '278/112', lastCommentDate: '04/29/2026', time: '2:22 pm' },
  { id: '6', provider: 'Healy Critical Care Services', caseCount: '1956/104', lastCommentDate: '03/24/2026', time: '1:10 pm' },
  { id: '7', provider: 'Ignite Emergency Physicians - [Victorville] 523-118', caseCount: '22/04', lastCommentDate: '06/08/2026', time: '3:12 pm' },
  { id: '8', provider: 'Ignite Emergency Physicians - 2 [Chino Valley] 523-118', caseCount: '95/81', lastCommentDate: '05/28/2026', time: '3:12 pm' },
  { id: '9', provider: 'Heartland Anesthesia 523-131- 1 (Asc of Central Iowa)', caseCount: '50/50', lastCommentDate: 'invalid date', isInvalidDate: true },
  { id: '10', provider: 'South Coast Emerg Med Grp', caseCount: '51/40', lastCommentDate: '07/07/2026', time: '3:12 pm' },
  { id: '11', provider: 'Mountain View UC - Elko (Turkey)', caseCount: '151/35', lastCommentDate: '04/23/2026', time: '2:12 pm' },
  { id: '12', provider: 'Emergency Physicians at San Gabriel Valley', caseCount: '48/39', lastCommentDate: '05/05/2026', time: '4:12 pm' },
  { id: '13', provider: 'OC Emergency Physicians 523-154', caseCount: '154/56', lastCommentDate: '05/06/2026', time: '3:12 pm' },
];

/**
 * Vista del listado de Casos Activos e Incompletos.
 * Muestra una tabla con métricas clave y permite filtrar por proveedor, cantidad de casos y fechas.
 */
export default function ActiveIncompleteCasesView() {
  const theme = useTheme();

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedAccountData, setSelectedAccountData] = useState<PCQueueCase | WaitingReviewCase | null>(null);

  const combinedAccounts = useMemo(() => {
    return [...MOCK_PC_QUEUE, ...MOCK_WAITING_REVIEW];
  }, []);

  const handlePreviousAccount = () => {
    if (!selectedAccount) return;
    const currentIndex = combinedAccounts.findIndex(item => item.account === selectedAccount);
    if (currentIndex > 0) {
      const prevItem = combinedAccounts[currentIndex - 1];
      setSelectedAccount(prevItem.account);
      setSelectedAccountData(prevItem);
    } else {
      const lastItem = combinedAccounts[combinedAccounts.length - 1];
      setSelectedAccount(lastItem.account);
      setSelectedAccountData(lastItem);
    }
  };

  const handleNextAccount = () => {
    if (!selectedAccount) return;
    const currentIndex = combinedAccounts.findIndex(item => item.account === selectedAccount);
    if (currentIndex >= 0 && currentIndex < combinedAccounts.length - 1) {
      const nextItem = combinedAccounts[currentIndex + 1];
      setSelectedAccount(nextItem.account);
      setSelectedAccountData(nextItem);
    } else {
      const firstItem = combinedAccounts[0];
      setSelectedAccount(firstItem.account);
      setSelectedAccountData(firstItem);
    }
  };

  // Search & filter states
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [filterCaseCount, setFilterCaseCount] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Popover States
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterColumn, setFilterColumn] = useState<keyof ActiveIncompleteCase>('provider');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };
  const isFiltersOpen = Boolean(filterAnchorEl);

  const REPORT_COLUMNS: { key: keyof ActiveIncompleteCase; label: string }[] = [
    { key: 'provider', label: 'Provider' },
    { key: 'caseCount', label: 'Case Count' },
    { key: 'lastCommentDate', label: 'Last Comment Date' },
  ];

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter logic
  const filteredCases = useMemo(() => {
    return MOCK_CASES.filter((c) => {
      const matchesGlobal = 
        globalSearch === '' ||
        c.provider.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.caseCount.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.lastCommentDate.toLowerCase().includes(globalSearch.toLowerCase());

      const matchesProvider = 
        filterProvider === '' ||
        c.provider.toLowerCase().includes(filterProvider.toLowerCase());

      const matchesCaseCount = 
        filterCaseCount === '' ||
        c.caseCount.toLowerCase().includes(filterCaseCount.toLowerCase());

      const matchesDate = 
        filterDate === '' ||
        c.lastCommentDate.toLowerCase().includes(filterDate.toLowerCase()) ||
        (c.time && c.time.toLowerCase().includes(filterDate.toLowerCase()));

      if (!(matchesGlobal && matchesProvider && matchesCaseCount && matchesDate)) {
        return false;
      }

      // Popover Filter
      if (filterValue === '' && filterOperator !== 'is empty' && filterOperator !== 'is not empty') {
        return true;
      }

      // custom fallback for date / time fields
      const targetValue =
        filterColumn === 'lastCommentDate'
          ? c.isInvalidDate
            ? 'invalid date'
            : `${c.lastCommentDate} ${c.time || ''}`.trim()
          : (c[filterColumn] ?? '').toString();

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
    filterProvider,
    filterCaseCount,
    filterDate,
    filterColumn,
    filterOperator,
    filterValue
  ]);

  // Handle pages
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // CSV export
  const handleExport = () => {
    const headers = ['Provider', 'Case Count', 'Last Comment Date'];
    const rows = filteredCases.map(c => [
      `"${c.provider.replace(/"/g, '""')}"`,
      `"${c.caseCount}"`,
      `"${c.isInvalidDate ? 'invalid date' : `${c.lastCommentDate} ${c.time || ''}`.trim()}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "active_incomplete_cases.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleCases = useMemo(() => {
    return filteredCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredCases, page, rowsPerPage]);
  if (selectedAccount) {
    return (
      <ActiveIncompleteCasesChartView
        providerName={selectedProvider || ''}
        accountNumber={selectedAccount}
        accountData={selectedAccountData || undefined}
        onBack={() => {
          setSelectedAccount(null);
          setSelectedAccountData(null);
        }}
        onBackToDashboard={() => {
          setSelectedAccount(null);
          setSelectedAccountData(null);
          setSelectedProvider(null);
        }}
        onPrevious={handlePreviousAccount}
        onNext={handleNextAccount}
      />
    );
  }

  if (selectedProvider) {
    return (
      <ActiveIncompleteCasesDetailsView 
        providerName={selectedProvider} 
        onBack={() => setSelectedProvider(null)} 
        onSelectAccount={(accountNum, rowData) => {
          setSelectedAccount(accountNum);
          setSelectedAccountData(rowData);
        }}
      />
    );
  }

  return (
    <Box sx={{ pt: 2.5, mb: 5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden', animation: `${fadeInUp} 0.3s ease-in-out` }}>

      {/* Action Toolbar */}
      <Box sx={{ px: 2.5, display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          size="small"
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
          sx={{ 
            width: { xs: 1, sm: 300 }
          }}
        />
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button
          variant="toolbar"
          color="inherit"
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
              setFilterColumn(e.target.value as keyof ActiveIncompleteCase);
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
          color="inherit"
          startIcon={<Download size={16} />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', border: 'none' }}>
        <Table sx={{ minWidth: 650 }} aria-label="active incomplete cases table">
          <TableHead>
            {/* Header Columns */}
            <TableRow>
              <TableCell>
                Provider
              </TableCell>
              <TableCell sx={{ width: 200 }}>
                Case Count
              </TableCell>
              <TableCell sx={{ width: 180 }}>
                Last Comment Date
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Contains Filter Input Row */}
              <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterProvider}
                    onChange={(e) => {
                      setFilterProvider(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterCaseCount}
                    onChange={(e) => {
                      setFilterCaseCount(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Is"
                    value={filterDate}
                    onChange={(e) => {
                      setFilterDate(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            {visibleCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No cases found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              visibleCases.map((row, index) => {
                // Alternating row styling: Figma has white and light cream (#FFF9F5)
                const isCream = index % 2 === 0;
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
                          '&, & .MuiTypography-root, & .MuiLink-root': {
                            color: theme.palette.primary.main,
                            transition: 'color 0.2s',
                            textDecoration: 'none',
                          }
                        }
                      }
                    }}
                  >
                    {/* Provider Link */}
                    <TableCell sx={{ px: 2.5 }}>
                      <Link 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setSelectedProvider(row.provider); }}
                        sx={{ 
                          fontSize: '14px',
                          fontWeight: 400, 
                          color: theme.palette.text.primary,
                          textDecoration: 'underline',
                          '&:hover': {
                            textDecoration: 'none'
                          }
                        }}
                      >
                        {row.provider}
                      </Link>
                    </TableCell>

                    {/* Case Count */}
                    <TableCell sx={{ px: 2.5}}>
                      {row.caseCount}
                    </TableCell>

                    {/* Last Comment Date & Time stacked */}
                    <TableCell sx={{ px: 2.5 }}>
                      {row.isInvalidDate ? (
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {row.lastCommentDate}
                        </Typography>
                      ) : (
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 400 }}>
                            {row.lastCommentDate}
                          </Typography>
                          {row.time && (
                            <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary', display: 'block', mt: 0.2 }}>
                              {row.time}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredCases.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </TableContainer>
    </Box>
  );
}
