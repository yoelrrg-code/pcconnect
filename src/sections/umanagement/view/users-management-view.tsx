import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search, Filter, Download } from 'lucide-react';
import { UsersIcon } from '../../../layouts/dashboard/nav-icons';


// ----------------------------------------------------------------------

interface UsersManagement {
  id: string;
  provider: string;
  caseCount: string;
  lastCommentDate: string;
  time?: string;
  isInvalidDate?: boolean;
}

const MOCK_CASES: UsersManagement[] = [
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

export default function UsersManagementView() {
  const theme = useTheme();

  const [cases, setCases] = useState<UsersManagement[]>(MOCK_CASES);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleOpenModal = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) return;

    const newUser: UsersManagement = {
      id: String(cases.length + 1),
      provider: `${firstName} ${lastName} (${email})`,
      caseCount: '0/0',
      lastCommentDate: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).toLowerCase()
    };

    setCases([newUser, ...cases]);
    setIsModalOpen(false);
  };

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
    return cases.filter((c) => {
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
  }, [globalSearch, filterProvider, filterCaseCount, filterDate, cases]);

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
    <Box sx={{ overflow: 'hidden', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>

        <Box sx={{ pb: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                Manage system access permissions and active roles for PC Connect network.
            </Typography>
            <Card sx={{ p: 4, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Users Control Center
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Creating, updating, and auditing user access to HIPAA-regulated sections.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleOpenModal}>Create New User</Button>
                </Box>
            </Card>
        </Box>

        {/* Action Toolbar */}
        <Box sx={{ px: 3, py: 3, borderTopLeftRadius: 16, borderTopRightRadius: 16, display: 'flex', bgcolor: theme.palette.background.paper, gap: 2, mb: 0, alignItems: 'center', flexWrap: 'wrap' }}>
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
                    startAdornment: (
                        <InputAdornment position="start">
                        <Search size={18} style={{ color: theme.palette.text.disabled }} />
                        </InputAdornment>
                    ),
                    },
                }}
                sx={{ 
                    width: { xs: 1, sm: 320 },
                    '& .MuiInputBase-root': {
                    borderRadius: 1,
                    height: 48,
                    }
                }}
            />
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Button
                color="inherit"
                startIcon={<Filter size={16} />}
                onClick={() => setShowFiltersRow(!showFiltersRow)}
                sx={{ 
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    height: 38,
                    px: 2,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                }}
            >
                Filters
            </Button>

            <Button
                color="inherit"
                startIcon={<Download size={16} />}
                onClick={handleExport}
                sx={{ 
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    height: 38,
                    px: 2,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                }}
            >
                Export
            </Button>
        </Box>

        {/* Table Container */}
        <TableContainer component={Paper} sx={{borderRadius: 0, boxShadow: theme.customShadows.card, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
            <Table sx={{ minWidth: 650 }} aria-label="active incomplete cases table">
                <TableHead>
                    {/* Header Columns */}
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem' }}>
                          Provider
                      </TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 200 }}>
                          Case Count
                      </TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 250 }}>
                          Last Comment Date
                      </TableCell>
                    </TableRow>
                    
                    {/* Contains Filter Input Row */}
                    {showFiltersRow && (
                    <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                        <TableCell sx={{ py: 2.5, px: 2 }}>
                        <TextField
                            size="small"
                            label="Contains"
                            value={filterProvider}
                            onChange={(e) => {
                            setFilterProvider(e.target.value);
                            setPage(0);
                            }}
                            slotProps={{
                            inputLabel: {
                                shrink: true,
                                sx: {
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                transform: 'translate(12px, -8px) scale(0.75)',
                                color: theme.palette.mode === 'light' ? '#454F5B' : '#919EAB',
                                '&.Mui-focused': {
                                    color: 'primary.main',
                                }
                                }
                            }
                            }}
                            sx={{
                            width: 1,
                            '& .MuiInputBase-root': {
                                height: 32,
                                fontSize: '0.8rem',
                                bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                                borderRadius: 1,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(theme.palette.divider, 0.5),
                            }
                            }}
                        />
                        </TableCell>
                        <TableCell sx={{ py: 2.5, px: 2 }}>
                        <TextField
                            size="small"
                            label="Contains"
                            value={filterCaseCount}
                            onChange={(e) => {
                            setFilterCaseCount(e.target.value);
                            setPage(0);
                            }}
                            slotProps={{
                            inputLabel: {
                                shrink: true,
                                sx: {
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                transform: 'translate(12px, -8px) scale(0.75)',
                                color: theme.palette.mode === 'light' ? '#454F5B' : '#919EAB',
                                '&.Mui-focused': {
                                    color: 'primary.main',
                                }
                                }
                            }
                            }}
                            sx={{
                            width: 1,
                            '& .MuiInputBase-root': {
                                height: 32,
                                fontSize: '0.8rem',
                                bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                                borderRadius: 1,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(theme.palette.divider, 0.5),
                            }
                            }}
                        />
                        </TableCell>
                        <TableCell sx={{ py: 2.5, px: 2 }}>
                        <TextField
                            size="small"
                            label="Is"
                            value={filterDate}
                            onChange={(e) => {
                            setFilterDate(e.target.value);
                            setPage(0);
                            }}
                            slotProps={{
                            inputLabel: {
                                shrink: true,
                                sx: {
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                transform: 'translate(12px, -8px) scale(0.75)',
                                color: theme.palette.mode === 'light' ? '#454F5B' : '#919EAB',
                                '&.Mui-focused': {
                                    color: 'primary.main',
                                }
                                }
                            }
                            }}
                            sx={{
                            width: 1,
                            '& .MuiInputBase-root': {
                                height: 32,
                                fontSize: '0.8rem',
                                bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                                borderRadius: 1,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: alpha(theme.palette.divider, 0.5),
                            }
                            }}
                        />
                        </TableCell>
                    </TableRow>
                    )}
                </TableHead>

                <TableBody>
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
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.06)
                            },
                            transition: 'background-color 0.2s'
                            }}
                        >
                            {/* Provider Link */}
                            <TableCell sx={{ py: 1.5 }}>
                            <Link 
                                href="#" 
                                onClick={(e) => e.preventDefault()}
                                sx={{ 
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
                            <TableCell sx={{ py: 1.5, color: 'text.primary', fontWeight: 400 }}>
                            {row.caseCount}
                            </TableCell>

                            {/* Last Comment Date & Time stacked */}
                            <TableCell sx={{ py: 1.5 }}>
                            {row.isInvalidDate ? (
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400, textTransform: 'capitalize' }}>
                                {row.lastCommentDate}
                                </Typography>
                            ) : (
                                <Box>
                                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 400 }}>
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

        {/* Create User Dialog Form */}
        <Dialog 
          open={isModalOpen} 
          onClose={handleCloseModal}
          maxWidth="xs"
          fullWidth
          slotProps={{
            paper: {
              component: 'form',
              onSubmit: handleAddUser,
              sx: {
                borderRadius: 2,
                boxShadow: theme.customShadows.z24,
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
              borderBottom: `1px solid ${theme.palette.divider}` 
            }}
          >
            <Box 
              sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                padding: '7px',
                bgcolor: alpha(theme.palette.primary.main, 0.08), 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                '& svg [fill="#737373"]': {
                    fill: theme.palette.mode === 'light' ? '#B4006E' : '#E6007E',
                    transition: 'fill 0.2s ease',
                },
                '& svg [stroke="#737373"]': {
                    stroke: theme.palette.mode === 'light' ? '#B4006E' : '#E6007E',
                    transition: 'stroke 0.2s ease'
                }
              }}
            >
              <UsersIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
              Add User
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 2.5, mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pt: 1 }}>
              <TextField
                fullWidth
                required
                label="First Name"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(0.75)',
                      color: theme.palette.mode === 'light' ? '#454F5B' : '#919EAB',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: 40,
                    fontSize: '0.85rem',
                    bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                    borderRadius: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.divider, 0.5),
                  }
                }}
              />

              <TextField
                fullWidth
                required
                label="Last Name"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(0.75)',
                      color: theme.palette.mode === 'light' ? '#454F5B' : '#919EAB',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: 40,
                    fontSize: '0.85rem',
                    bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                    borderRadius: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.divider, 0.5),
                  }
                }}
              />

              <TextField
                fullWidth
                required
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(0.75)',
                      color: theme.palette.mode === 'light' ? '#454F5B' : '#919EAB',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      }
                    }
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: 40,
                    fontSize: '0.85rem',
                    bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                    borderRadius: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.divider, 0.5),
                  }
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.palette.divider}`, gap: 1.5 }}>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={handleCloseModal}
              sx={{ 
                borderRadius: 1.5, 
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.secondary',
                borderColor: 'divider',
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              color="primary" 
              disabled={!firstName || !lastName || !email}
              sx={{ 
                borderRadius: 1.5, 
                fontWeight: 600, 
                fontSize: '0.875rem',
                px: 3,
                boxShadow: theme.customShadows.primary,
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
