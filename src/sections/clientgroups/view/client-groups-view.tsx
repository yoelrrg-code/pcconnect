import { useState, useMemo } from 'react';
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
  Switch,
  Card,
  CardContent,
  Popover
} from '@mui/material';
import { Search, Filter, Download, Plus, UserPlus, X } from 'lucide-react';
import { fadeInUp } from '../../../theme/effects';
import { GREY } from '../../../theme/palette';

// ----------------------------------------------------------------------

export interface ClientGroup {
  id: string;
  name: string;
  emails: string;
  caqhReport: 'Yes' | 'No';
  enrollmentReport: 'Yes' | 'No';
  dataSets: string[];
}

const MOCK_GROUPS: ClientGroup[] = [
  { id: '1', name: 'EPA***', emails: '', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: [] },
  { id: '2', name: 'HiCuity Health', emails: 'jsturm@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['G56'] },
  { id: '3', name: 'MVE***', emails: '', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: [] },
  { id: '4', name: 'MVEP/MVUC Weekly Enrollment Report', emails: 'enrollment@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['A01', 'A02'] },
  { id: '5', name: 'NVE***', emails: '', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['G56'] },
  { id: '6', name: 'SCE***', emails: '', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: [] },
  { id: '7', name: 'So ***', emails: '', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: [] },
  { id: '8', name: 'South Shore Anesthesia Staffing', emails: 'tokihara@physchoice.com; jsturm@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['A03'] },
  { id: '9', name: 'AAS Weekly Enrollment Report', emails: 'jsturm@physchoice.com;awood@physchoice.com;kcross@ambulatoryanesthesiasolutions.com', caqhReport: 'No', enrollmentReport: 'No', dataSets: ['A04', 'A05'] },
  { id: '10', name: 'AEIOU Provider emails', emails: '', caqhReport: 'No', enrollmentReport: 'No', dataSets: [] },
  { id: '11', name: 'Advanced Care Hospitalists', emails: 'ach-billing@physchoice.com', caqhReport: 'Yes', enrollmentReport: 'Yes', dataSets: ['A01'] },
  { id: '12', name: 'Bay Area Emergency Physicians', emails: 'baep-ops@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['A02'] },
  { id: '13', name: 'California Critical Care', emails: 'ccc-reports@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['G56'] },
  { id: '14', name: 'Doctors Medical Group', emails: 'dmg-admin@physchoice.com', caqhReport: 'Yes', enrollmentReport: 'No', dataSets: ['A05A'] },
  { id: '15', name: 'East Bay Nephrology', emails: 'ebn-contact@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['A03'] },
  { id: '16', name: 'Fremont Family Practice', emails: 'ffp-billing@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['A04'] },
  { id: '17', name: 'Golden State Urology', emails: 'gsu-staff@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['A05'] },
  { id: '18', name: 'Hayward Surgical Center', emails: 'hsc-billing@physchoice.com', caqhReport: 'No', enrollmentReport: 'No', dataSets: [] },
  { id: '19', name: 'Inpatient Medicine Associates', emails: 'ima-reports@physchoice.com', caqhReport: 'Yes', enrollmentReport: 'Yes', dataSets: ['A01', 'A05A'] },
  { id: '20', name: 'Kern County Emergency Group', emails: 'kceg-ops@physchoice.com', caqhReport: 'No', enrollmentReport: 'Yes', dataSets: ['G56'] },
];

const ALL_DATASETS = ['A01', 'A02', 'A03', 'A04', 'A05', 'A05A', 'G56', 'G34', 'E09', 'G58', 'H02', 'G24', 'G64', 'A12', 'G68', 'H03', 'S01', 'E07'];

export default function ClientGroupsView() {
  const theme = useTheme();

  // Client Groups States
  const [groups, setGroups] = useState<ClientGroup[]>(MOCK_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<ClientGroup | null>(null);
  const [editGroup, setEditGroup] = useState<ClientGroup | null>(null);

  // Dialog State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterEmails, setFilterEmails] = useState('');
  const [filterCaqh, setFilterCaqh] = useState('All');
  const [filterEnrollment, setFilterEnrollment] = useState('All');

  // Popover States
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterColumn, setFilterColumn] = useState<keyof ClientGroup>('name');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };
  const isFiltersOpen = Boolean(filterAnchorEl);

  const REPORT_COLUMNS: { key: keyof ClientGroup; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'emails', label: 'Email Addresses' },
    { key: 'caqhReport', label: 'CAQH Report' },
    { key: 'enrollmentReport', label: 'Enrollment Report' },
  ];

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // matches pagination display in screenshot

  // Select row handler
  const handleSelectRow = (group: ClientGroup) => {
    setSelectedGroup(group);
    setEditGroup({ ...group, dataSets: [...group.dataSets] });
  };

  // Cancel edit form
  const handleCancelEdit = () => {
    setSelectedGroup(null);
    setEditGroup(null);
  };

  // Save changes from form
  const handleSaveChanges = () => {
    if (editGroup) {
      setGroups(prev => prev.map(g => g.id === editGroup.id ? { ...editGroup } : g));
      setSelectedGroup(null);
      setEditGroup(null);
    }
  };

  // Filter logic
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const matchesGlobal = 
        globalSearch === '' ||
        g.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        g.emails.toLowerCase().includes(globalSearch.toLowerCase()) ||
        g.caqhReport.toLowerCase().includes(globalSearch.toLowerCase()) ||
        g.enrollmentReport.toLowerCase().includes(globalSearch.toLowerCase());

      const matchesName = 
        filterName === '' ||
        g.name.toLowerCase().includes(filterName.toLowerCase());

      const matchesEmails = 
        filterEmails === '' ||
        g.emails.toLowerCase().includes(filterEmails.toLowerCase());

      const matchesCaqh = 
        filterCaqh === 'All' ||
        g.caqhReport === filterCaqh;

      const matchesEnrollment = 
        filterEnrollment === 'All' ||
        g.enrollmentReport === filterEnrollment;

      if (!(matchesGlobal && matchesName && matchesEmails && matchesCaqh && matchesEnrollment)) {
        return false;
      }

      // Popover Filter
      if (filterValue === '' && filterOperator !== 'is empty' && filterOperator !== 'is not empty') {
        return true;
      }

      const targetValue = (g[filterColumn] ?? '').toString();
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
    filterName,
    filterEmails,
    filterCaqh,
    filterEnrollment,
    filterColumn,
    filterOperator,
    filterValue,
    groups
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
    const headers = ['Name', 'Email Addresses (semi-colon delimited)', 'CAQH Report?', 'Enrollment Report?'];
    const rows = filteredGroups.map(g => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.emails.replace(/"/g, '""')}"`,
      `"${g.caqhReport}"`,
      `"${g.enrollmentReport}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "client_groups.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleGroups = useMemo(() => {
    return filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredGroups, page, rowsPerPage]);

  // Add Client Group
  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;
    
    const group: ClientGroup = {
      id: String(Date.now()),
      name: newGroupName,
      emails: '',
      caqhReport: 'No',
      enrollmentReport: 'Yes',
      dataSets: []
    };
    
    setGroups(prev => [group, ...prev]);
    setIsModalOpen(false);
    setNewGroupName('');
  };

  const switchStyles = {
      '&.MuiSwitch-root': {
        height: 46,
      },
      '& .MuiSwitch-track': {
        borderRadius: '16px',
        bgcolor: GREY[500],
        opacity: 1
      },
      '& .MuiButtonBase-root.MuiSwitch-switchBase': {
        top: 6,
        left: 5,
      },
      '& .MuiButtonBase-root.MuiSwitch-switchBase:hover': {
        bgcolor: 'transparent'
      },
      '& .MuiSwitch-thumb': {
        width: 16,
        height: 16,
        borderRadius: '50%',
        position: 'relative',
      },
      '& .MuiButtonBase-root.MuiSwitch-switchBase.Mui-checked':{
        color: theme.palette.primary.main,
        transform: 'translateX(13px)'
      }
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* Table Card */}
      <Box sx={{ pt: 2.5, mb: 3, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden', animation: `${fadeInUp} 0.3s ease-in-out` }}>
        
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
            startIcon={<Plus size={16} />}
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
                setFilterColumn(e.target.value as keyof ClientGroup);
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
          <Table sx={{ minWidth: 1000 }} aria-label="client groups table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '40%' }}>Name</TableCell>
                <TableCell sx={{ width: '40%' }}>Email Addresses (semi-colon delimited)</TableCell>
                <TableCell sx={{ width: 120 }}>CAQH Report?</TableCell>
                <TableCell sx={{ width: 140 }}>Enrollment Report?</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Filter Inputs Row */}
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                  {/* Name Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterName}
                      onChange={(e) => {
                        setFilterName(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* Emails Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterEmails}
                      onChange={(e) => {
                        setFilterEmails(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* CAQH Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      select
                      size="small"
                      label="Is"
                      value={filterCaqh}
                      onChange={(e) => {
                        setFilterCaqh(e.target.value);
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

                  {/* Enrollment Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      select
                      size="small"
                      label="Is"
                      value={filterEnrollment}
                      className='inline'
                      onChange={(e) => {
                        setFilterEnrollment(e.target.value);
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
                </TableRow>

              {/* List Rows */}
              {visibleGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No client groups found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                visibleGroups.map((row, index) => {
                  const isCream = index % 2 === 0;
                  const isSelected = selectedGroup?.id === row.id;
                  
                  let rowBg = theme.palette.mode === 'light' 
                    ? (isCream ? '#FEF4E4' : '#FFFFFF')
                    : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');
                  
                  if (isSelected) {
                    rowBg = alpha(theme.palette.primary.main, 0.12);
                  }

                  return (
                    <TableRow 
                      key={row.id}
                      onClick={() => handleSelectRow(row)}
                      sx={{ 
                        bgcolor: rowBg,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: isSelected 
                            ? alpha(theme.palette.primary.main, 0.16)
                            : theme.palette.primary.hover,
                        }
                      }}
                    >
                      {/* Name */}
                      <TableCell sx={{ fontSize: '14px', px: 2, fontWeight: isSelected ? 600 : 400 }}>{row.name}</TableCell>

                      {/* Emails */}
                      <TableCell sx={{ px: 2, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.emails || '—'}
                      </TableCell>

                      {/* CAQH Report? */}
                      <TableCell sx={{ px: 2 }}>{row.caqhReport}</TableCell>

                      {/* Enrollment Report? */}
                      <TableCell sx={{ px: 2 }}>{row.enrollmentReport}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2.5, py: 1.5 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredGroups.length}
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
      </Box>

      {/* Edit Form Below Table (Image 2 & 3 content) */}
      {editGroup && (
        <Card 
          sx={{ 
            p: 3, 
            mb: 5,
            borderRadius: 2, 
            boxShadow: 'none',
            animation: `${fadeInUp} 0.3s ease-in-out`
          }}
        >
          <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: 'text.primary' }}>
              Client Group
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Name"
                value={editGroup.name}
                onChange={(e) => setEditGroup(prev => prev ? { ...prev, name: e.target.value } : null)}
              />

              <TextField
                fullWidth
                label="Email Addresses (semi-colon delimited)"
                value={editGroup.emails}
                onChange={(e) => setEditGroup(prev => prev ? { ...prev, emails: e.target.value } : null)}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Switch 
                  checked={editGroup.caqhReport === 'Yes'}
                  onChange={(e) => setEditGroup(prev => prev ? { ...prev, caqhReport: e.target.checked ? 'Yes' : 'No' } : null)}
                  color="primary"
                  sx={switchStyles}
                />
                <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>
                  CAQH Report?
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Switch 
                  checked={editGroup.enrollmentReport === 'Yes'}
                  onChange={(e) => setEditGroup(prev => prev ? { ...prev, enrollmentReport: e.target.checked ? 'Yes' : 'No' } : null)}
                  color="primary"
                  sx={switchStyles}
                />
                <Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>
                  Enrollment Report?
                </Typography>
              </Box>
            </Box>

            {/* Data Set Multiple Selection Area */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>
                Data Set
              </Typography>

              {/* Selected Items Chips list */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {editGroup.dataSets.map(ds => (
                  <Box 
                    key={ds} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#161C24',
                      border: `1px solid ${theme.palette.divider}`,
                      px: 2, 
                      py: 0.8, 
                      borderRadius: 1,
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px'
                    }}
                  >
                    <span>{ds}</span>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setEditGroup(prev => {
                          if (!prev) return null;
                          return { ...prev, dataSets: prev.dataSets.filter(item => item !== ds) };
                        });
                      }}
                      sx={{ color: 'error.main', p: 0 }}
                      title="Remove"
                    >
                      <span style={{ fontSize: '15px', fontWeight: 700, marginLeft: '6px' }}>x</span>
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Dropdown to add more */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                <NativeSelect
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && editGroup && !editGroup.dataSets.includes(val)) {
                      setEditGroup(prev => {
                        if (!prev) return null;
                        return { ...prev, dataSets: [...prev.dataSets, val] };
                      });
                    }
                  }}
                  sx={{
                    width: 140,
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.8,
                    '&:before, &:after': { display: 'none' }
                  }}
                >
                  <option value="" disabled>Select...</option>
                  {ALL_DATASETS.filter(ds => !editGroup.dataSets.includes(ds)).map(ds => (
                    <option key={ds} value={ds}>{ds}</option>
                  ))}
                </NativeSelect>
              </Box>
            </Box>

            {/* Actions for Form */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
              <Button 
                variant="modalCancel" 
                onClick={handleCancelEdit}
                sx={{ borderRadius: '24px', px: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button 
                variant="modalAdd" 
                color="primary"
                onClick={handleSaveChanges}
                sx={{ borderRadius: '24px', px: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Save Changes
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Add Client Group Dialog Form */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleAddGroup,
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
            Add Client Group
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 4, pt: 5, pb: 3, px: 4.5 }}>
            <TextField
              required
              label="Name"
              placeholder="Client group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              autoFocus
              fullWidth
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
              disabled={!newGroupName}
              sx={{ minWidth: 100 }}
            >
              Add
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
