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
  InputBase,
  NativeSelect,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Popover
} from '@mui/material';
import { Search, Filter, Download, Plus, History, Files, X } from 'lucide-react';
import { GREY } from '../../../theme/palette';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

export interface EDFloorVisit {
  id: string;
  site: string;
  acct: string;
  mrn: string;
  dob: string; // YYYY-MM-DD
  dos: string; // YYYY-MM-DD
  fileCount: string;
  notes: string;
  status: string;
  created: string; // YYYY-MM-DD
}

const MOCK_VISITS: EDFloorVisit[] = [
  { id: '1', site: 'EPA Fremont (Washington Hospital)', acct: '', mrn: '1638113', dob: '1939-10-10', dos: '1939-10-10', fileCount: 'No files', notes: 'Forgot to add laceration note to the ED provider note. It is in now', status: 'New', created: '2025-08-31' },
  { id: '2', site: 'EPA Fremont (Washington Hospital)', acct: '', mrn: '', dob: '', dos: '', fileCount: 'No files', notes: '', status: 'New', created: '2025-08-31' },
  { id: '3', site: 'Emergency Physicians of San Gabriel Valley', acct: '', mrn: '', dob: '', dos: '', fileCount: '1', notes: '', status: 'New', created: '2025-07-05' },
  { id: '4', site: 'Emergency Physicians of San Gabriel Valley', acct: '123456', mrn: 'X988746', dob: '2001-01-01', dos: '2001-01-01', fileCount: 'No files', notes: 'Test', status: 'New', created: '2025-07-05' },
  { id: '5', site: 'Mountain View Emergency', acct: 'test', mrn: 'test', dob: '', dos: '', fileCount: '1', notes: 'test', status: 'New', created: '2025-07-05' },
  { id: '6', site: 'Mountain View Emergency', acct: 'test', mrn: 'test', dob: '', dos: '', fileCount: 'No files', notes: 'test 123', status: 'New', created: '2025-02-06' },
];

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }
  return dateStr;
};

export default function EDFloorVisitsView() {
  const theme = useTheme();

  // Visits States
  const [visits, setVisits] = useState<EDFloorVisit[]>(MOCK_VISITS);
  const [originalVisits, setOriginalVisits] = useState<Record<string, EDFloorVisit>>(() => 
    MOCK_VISITS.reduce((acc, v) => ({ ...acc, [v.id]: v }), {})
  );

  // Dialog State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVisit, setNewVisit] = useState<Omit<EDFloorVisit, 'id'>>({
    site: 'EPA Fremont (Washington Hospital)',
    acct: '',
    mrn: '',
    dob: '',
    dos: '',
    fileCount: 'No Files',
    notes: '',
    status: 'New',
    created: dayjs().format('YYYY-MM-DD')
  });

  const [selectedVisitForFiles, setSelectedVisitForFiles] = useState<EDFloorVisit | null>(null);

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterSite, setFilterSite] = useState('All');
  const [filterAcct, setFilterAcct] = useState('');
  const [filterMrn, setFilterMrn] = useState('');
  const [filterDob, setFilterDob] = useState('');
  const [filterDos, setFilterDos] = useState('');
  const [filterFileCount, setFilterFileCount] = useState('');
  const [filterNotes, setFilterNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCreated, setFilterCreated] = useState('');

  // Popover States
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterColumn, setFilterColumn] = useState<keyof EDFloorVisit>('site');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };
  const isFiltersOpen = Boolean(filterAnchorEl);

  const REPORT_COLUMNS: { key: keyof EDFloorVisit; label: string }[] = [
    { key: 'site', label: 'Site' },
    { key: 'acct', label: 'Acct' },
    { key: 'mrn', label: 'MRN' },
    { key: 'dob', label: 'DOB' },
    { key: 'dos', label: 'DOS' },
    { key: 'fileCount', label: 'File Count' },
    { key: 'notes', label: 'Notes' },
    { key: 'status', label: 'Status' },
    { key: 'created', label: 'Created' },
  ];

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25); // matches the 25 in the screenshot

  // Cell editing handler
  const handleCellEdit = (visitId: string, field: 'notes' | 'status', value: string) => {
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, [field]: value } : v));
  };

  // Discard changes in a row
  const handleDiscardRowChanges = (visitId: string) => {
    const original = originalVisits[visitId];
    if (original) {
      setVisits(prev => prev.map(v => v.id === visitId ? { ...original } : v));
    }
  };

  // Determine if a row has unsaved modifications
  const isRowDirty = useCallback((row: EDFloorVisit) => {
    const original = originalVisits[row.id];
    if (!original) return false;
    return row.notes !== original.notes || row.status !== original.status;
  }, [originalVisits]);

  // Save all dirty changes
  const handleSaveAllChanges = () => {
    const newOriginals = visits.reduce((acc, v) => ({ ...acc, [v.id]: v }), {});
    setOriginalVisits(newOriginals);
  };

  // Discard all dirty changes
  const handleDiscardAllChanges = () => {
    setVisits(prev => prev.map(v => originalVisits[v.id] ? { ...originalVisits[v.id] } : v));
  };

  // Check if there are any pending changes
  const hasChanges = useMemo(() => {
    return visits.some(isRowDirty);
  }, [visits, isRowDirty]);

  // Filter logic
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchesGlobal = 
        globalSearch === '' ||
        v.site.toLowerCase().includes(globalSearch.toLowerCase()) ||
        v.acct.toLowerCase().includes(globalSearch.toLowerCase()) ||
        v.mrn.toLowerCase().includes(globalSearch.toLowerCase()) ||
        v.notes.toLowerCase().includes(globalSearch.toLowerCase()) ||
        formatDateDisplay(v.dob).includes(globalSearch) ||
        formatDateDisplay(v.dos).includes(globalSearch) ||
        formatDateDisplay(v.created).includes(globalSearch);

      const matchesSite = 
        filterSite === 'All' ||
        v.site === filterSite;

      const matchesAcct = 
        filterAcct === '' ||
        v.acct.toLowerCase().includes(filterAcct.toLowerCase());

      const matchesMrn = 
        filterMrn === '' ||
        v.mrn.toLowerCase().includes(filterMrn.toLowerCase());

      const matchesDob = 
        filterDob === '' ||
        v.dob === filterDob;

      const matchesDos = 
        filterDos === '' ||
        v.dos === filterDos;

      const matchesFileCount = 
        filterFileCount === '' ||
        v.fileCount.toLowerCase().includes(filterFileCount.toLowerCase());

      const matchesNotes = 
        filterNotes === '' ||
        v.notes.toLowerCase().includes(filterNotes.toLowerCase());

      const matchesStatus = 
        filterStatus === 'All' ||
        v.status === filterStatus;

      const matchesCreated = 
        filterCreated === '' ||
        v.created === filterCreated;

      if (!(
        matchesGlobal &&
        matchesSite &&
        matchesAcct &&
        matchesMrn &&
        matchesDob &&
        matchesDos &&
        matchesFileCount &&
        matchesNotes &&
        matchesStatus &&
        matchesCreated
      )) {
        return false;
      }

      // Popover Filter
      if (filterValue === '' && filterOperator !== 'is empty' && filterOperator !== 'is not empty') {
        return true;
      }

      const targetValue = 
        filterColumn === 'dob' ? formatDateDisplay(v.dob) :
        filterColumn === 'dos' ? formatDateDisplay(v.dos) :
        filterColumn === 'created' ? formatDateDisplay(v.created) :
        (v[filterColumn] ?? '').toString();

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
    filterSite,
    filterAcct,
    filterMrn,
    filterDob,
    filterDos,
    filterFileCount,
    filterNotes,
    filterStatus,
    filterCreated,
    filterColumn,
    filterOperator,
    filterValue,
    visits
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
    const headers = ['Site', 'ACCT#', 'MRN', 'DOB', 'DOS', 'File Count', 'Notes', 'Status', 'Created'];
    const rows = filteredVisits.map(v => [
      `"${v.site.replace(/"/g, '""')}"`,
      `"${v.acct.replace(/"/g, '""')}"`,
      `"${v.mrn.replace(/"/g, '""')}"`,
      `"${formatDateDisplay(v.dob)}"`,
      `"${formatDateDisplay(v.dos)}"`,
      `"${v.fileCount.replace(/"/g, '""')}"`,
      `"${v.notes.replace(/"/g, '""')}"`,
      `"${v.status}"`,
      `"${formatDateDisplay(v.created)}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ed_floor_visits.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleVisits = useMemo(() => {
    return filteredVisits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredVisits, page, rowsPerPage]);

  const uniqueSites = useMemo(() => {
    const sites = new Set(visits.map(v => v.site));
    return Array.from(sites);
  }, [visits]);

  // Add Visit
  const handleAddVisit = () => {
    if (!newVisit.mrn || !newVisit.dob || !newVisit.dos) return;
    const visit: EDFloorVisit = {
      id: String(Date.now()),
      ...newVisit
    };
    setVisits(prev => [visit, ...prev]);
    setOriginalVisits(prev => ({ ...prev, [visit.id]: visit }));
    setIsModalOpen(false);
    // Reset form
    setNewVisit({
      site: 'EPA Fremont (Washington Hospital)',
      acct: '',
      mrn: '',
      dob: '',
      dos: '',
      fileCount: 'No Files',
      notes: '',
      status: 'New',
      created: dayjs().format('YYYY-MM-DD')
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
              setFilterColumn(e.target.value as keyof EDFloorVisit);
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
        <Table sx={{ minWidth: 1500 }} aria-label="ed floor visits table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 260 }}>Site</TableCell>
              <TableCell sx={{ width: 100 }}>ACCT#</TableCell>
              <TableCell sx={{ width: 120 }}>MRN</TableCell>
              <TableCell sx={{ width: 130 }}>DOB</TableCell>
              <TableCell sx={{ width: 130 }}>DOS</TableCell>
              <TableCell sx={{ width: 110 }}>File Count</TableCell>
              <TableCell sx={{ width: 320 }}>Notes</TableCell>
              <TableCell sx={{ width: 120 }}>Status</TableCell>
              <TableCell sx={{ width: 130 }}>Created</TableCell>
              <TableCell sx={{ width: 60, textAlign: 'center' }}></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Filter Inputs Row */}
              <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                {/* Site Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    select
                    size="small"
                    label="Is"
                    value={filterSite}
                    onChange={(e) => {
                      setFilterSite(e.target.value);
                      setPage(0);
                    }}
                    slotProps={{
                      select: { native: true }
                    }}
                    fullWidth
                  >
                    <option value="All">All</option>
                    {uniqueSites.map(site => (
                      <option key={site} value={site}>{site}</option>
                    ))}
                  </TextField>
                </TableCell>
                
                {/* ACCT# Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterAcct}
                    onChange={(e) => {
                      setFilterAcct(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* MRN Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterMrn}
                    onChange={(e) => {
                      setFilterMrn(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* DOB Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Is"
                      value={filterDob ? dayjs(filterDob) : null}
                      onChange={(newValue) => {
                        setFilterDob(newValue ? newValue.format('YYYY-MM-DD') : '');
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

                {/* DOS Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Is"
                      value={filterDos ? dayjs(filterDos) : null}
                      onChange={(newValue) => {
                        setFilterDos(newValue ? newValue.format('YYYY-MM-DD') : '');
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

                {/* File Count Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterFileCount}
                    onChange={(e) => {
                      setFilterFileCount(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* Notes Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    size="small"
                    label="Contains"
                    value={filterNotes}
                    onChange={(e) => {
                      setFilterNotes(e.target.value);
                      setPage(0);
                    }}
                    fullWidth
                  />
                </TableCell>

                {/* Status Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    select
                    size="small"
                    label="Is"
                    value={filterStatus}
                    className='inline'
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(0);
                    }}
                    slotProps={{
                      select: { native: true }
                    }}
                    fullWidth
                  >
                    <option value="All">All</option>
                    <option value="New">New</option>
                    <option value="Seen">Seen</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Done">Done</option>
                  </TextField>
                </TableCell>

                {/* Created Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Is"
                      value={filterCreated ? dayjs(filterCreated) : null}
                      onChange={(newValue) => {
                        setFilterCreated(newValue ? newValue.format('YYYY-MM-DD') : '');
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

                {/* Reset button empty space */}
                <TableCell sx={{ p: 1.5 }}></TableCell>
              </TableRow>

            {/* List Rows */}
            {visibleVisits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No ED floor visits found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              visibleVisits.map((row, index) => {
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
                    {/* Site */}
                    <TableCell sx={{ fontSize: '14px', px: 2 }}>{row.site}</TableCell>

                    {/* ACCT# */}
                    <TableCell sx={{ px: 2 }}>{row.acct || '—'}</TableCell>

                    {/* MRN */}
                    <TableCell sx={{ px: 2 }}>{row.mrn}</TableCell>

                    {/* DOB */}
                    <TableCell sx={{ px: 2 }}>{formatDateDisplay(row.dob)}</TableCell>

                    {/* DOS */}
                    <TableCell sx={{ px: 2 }}>{formatDateDisplay(row.dos)}</TableCell>

                    {/* File Count */}
                    <TableCell sx={{ px: 2 }}>
                      <Link 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedVisitForFiles(row);
                        }} 
                        sx={{ 
                          color: 'primary.main', 
                          textDecoration: 'underline',
                          fontWeight: 500,
                          cursor: 'pointer' 
                        }}
                      >
                        {row.fileCount}
                      </Link>
                    </TableCell>

                    {/* Notes (Editable) */}
                    <TableCell sx={{ px: 2 }}>
                      <InputBase
                        variant="cellEdit"
                        value={row.notes}
                        onChange={(e) => handleCellEdit(row.id, 'notes', e.target.value)}
                        fullWidth
                      />
                    </TableCell>

                    {/* Status (Editable Select) */}
                    <TableCell sx={{ px: 2 }}>
                      <NativeSelect
                        className="cellEdit"
                        value={row.status}
                        onChange={(e) => handleCellEdit(row.id, 'status', e.target.value)}
                        disableUnderline
                      >
                        <option value="All">All</option>
                        <option value="New">New</option>
                        <option value="Seen">Seen</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Done">Done</option>
                      </NativeSelect>
                    </TableCell>

                    {/* Created */}
                    <TableCell sx={{ px: 2 }}>{formatDateDisplay(row.created)}</TableCell>

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
            count={filteredVisits.length}
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

      {/* Add Visit Dialog Form */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>Add ED Floor Visit</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            select
            fullWidth
            label="Site"
            value={newVisit.site}
            onChange={(e) => setNewVisit(prev => ({ ...prev, site: e.target.value }))}
            slotProps={{ select: { native: true } }}
          >
            <option value="EPA Fremont (Washington Hospital)">EPA Fremont (Washington Hospital)</option>
            <option value="EPA Hayward (St. Rose Hospital)">EPA Hayward (St. Rose Hospital)</option>
            <option value="EPA San Jose (Regional Medical Center)">EPA San Jose (Regional Medical Center)</option>
          </TextField>

          <TextField
            fullWidth
            label="ACCT#"
            value={newVisit.acct}
            onChange={(e) => setNewVisit(prev => ({ ...prev, acct: e.target.value }))}
          />

          <TextField
            fullWidth
            label="MRN"
            value={newVisit.mrn}
            onChange={(e) => setNewVisit(prev => ({ ...prev, mrn: e.target.value }))}
            required
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MobileDatePicker
                label="DOB"
                value={newVisit.dob ? dayjs(newVisit.dob) : null}
                onChange={(val) => setNewVisit(prev => ({ ...prev, dob: val ? val.format('YYYY-MM-DD') : '' }))}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
              <MobileDatePicker
                label="DOS"
                value={newVisit.dos ? dayjs(newVisit.dos) : null}
                onChange={(val) => setNewVisit(prev => ({ ...prev, dos: val ? val.format('YYYY-MM-DD') : '' }))}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            fullWidth
            label="Notes"
            value={newVisit.notes}
            onChange={(e) => setNewVisit(prev => ({ ...prev, notes: e.target.value }))}
            multiline
            rows={2}
          />

          <TextField
            select
            fullWidth
            label="Status"
            value={newVisit.status}
            onChange={(e) => setNewVisit(prev => ({ ...prev, status: e.target.value }))}
            slotProps={{ select: { native: true } }}
          >
            <option value="New">New</option>
            <option value="In Process">In Process</option>
            <option value="Completed">Completed</option>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setIsModalOpen(false)} variant="outlined" sx={{ borderRadius: '24px' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddVisit} 
            variant="contained" 
            color="primary" 
            disabled={!newVisit.mrn || !newVisit.dob || !newVisit.dos}
            sx={{ borderRadius: '24px' }}
          >
            Add Visit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Files List Dialog */}
      <Dialog 
        open={Boolean(selectedVisitForFiles)} 
        onClose={() => setSelectedVisitForFiles(null)} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px' }
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, pt: 3, pb: 2 }}>
          <Files size={24} style={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, color: 'text.primary', fontSize: '20px' }}>
            Files
          </Typography>
        </DialogTitle>

        <Box sx={{ bgcolor: '#303E4F', color: '#fff', py: 1.5, px: 3, fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>
          File Location: <span style={{ fontWeight: 600 }}>V:\PC Connect Import\Pending Patient</span>
        </Box>

        <DialogContent sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {selectedVisitForFiles && (
            selectedVisitForFiles.fileCount.toLowerCase().includes('no file') ? (
              <Typography sx={{ fontSize: '15px', fontFamily: 'Poppins, sans-serif', color: 'text.primary' }}>
                No Files.
              </Typography>
            ) : (
              <Typography sx={{ fontSize: '15px', fontFamily: 'Poppins, sans-serif', color: 'text.primary' }}>
                Cr_Memo_SEP2024G63_from_PHYSICIANS_CHOICE_LLC_8776.pdf
              </Typography>
            )
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
            <Button 
              onClick={() => setSelectedVisitForFiles(null)} 
              variant="modalAdd" 
              color="primary" 
            >
              Close
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
