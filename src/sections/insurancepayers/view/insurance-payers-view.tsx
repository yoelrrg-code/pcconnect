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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Popover
} from '@mui/material';
import { Search, Filter, Download, Plus, History, X } from 'lucide-react';
import { GREY } from '../../../theme/palette';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

export interface Payer {
  id: string;
  name: string;
  active: 'Yes' | 'No';
}

const MOCK_PAYERS: Payer[] = [
  { id: '1', name: 'AB75', active: 'Yes' },
  { id: '2', name: 'Aetna', active: 'Yes' },
  { id: '3', name: 'Anthem/Blue Cross-CA', active: 'Yes' },
  { id: '4', name: 'Anthem-VA', active: 'Yes' },
  { id: '5', name: 'APIPA', active: 'No' },
  { id: '6', name: 'BCBS-HI', active: 'Yes' },
  { id: '7', name: 'BCBS-IA (Wellmark)', active: 'Yes' },
  { id: '8', name: 'BCBS-IL', active: 'Yes' },
  { id: '9', name: 'BCBS-IN', active: 'Yes' },
  { id: '10', name: 'BCBS-MD', active: 'Yes' },
  { id: '11', name: 'BCBS-MI', active: 'Yes' },
  { id: '12', name: 'BCBS-MO', active: 'Yes' },
  { id: '13', name: 'BCBS-NC', active: 'Yes' },
  { id: '14', name: 'BCBS-NY', active: 'Yes' },
  { id: '15', name: 'BCBS-SC', active: 'Yes' },
  { id: '16', name: 'BCBS-TX', active: 'Yes' },
  { id: '17', name: 'Blue Shield-CA', active: 'Yes' },
  { id: '18', name: 'CalOptima', active: 'Yes' },
  { id: '19', name: 'Care 1st', active: 'No' },
  { id: '20', name: 'Carefirst- VA', active: 'Yes' },
  { id: '21', name: 'Cigna', active: 'Yes' },
  { id: '22', name: 'CMS Identity & Access', active: 'Yes' },
  { id: '23', name: 'DOL', active: 'Yes' },
  { id: '24', name: 'Health Choice', active: 'No' },
  { id: '25', name: 'Health Partners (IA)', active: 'Yes' },
  { id: '26', name: 'IEHP', active: 'Yes' },
  { id: '27', name: 'Maricopa Provider', active: 'No' },
  { id: '28', name: 'Medica (IA)', active: 'Yes' },
  { id: '29', name: 'Medicaid-AZ (AHCCCS)', active: 'Yes' },
  { id: '30', name: 'Medicaid-CA (MediCal)', active: 'Yes' },
  { id: '31', name: 'Medicaid-FL', active: 'Yes' },
  { id: '32', name: 'Medicaid-GA', active: 'Yes' },
  { id: '33', name: 'Medicaid-HI', active: 'Yes' },
];

export default function InsurancePayersView() {
  const theme = useTheme();

  // Payers States
  const [payers, setPayers] = useState<Payer[]>(MOCK_PAYERS);
  const [originalPayers, setOriginalPayers] = useState<Record<string, Payer>>(() => 
    MOCK_PAYERS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
  );

  // Dialog State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayer, setNewPayer] = useState<Omit<Payer, 'id'>>({
    name: '',
    active: 'Yes'
  });

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterActive, setFilterActive] = useState('All');

  // Popover States
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [filterColumn, setFilterColumn] = useState<keyof Payer>('name');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleCloseFilters = () => {
    setFilterAnchorEl(null);
  };
  const isFiltersOpen = Boolean(filterAnchorEl);

  const REPORT_COLUMNS: { key: keyof Payer; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'active', label: 'Active' },
  ];

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Cell editing handler
  const handleCellEdit = (payerId: string, field: 'name' | 'active', value: string) => {
    setPayers(prev => prev.map(p => p.id === payerId ? { ...p, [field]: value } : p));
  };

  // Discard changes in a row
  const handleDiscardRowChanges = (payerId: string) => {
    const original = originalPayers[payerId];
    if (original) {
      setPayers(prev => prev.map(p => p.id === payerId ? { ...original } : p));
    }
  };

  // Determine if a row has unsaved modifications
  const isRowDirty = useCallback((row: Payer) => {
    const original = originalPayers[row.id];
    if (!original) return false;
    return row.name !== original.name || row.active !== original.active;
  }, [originalPayers]);

  // Save all dirty changes
  const handleSaveAllChanges = () => {
    const newOriginals = payers.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
    setOriginalPayers(newOriginals);
  };

  // Discard all dirty changes
  const handleDiscardAllChanges = () => {
    setPayers(prev => prev.map(p => originalPayers[p.id] ? { ...originalPayers[p.id] } : p));
  };

  // Check if there are any pending changes
  const hasChanges = useMemo(() => {
    return payers.some(isRowDirty);
  }, [payers, isRowDirty]);

  // Filter logic
  const filteredPayers = useMemo(() => {
    return payers.filter((p) => {
      const matchesGlobal = 
        globalSearch === '' ||
        p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.active.toLowerCase().includes(globalSearch.toLowerCase());

      const matchesName = 
        filterName === '' ||
        p.name.toLowerCase().includes(filterName.toLowerCase());

      const matchesActive = 
        filterActive === 'All' ||
        p.active === filterActive;

      if (!(matchesGlobal && matchesName && matchesActive)) {
        return false;
      }

      // Popover Filter
      if (filterValue === '' && filterOperator !== 'is empty' && filterOperator !== 'is not empty') {
        return true;
      }

      const targetValue = (p[filterColumn] ?? '').toString();
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
    filterActive,
    filterColumn,
    filterOperator,
    filterValue,
    payers
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
    const headers = ['Name', 'Active'];
    const rows = filteredPayers.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.active}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "insurance_payers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visiblePayers = useMemo(() => {
    return filteredPayers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredPayers, page, rowsPerPage]);

  // Add Payer
  const handleAddPayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayer.name) return;
    const payer: Payer = {
      id: String(Date.now()),
      ...newPayer
    };
    setPayers(prev => [payer, ...prev]);
    setOriginalPayers(prev => ({ ...prev, [payer.id]: payer }));
    setIsModalOpen(false);
    // Reset form
    setNewPayer({
      name: '',
      active: 'Yes'
    });
  };

  return (
    <Box sx={{ pt: 2.5, mb: 5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden', animation: `${fadeInUp} 0.3s ease-in-out` }}>
      
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
              setFilterColumn(e.target.value as keyof Payer);
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
        <Table sx={{ minWidth: 600 }} aria-label="insurance payers table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '80%' }}>Name</TableCell>
              <TableCell sx={{ width: 120 }}>Active</TableCell>
              <TableCell sx={{ width: 60, textAlign: 'center' }}></TableCell>
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

                {/* Active Filter */}
                <TableCell sx={{ p: 1.5 }}>
                  <TextField
                    select
                    size="small"
                    label="Is"
                    value={filterActive}
                    className='inline'
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
            {visiblePayers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No insurance payers found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              visiblePayers.map((row, index) => {
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
                    {/* Name (Editable) */}
                    <TableCell sx={{ px: 2 }}>
                      <InputBase
                        variant="cellEditLarge"
                        value={row.name}
                        onChange={(e) => handleCellEdit(row.id, 'name', e.target.value)}
                        fullWidth
                      />
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
            count={filteredPayers.length}
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

      {/* Add Payer Dialog Form */}
      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        maxWidth="sm" 
        fullWidth
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleAddPayer,
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
            <Plus size={18} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: 0, fontSize: '18px' }}>
            Add Insurance Payer
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', rowGap: 4, pt: 5, pb: 3, px: 4.5 }}>
            <TextField
              required
              label="Payer Name"
              value={newPayer.name}
              onChange={(e) => setNewPayer(prev => ({ ...prev, name: e.target.value }))}
              autoFocus
              fullWidth
            />

            <TextField
              select
              fullWidth
              label="Active State"
              value={newPayer.active}
              onChange={(e) => setNewPayer(prev => ({ ...prev, active: e.target.value as 'Yes' | 'No' }))}
              slotProps={{ select: { native: true } }}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3.5, bgcolor: theme.palette.background.default }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, pt: 0, pb: 3, px: 4.5 }}>
            <Button 
              variant="modalCancel"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="modalAdd" 
              disabled={!newPayer.name}
            >
              Add Payer
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
