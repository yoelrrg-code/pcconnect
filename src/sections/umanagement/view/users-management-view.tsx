import { useState, useMemo, useCallback } from 'react';
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
  useTheme, 
  alpha,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputBase,
  NativeSelect
} from '@mui/material';
import { Search, Filter, Download, Plus, RotateCcw } from 'lucide-react';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { GREY } from '../../../theme/palette';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

interface User {
  id: string;
  email: string;
  role: string;
  lastName: string;
  firstName: string;
  title: string;
  lastLogin: string; // YYYY-MM-DD format
  allowPrint: 'Yes' | 'No';
  frequency: 'Never' | 'Weekly' | 'Monthly' | 'Daily';
  active: 'Yes' | 'No';
}

const MOCK_USERS: User[] = [
  { id: '1', email: 'gatorsong@gmail.com', role: 'Admin', lastName: 'Hoang', firstName: 'Song', title: 'A', lastLogin: '2024-09-10', allowPrint: 'Yes', frequency: 'Never', active: 'Yes' },
  { id: '2', email: 'jsturm@physchoice.com', role: 'Admin', lastName: 'Sturm', firstName: 'Jon', title: '', lastLogin: '2024-09-09', allowPrint: 'Yes', frequency: 'Never', active: 'Yes' },
  { id: '3', email: 'alopez@physchoice.com', role: 'Admin', lastName: 'Lopez', firstName: 'Angel', title: '', lastLogin: '2017-04-24', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '4', email: 'dacal@physchoice.com', role: 'Admin', lastName: 'Acal', firstName: 'Derrick', title: '', lastLogin: '2017-10-27', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '5', email: 'gatorsong_user@gmail.com', role: 'User', lastName: 'Hoang', firstName: 'Song', title: 'U', lastLogin: '2019-12-19', allowPrint: 'Yes', frequency: 'Weekly', active: 'Yes' },
  { id: '6', email: 'testprovider@physchoice.com', role: 'Provider', lastName: 'Provider', firstName: 'Test', title: '', lastLogin: '2024-07-08', allowPrint: 'Yes', frequency: 'Never', active: 'Yes' },
  { id: '7', email: 'testdirector@physchoice.com', role: 'Director', lastName: 'Director', firstName: 'Test', title: '', lastLogin: '2024-07-08', allowPrint: 'Yes', frequency: 'Never', active: 'Yes' },
  { id: '8', email: 'aznboy@ufl.edu', role: 'Director/Provider', lastName: 'Hoang', firstName: 'Song', title: 'D', lastLogin: '2019-11-27', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '9', email: 'veronique.au@hotmail.com', role: 'Provider', lastName: 'Au', firstName: 'Veronique', title: 'MD', lastLogin: '2016-08-04', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '10', email: 'scady@me.com', role: 'Provider', lastName: 'Cady', firstName: 'Stephen', title: '', lastLogin: '2016-08-04', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '11', email: 'awby@earthlink.net', role: 'Provider', lastName: 'Bodony', firstName: 'Richard', title: 'MD', lastLogin: '2016-08-04', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '12', email: 'susanbeemd@sbcglobal.net', role: 'Provider', lastName: 'Bradshaw', firstName: 'Susan', title: 'MD', lastLogin: '2016-08-04', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '13', email: 'aaron.j.andrade@gmail.com', role: 'Provider', lastName: 'Andrade', firstName: 'Aaron', title: 'MD', lastLogin: '2016-08-04', allowPrint: 'No', frequency: 'Never', active: 'No' },
  { id: '14', email: 'pbruens@comcast.net', role: 'Provider', lastName: 'Bruens', firstName: 'Patricia', title: 'MD', lastLogin: '2016-08-04', allowPrint: 'No', frequency: 'Never', active: 'No' },
];

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }
  return dateStr;
};

export default function UsersManagementView() {
  const theme = useTheme();

  // User States
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [originalUsers, setOriginalUsers] = useState<Record<string, User>>(() => 
    MOCK_USERS.reduce((acc, u) => ({ ...acc, [u.id]: u }), {})
  );

  // Modal states for creating a new user
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('User');
  const [newTitle, setNewTitle] = useState('');
  const [newAllowPrint, setNewAllowPrint] = useState<'Yes' | 'No'>('Yes');
  const [newFrequency, setNewFrequency] = useState<'Never' | 'Weekly' | 'Monthly' | 'Daily'>('Never');
  const [newActive, setNewActive] = useState<'Yes' | 'No'>('Yes');

  const handleOpenModal = () => {
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewRole('User');
    setNewTitle('');
    setNewAllowPrint('Yes');
    setNewFrequency('Never');
    setNewActive('Yes');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newEmail) return;

    const newUser: User = {
      id: String(Date.now()),
      email: newEmail,
      role: newRole,
      lastName: newLastName,
      firstName: newFirstName,
      title: newTitle,
      lastLogin: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      allowPrint: newAllowPrint,
      frequency: newFrequency,
      active: newActive,
    };

    setUsers([newUser, ...users]);
    setOriginalUsers(prev => ({ ...prev, [newUser.id]: newUser }));
    setIsModalOpen(false);
  };

  // Search & filter states
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterLastName, setFilterLastName] = useState('');
  const [filterFirstName, setFilterFirstName] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterLastLogin, setFilterLastLogin] = useState('');
  const [filterAllowPrint, setFilterAllowPrint] = useState('All');
  const [filterFrequency, setFilterFrequency] = useState('All');
  const [filterActive, setFilterActive] = useState('All');
  
  const [showFiltersRow, setShowFiltersRow] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handler for cell editing
  const handleCellEdit = (userId: string, field: keyof User, value: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: value } : u));
  };

  // Handler to discard changes in a row
  const handleDiscardRowChanges = (userId: string) => {
    const original = originalUsers[userId];
    if (original) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...original } : u));
    }
  };

  // Determine if a row has unsaved modifications
  const isRowDirty = useCallback((row: User) => {
    const original = originalUsers[row.id];
    if (!original) return false;
    return (
      row.email !== original.email ||
      row.role !== original.role ||
      row.lastName !== original.lastName ||
      row.firstName !== original.firstName ||
      row.title !== original.title ||
      row.lastLogin !== original.lastLogin ||
      row.allowPrint !== original.allowPrint ||
      row.frequency !== original.frequency ||
      row.active !== original.active
    );
  }, [originalUsers]);

  // Save all dirty changes
  const handleSaveAllChanges = () => {
    const newOriginals = users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
    setOriginalUsers(newOriginals);
  };

  // Discard all dirty changes
  const handleDiscardAllChanges = () => {
    setUsers(prev => prev.map(u => originalUsers[u.id] ? { ...originalUsers[u.id] } : u));
  };

  // Check if there are any pending changes
  const hasChanges = useMemo(() => {
    return users.some(isRowDirty);
  }, [users, isRowDirty]);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Global search matches any of the text fields
      const matchesGlobal = 
        globalSearch === '' ||
        u.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        u.role.toLowerCase().includes(globalSearch.toLowerCase()) ||
        u.lastName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        u.firstName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        u.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        formatDateDisplay(u.lastLogin).includes(globalSearch);

      const matchesEmail = 
        filterEmail === '' ||
        u.email.toLowerCase().includes(filterEmail.toLowerCase());

      const matchesRole = 
        filterRole === '' ||
        u.role.toLowerCase().includes(filterRole.toLowerCase());

      const matchesLastName = 
        filterLastName === '' ||
        u.lastName.toLowerCase().includes(filterLastName.toLowerCase());

      const matchesFirstName = 
        filterFirstName === '' ||
        u.firstName.toLowerCase().includes(filterFirstName.toLowerCase());

      const matchesTitle = 
        filterTitle === '' ||
        u.title.toLowerCase().includes(filterTitle.toLowerCase());

      const matchesLastLogin = 
        filterLastLogin === '' ||
        u.lastLogin.includes(filterLastLogin); // matches YYYY-MM-DD input date

      const matchesAllowPrint = 
        filterAllowPrint === 'All' ||
        u.allowPrint === filterAllowPrint;

      const matchesFrequency = 
        filterFrequency === 'All' ||
        u.frequency === filterFrequency;

      const matchesActive = 
        filterActive === 'All' ||
        u.active === filterActive;

      return (
        matchesGlobal &&
        matchesEmail &&
        matchesRole &&
        matchesLastName &&
        matchesFirstName &&
        matchesTitle &&
        matchesLastLogin &&
        matchesAllowPrint &&
        matchesFrequency &&
        matchesActive
      );
    });
  }, [
    globalSearch,
    filterEmail,
    filterRole,
    filterLastName,
    filterFirstName,
    filterTitle,
    filterLastLogin,
    filterAllowPrint,
    filterFrequency,
    filterActive,
    users
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
    const headers = ['Email', 'Roles', 'Last Name', 'First Name', 'Title', 'Last Login', 'Allow Print', 'Frequency', 'Active'];
    const rows = filteredUsers.map(u => [
      `"${u.email.replace(/"/g, '""')}"`,
      `"${u.role.replace(/"/g, '""')}"`,
      `"${u.lastName.replace(/"/g, '""')}"`,
      `"${u.firstName.replace(/"/g, '""')}"`,
      `"${u.title.replace(/"/g, '""')}"`,
      `"${formatDateDisplay(u.lastLogin)}"`,
      `"${u.allowPrint}"`,
      `"${u.frequency}"`,
      `"${u.active}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_management.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleUsers = useMemo(() => {
    return filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredUsers, page, rowsPerPage]);

  const textFieldStyles = {
    '& .MuiInputBase-root': {
      height: 48,
      fontSize: '12px',
      bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
      borderRadius: 1,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: GREY[800],
      fontSize: '12px'
    },
    '& .MuiOutlinedInput-notchedOutline legend': {
      fontSize: '0.95em'
    }
  };

  return (
    <Box sx={{ pt: 2.5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden' }}>

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
                    startAdornment: (
                        <InputAdornment position="start">
                        <Search size={18} style={{ color: theme.palette.text.disabled }} />
                        </InputAdornment>
                    ),
                    },
                }}
                sx={{ 
                    width: { xs: 1, sm: 300 },
                    '& .MuiInputBase-root': {
                    borderRadius: 1,
                    height: 48,
                    fontSize: '14px'
                    }
                }}
            />
            
            <Box sx={{ flexGrow: 1 }} />

            <Button
                color="inherit"
                startIcon={<Plus size={16} />}
                onClick={() => handleOpenModal()}
                sx={{ 
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    height: 38,
                    px: 2,
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                }}
            >
                Add User
            </Button>
            
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
                    fontSize: '14px',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
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
                    fontSize: '14px',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                }}
            >
                Export
            </Button>
        </Box>

        {/* Table Container */}
        <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: theme.customShadows.card, overflowX: 'auto', border: `1px solid ${theme.palette.divider}` }}>
            <Table sx={{ minWidth: 1500 }} aria-label="users management table">
                <TableHead>
                    {/* Header Columns */}
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 220 }}>Email</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 140 }}>Roles</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 120 }}>Last Name</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 120 }}>First Name</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 80 }}>Title</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 140 }}>Last Login</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 100 }}>Allow Print</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 110 }}>Frequency</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 100 }}>Active</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 600, py: 1.8, fontSize: '0.9rem', width: 60, textAlign: 'center' }}></TableCell>
                    </TableRow>
                    
                    {/* Contains Filter Input Row */}
                    {showFiltersRow && (
                    <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                        {/* Email Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterEmail}
                              onChange={(e) => {
                                setFilterEmail(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
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
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          />
                        </TableCell>
                        
                        {/* Roles Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterRole}
                              onChange={(e) => {
                                setFilterRole(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
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
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          />
                        </TableCell>

                        {/* Last Name Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterLastName}
                              onChange={(e) => {
                                setFilterLastName(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
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
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          />
                        </TableCell>

                        {/* First Name Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterFirstName}
                              onChange={(e) => {
                                setFilterFirstName(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
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
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          />
                        </TableCell>

                        {/* Title Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterTitle}
                              onChange={(e) => {
                                setFilterTitle(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
                                    }
                                }
                              }}
                              sx={{
                                width: 1,
                                '& .MuiInputBase-root': {
                                    height: 32,
                                    fontSize: '12px',
                                    bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                                    borderRadius: 1,
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          />
                        </TableCell>

                        {/* Last Login Filter (DatePicker) */}
                        <TableCell sx={{ p: 1.5, fontSize: '12px' }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              value={filterLastLogin ? dayjs(filterLastLogin) : null}
                              onChange={(newValue) => {
                                setFilterLastLogin(newValue ? newValue.format('YYYY-MM-DD') : '');
                                setPage(0);
                              }}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  label: 'Is',
                                  slotProps: {
                                    inputLabel: {
                                      shrink: true,
                                      sx: {
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        transform: 'translate(14px, -6px) scale(0.8)',
                                        color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                        '&.Mui-focused': { color: 'primary.main' }
                                      }
                                    }
                                  },
                                  sx: {
                                    width: '140px',
                                    '& .MuiInputBase-root': {
                                      height: 22,
                                      bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                                      borderRadius: 1,
                                      paddingRight: '4px',
                                    },
                                    '& .MuiInputBase-input': {
                                      fontSize: '12px',
                                    },
                                    '& .MuiPickersSectionList-sectionContent': {
                                      fontSize: '12px',
                                    },
                                    '& .MuiPickersSectionList-root': {
                                      padding: '4px 0',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: GREY[800],
                                    },
                                    '& .MuiOutlinedInput-notchedOutline legend': {
                                        fontSize: '0.75em'
                                    },
                                    '& .MuiInputAdornment-root': {
                                      marginLeft: 0,
                                    },
                                    '& .MuiInputAdornment-root .MuiButtonBase-root svg': {
                                      width: '18px',
                                      height: '18px',
                                      marginRight: '5px'
                                    },
                                    '& .MuiIconButton-root': {
                                      padding: 0,
                                    }
                                  }
                                },
                                actionBar: {
                                  actions: ['clear', 'today', 'accept'],
                                }
                              }}
                            />
                          </LocalizationProvider>
                        </TableCell>

                        {/* Allow Print Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              select
                              size="small"
                              label="Is"
                              value={filterAllowPrint}
                              onChange={(e) => {
                                setFilterAllowPrint(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                select: { native: true },
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
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
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          >
                            <option value="All">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </TextField>
                        </TableCell>

                        {/* Frequency Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              select
                              size="small"
                              label="Is"
                              value={filterFrequency}
                              onChange={(e) => {
                                setFilterFrequency(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                select: { native: true },
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
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
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          >
                            <option value="All">All</option>
                            <option value="Never">Never</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Daily">Daily</option>
                          </TextField>
                        </TableCell>

                        {/* Active Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              select
                              size="small"
                              label="Is"
                              value={filterActive}
                              onChange={(e) => {
                                setFilterActive(e.target.value);
                                setPage(0);
                              }}
                              slotProps={{
                                select: { native: true },
                                inputLabel: {
                                    shrink: true,
                                    sx: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    transform: 'translate(14px, -6px) scale(0.8)',
                                    color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                                    '&.Mui-focused': { color: 'primary.main' }
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
                                    borderColor: GREY[800],
                                },
                                '& .MuiOutlinedInput-notchedOutline legend': {
                                    fontSize: '0.75em'
                                }
                              }}
                          >
                            <option value="All">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </TextField>
                        </TableCell>

                        {/* Empty filter space for actions */}
                        <TableCell sx={{ p: 1.5 }}></TableCell>
                    </TableRow>
                    )}
                </TableHead>

                <TableBody>
                    {visibleUsers.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                          No users found matching your criteria.
                        </TableCell>
                    </TableRow>
                    ) : (
                    visibleUsers.map((row, index) => {
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
                                '& .MuiTableCell-root:first-of-type': {
                                  '&, & .MuiTypography-root, & .MuiInputBase-input': {
                                    color: theme.palette.primary.main,
                                    transition: 'color 0.2s',
                                    textDecoration: 'none',
                                  }
                                }
                              }
                            }}
                          >
                            {/* Email Cell (Editable text) */}
                            <TableCell sx={{ px: 2 }}>
                              <InputBase
                                value={row.email}
                                onChange={(e) => handleCellEdit(row.id, 'email', e.target.value)}
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  width: '100%',
                                  '& .MuiInputBase-input': {
                                    padding: '4px 0',
                                    color: '#737373',
                                    textDecoration: 'underline',
                                    borderBottom: '2px solid transparent',
                                    transition: 'color 0.2s, text-decoration 0.2s, border-bottom-color 0.2s',
                                    cursor: 'pointer',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                      cursor: 'text',
                                      color: theme.palette.primary.main,
                                      textDecoration: 'underline',
                                    }
                                  },
                                  '&:hover .MuiInputBase-input': {
                                    color: theme.palette.primary.main,
                                    textDecoration: 'none',
                                  }
                                }}
                              />
                            </TableCell>

                            {/* Roles Cell (Editable select) */}
                            <TableCell sx={{ px: 2 }}>
                              {row.role}
                            </TableCell>

                            {/* Last Name Cell (Editable text) */}
                            <TableCell sx={{ px: 2 }}>
                              <InputBase
                                value={row.lastName}
                                onChange={(e) => handleCellEdit(row.id, 'lastName', e.target.value)}
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  color: 'text.primary',
                                  width: '100%',
                                  '& .MuiInputBase-input': {
                                    padding: '4px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-bottom-color 0.2s',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    }
                                  }
                                }}
                              />
                            </TableCell>

                            {/* First Name Cell (Editable text) */}
                            <TableCell sx={{ px: 2 }}>
                              <InputBase
                                value={row.firstName}
                                onChange={(e) => handleCellEdit(row.id, 'firstName', e.target.value)}
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  color: 'text.primary',
                                  width: '100%',
                                  '& .MuiInputBase-input': {
                                    padding: '4px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-bottom-color 0.2s',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    }
                                  }
                                }}
                              />
                            </TableCell>

                            {/* Title Cell (Editable text) */}
                            <TableCell sx={{ px: 2 }}>
                              <InputBase
                                value={row.title}
                                onChange={(e) => handleCellEdit(row.id, 'title', e.target.value)}
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  color: 'text.primary',
                                  width: '100%',
                                  '& .MuiInputBase-input': {
                                    padding: '4px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-bottom-color 0.2s',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    }
                                  }
                                }}
                              />
                            </TableCell>

                            {/* Last Login Cell (Editable date picker) */}
                            <TableCell sx={{ px: 2 }}>
                              <InputBase
                                type="date"
                                value={row.lastLogin}
                                onChange={(e) => handleCellEdit(row.id, 'lastLogin', e.target.value)}
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  color: 'text.primary',
                                  width: '100%',
                                  '& .MuiInputBase-input': {
                                    padding: '4px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-bottom-color 0.2s',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    }
                                  }
                                }}
                              />
                            </TableCell>

                            {/* Allow Print Cell (Editable select) */}
                            <TableCell sx={{ px: 2 }}>
                              <NativeSelect
                                value={row.allowPrint}
                                onChange={(e) => handleCellEdit(row.id, 'allowPrint', e.target.value)}
                                disableUnderline
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  color: 'text.primary',
                                  width: '100%',
                                  '& .MuiNativeSelect-select': {
                                    padding: '4px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-bottom-color 0.2s',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    }
                                  }
                                }}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </NativeSelect>
                            </TableCell>

                            {/* Frequency Cell (Editable select) */}
                            <TableCell sx={{ px: 2 }}>
                              <NativeSelect
                                value={row.frequency}
                                onChange={(e) => handleCellEdit(row.id, 'frequency', e.target.value)}
                                disableUnderline
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  color: 'text.primary',
                                  width: '100%',
                                  '& .MuiNativeSelect-select': {
                                    padding: '4px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-bottom-color 0.2s',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    }
                                  }
                                }}
                              >
                                <option value="Never">Never</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Daily">Daily</option>
                              </NativeSelect>
                            </TableCell>

                            {/* Active Cell (Editable select) */}
                            <TableCell sx={{ px: 2 }}>
                              <NativeSelect
                                value={row.active}
                                onChange={(e) => handleCellEdit(row.id, 'active', e.target.value)}
                                disableUnderline
                                sx={{
                                  fontSize: '15px',
                                  fontFamily: 'Poppins, sans-serif',
                                  color: 'text.primary',
                                  width: '100%',
                                  '& .MuiNativeSelect-select': {
                                    padding: '4px 0',
                                    borderBottom: '2px solid transparent',
                                    transition: 'border-bottom-color 0.2s',
                                    '&:focus': {
                                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                                    }
                                  }
                                }}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </NativeSelect>
                            </TableCell>

                            {/* Discard changes button (last column) */}
                            <TableCell sx={{ px: 1, textAlign: 'center' }}>
                              <IconButton
                                size="small"
                                onClick={() => handleDiscardRowChanges(row.id)}
                                disabled={!dirty}
                                sx={{
                                  color: dirty ? 'primary.main' : 'text.disabled',
                                  transition: 'color 0.2s',
                                }}
                                title="Discard row changes"
                              >
                                <RotateCcw size={18} />
                              </IconButton>
                            </TableCell>
                        </TableRow>
                        );
                    })
                    )}
                </TableBody>
            </Table>

            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                gap: 2,
                px: 2.5,
                py: 1,
                borderTop: `1px solid ${theme.palette.divider}`
              }}
            >
              {/* Bulk Action Buttons (Left Aligned) */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  variant="contained"
                  disabled={!hasChanges}
                  onClick={handleSaveAllChanges}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    px: 2,
                    py: 0.75,
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'primary.light'
                    },
                    '&.Mui-disabled': {
                      bgcolor: alpha(theme.palette.primary.main, 0.5),
                      color: alpha('#ffffff', 0.7),
                    }
                  }}
                >
                  Save All
                </Button>
                <Button
                  variant="contained"
                  disabled={!hasChanges}
                  onClick={handleDiscardAllChanges}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    px: 2,
                    py: 0.75,
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'primary.light'
                    },
                    '&.Mui-disabled': {
                      bgcolor: alpha(theme.palette.primary.main, 0.5),
                      color: alpha('#ffffff', 0.7),
                    }
                  }}
                >
                  Discard All Changes
                </Button>
              </Box>

              {/* Pagination (Right Aligned) */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={filteredUsers.length}
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

        {/* Create User Dialog Form */}
        <Dialog 
          open={isModalOpen} 
          onClose={handleCloseModal}
          maxWidth="md"
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
              borderBottom: `1px solid ${theme.palette.divider}`,
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
              <PersonAddAltIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: 0, fontSize: '18px' }}>
              Add User
            </Typography>
          </DialogTitle>

          <DialogContent sx={{bgcolor: theme.palette.background.default }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, pt: 5, pb: 3, px: 4.5 }}>
              <TextField
                required
                label="First Name"
                placeholder="First name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
                sx={textFieldStyles}
              />

              <TextField
                required
                label="Last Name"
                placeholder="Last name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
                sx={textFieldStyles}
              />

              <TextField
                required
                type="email"
                label="Email Address"
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                sx={{
                  gridColumn: { sm: 'span 2' },
                  '& .MuiInputBase-root': {
                    height: 48,
                    fontSize: '12px',
                    bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                    borderRadius: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: GREY[800],
                    fontSize: 12
                  },
                  '& .MuiOutlinedInput-notchedOutline legend': {
                      fontSize: '1em'
                  }
                }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
              />

              <TextField
                select
                label="Role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                slotProps={{
                  select: { native: true },
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
                sx={textFieldStyles}
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Provider">Provider</option>
                <option value="Director">Director</option>
                <option value="Director/Provider">Director/Provider</option>
              </TextField>

              <TextField
                label="Title"
                placeholder="Title (e.g. MD)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
                sx={textFieldStyles}
              />

              <TextField
                select
                label="Allow Print"
                value={newAllowPrint}
                onChange={(e) => setNewAllowPrint(e.target.value as 'Yes' | 'No')}
                slotProps={{
                  select: { native: true },
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
                sx={textFieldStyles}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>

              <TextField
                select
                label="Frequency"
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value as User['frequency'])}
                slotProps={{
                  select: { native: true },
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: 48,
                    fontSize: '12px',
                    bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                    borderRadius: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: GREY[800],
                    fontSize: '12px'
                  },
                  '& .MuiOutlinedInput-notchedOutline legend': {
                      fontSize: '0.95em'
                  }
                }}
              >
                <option value="Never">Never</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Daily">Daily</option>
              </TextField>

              <TextField
                select
                label="Active"
                value={newActive}
                onChange={(e) => setNewActive(e.target.value as 'Yes' | 'No')}
                slotProps={{
                  select: { native: true },
                  inputLabel: {
                    shrink: true,
                    sx: {
                      fontSize: '12px',
                      fontWeight: 600,
                      transform: 'translate(12px, -8px) scale(1)',
                      color: theme.palette.mode === 'light' ? GREY[700] : '#919EAB',
                      '&.Mui-focused': { color: 'primary.main' }
                    }
                  }
                }}
                sx={{
                  gridColumn: { sm: 'span 2' },
                  '& .MuiInputBase-root': {
                    height: 48,
                    fontSize: '12px',
                    bgcolor: theme.palette.mode === 'light' ? '#FFFFFF' : 'background.paper',
                    borderRadius: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: GREY[800],
                    fontSize: '12px'
                  },
                  '& .MuiOutlinedInput-notchedOutline legend': {
                      fontSize: '0.95em'
                  }
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 5, gap: 1.5, bgcolor: theme.palette.background.default }}>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={handleCloseModal}
              sx={{ 
                borderRadius: 3, 
                px: 3,
                py: 1,
                fontWeight: 600,
                fontSize: '16px',
                color: 'text.secondary',
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              color="primary" 
              disabled={!newFirstName || !newLastName || !newEmail}
              sx={{ 
                borderRadius: 3, 
                px: 3,
                py: 1,
                fontWeight: 600, 
                fontSize: '16px',
                bgcolor: theme.palette.primary.main,
                '&.Mui-disabled ':{
                  color: GREY[0],
                  bgcolor: alpha(theme.palette.primary.main, 0.5)
                },
                '&:hover': {
                  bgcolor: theme.palette.primary.light
                }
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
