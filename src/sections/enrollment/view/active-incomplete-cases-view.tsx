import { useState, useMemo } from 'react';
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
  TablePagination
} from '@mui/material';
import { Search, Filter, Download } from 'lucide-react';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

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

export default function ActiveIncompleteCasesView() {
  const theme = useTheme();

  // Search & filter states
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [filterCaseCount, setFilterCaseCount] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showFiltersRow, setShowFiltersRow] = useState(true);

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

      return matchesGlobal && matchesProvider && matchesCaseCount && matchesDate;
    });
  }, [globalSearch, filterProvider, filterCaseCount, filterDate]);

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

  return (
    <Box sx={{ pt: 2.5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden', animation: `${fadeInUp} 0.3s ease-in-out` }}>

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
          onClick={() => setShowFiltersRow(!showFiltersRow)}
        >
          Filters
        </Button>

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
      <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%' }}>
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
            {showFiltersRow && (
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
            )}
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
                        onClick={(e) => e.preventDefault()}
                        sx={{ 
                          fontSize: '16px',
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
                    <TableCell sx={{ px: 2.5, color: 'text.primary', fontWeight: 400, fontSize: '16px' }}>
                      {row.caseCount}
                    </TableCell>

                    {/* Last Comment Date & Time stacked */}
                    <TableCell sx={{ px: 2.5, fontSize: '16px' }}>
                      {row.isInvalidDate ? (
                        <Typography variant="body2" sx={{ fontSize: '16px', color: 'text.secondary', fontWeight: 400, textTransform: 'capitalize' }}>
                          {row.lastCommentDate}
                        </Typography>
                      ) : (
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
                            {row.lastCommentDate}
                          </Typography>
                          {row.time && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.2 }}>
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
