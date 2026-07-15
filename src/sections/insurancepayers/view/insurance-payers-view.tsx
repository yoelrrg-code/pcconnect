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
  Typography
} from '@mui/material';
import { Search, Filter, Download, Plus, History } from 'lucide-react';
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

  const [showFiltersRow, setShowFiltersRow] = useState(true);

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

      return matchesGlobal && matchesName && matchesActive;
    });
  }, [globalSearch, filterName, filterActive, payers]);

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
          onClick={() => setShowFiltersRow(!showFiltersRow)}
        >
          Filters
        </Button>

        <Button
          variant="toolbar"
          startIcon={<Download size={16} />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%' }}>
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
            {showFiltersRow && (
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
            )}

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
                        variant="cellEdit"
                        value={row.name}
                        onChange={(e) => handleCellEdit(row.id, 'name', e.target.value)}
                        fullWidth
                      />
                    </TableCell>

                    {/* Active (Editable Select) */}
                    <TableCell sx={{ px: 2 }}>
                      <NativeSelect
                        value={row.active}
                        onChange={(e) => handleCellEdit(row.id, 'active', e.target.value as 'Yes' | 'No')}
                        disableUnderline
                        sx={{
                          fontSize: '14px',
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
