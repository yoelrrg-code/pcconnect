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
  TablePagination,
  Card} from '@mui/material';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

/**
 * Interface that defines the structure of a medical provider.
 */
interface Provider {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  npi: string;
  license: string;
  dea: string;
  active: 'Yes' | 'No';
}

interface FilterCriteria {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const MOCK_PROVIDERS: Provider[] = [
  { id: '1', name: 'Veronique Au MD', email: 'veronique.au@hotmail.com', firstName: 'Veronique', lastName: 'Au', dob: '04/21/1975', phone: '9252126302', npi: '1255399531', license: 'A79952', dea: 'BA7983946', active: 'No' },
  { id: '2', name: 'Richard Bodony MD', email: 'awby@earthlink.net', firstName: 'Richard', lastName: 'Bodony', dob: '01/22/1963', phone: '510671730', npi: '1225011422', license: 'G67219', dea: 'BB2093502', active: 'No' },
  { id: '3', name: 'Veronique Au MD', email: 'veronique.au@hotmail.com', firstName: 'Veronique', lastName: 'Au', dob: '04/21/1975', phone: '9252126302', npi: '1255399531', license: 'A79952', dea: 'BA7983946', active: 'No' },
  { id: '4', name: 'Richard Bodony MD', email: 'awby@earthlink.net', firstName: 'Richard', lastName: 'Bodony', dob: '01/22/1963', phone: '510671730', npi: '1225011422', license: 'G67219', dea: 'BB2093502', active: 'No' },
  { id: '5', name: 'Veronique Au MD', email: 'veronique.au@hotmail.com', firstName: 'Veronique', lastName: 'Au', dob: '04/21/1975', phone: '9252126302', npi: '1255399531', license: 'A79952', dea: 'BA7983946', active: 'No' },
  { id: '6', name: 'Richard Bodony MD', email: 'awby@earthlink.net', firstName: 'Richard', lastName: 'Bodony', dob: '01/22/1963', phone: '510671730', npi: '1225011422', license: 'G67219', dea: 'BB2093502', active: 'No' },
  { id: '7', name: 'Veronique Au MD', email: 'veronique.au@hotmail.com', firstName: 'Veronique', lastName: 'Au', dob: '04/21/1975', phone: '9252126302', npi: '1255399531', license: 'A79952', dea: 'BA7983946', active: 'No' },
  { id: '8', name: 'Richard Bodony MD', email: 'awby@earthlink.net', firstName: 'Richard', lastName: 'Bodony', dob: '01/22/1963', phone: '510671730', npi: '1225011422', license: 'G67219', dea: 'BB2093502', active: 'No' },
  { id: '9', name: 'Stephen Cady MD', email: 'scady@me.com', firstName: 'Stephen', lastName: 'Cady', dob: '11/14/1980', phone: '4155551212', npi: '1982736450', license: 'C12345', dea: 'BC1234567', active: 'Yes' },
  { id: '10', name: 'Susan Bradshaw MD', email: 'susanbeemd@sbcglobal.net', firstName: 'Susan', lastName: 'Bradshaw', dob: '09/05/1972', phone: '5105559876', npi: '1092837465', license: 'G98765', dea: 'BS9876543', active: 'Yes' },
  { id: '11', name: 'Aaron Andrade MD', email: 'aaron.j.andrade@gmail.com', firstName: 'Aaron', lastName: 'Andrade', dob: '12/30/1985', phone: '4085554321', npi: '1384729104', license: 'A84729', dea: 'BA8472910', active: 'Yes' },
  { id: '12', name: 'Patricia Bruens MD', email: 'pbruens@comcast.net', firstName: 'Patricia', lastName: 'Bruens', dob: '06/18/1968', phone: '9255553344', npi: '1728394056', license: 'A72839', dea: 'BP7283940', active: 'No' }
];

export default function EnrollmentManagementView() {
  const theme = useTheme();

  // Top Filters builder state
  const [filterRows, setFilterRows] = useState<FilterCriteria[]>([
    { id: '1', field: 'Data Sets', operator: 'Education', value: '' }
  ]);
  const [appliedTopFilters, setAppliedTopFilters] = useState<FilterCriteria[]>([]);

  // Search & inline filter states
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterFirst, setFilterFirst] = useState('');
  const [filterLast, setFilterLast] = useState('');
  const [filterDob, setFilterDob] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterNpi, setFilterNpi] = useState('');
  const [filterLicense, setFilterLicense] = useState('');
  const [filterDea, setFilterDea] = useState('');
  const [filterActive, setFilterActive] = useState('All');

  const [showFiltersRow, setShowFiltersRow] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Manage top filters criteria
  const handleAddCriteria = () => {
    setFilterRows([
      ...filterRows,
      { id: String(Date.now()), field: 'Data Sets', operator: 'Education', value: '' }
    ]);
  };

  const handleDeleteCriteria = (id: string) => {
    // If only one row remains, clear it instead of leaving empty
    if (filterRows.length === 1) {
      setFilterRows([{ id: '1', field: 'Data Sets', operator: 'Education', value: '' }]);
      setAppliedTopFilters([]);
    } else {
      setFilterRows(filterRows.filter((row) => row.id !== id));
    }
  };

  const handleUpdateCriteria = (id: string, updates: Partial<FilterCriteria>) => {
    setFilterRows(
      filterRows.map((row) => (row.id === id ? { ...row, ...updates } : row))
    );
  };

  const handleApplySearch = () => {
    setAppliedTopFilters([...filterRows]);
    setPage(0);
  };

  // Main filter logic combining: Top Query Builder + Global Search + Inline Table Filters
  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter((provider) => {
      // 1. Top Applied Filters
      const matchesTopFilters = appliedTopFilters.every((f) => {
        // Skip default placeholder options
        if (f.field === 'Data Sets' && f.operator === 'Education' && !f.value) {
          return true;
        }

        const searchTerm = f.value.toLowerCase();
        if (!searchTerm) return true;

        // Map field selection to actual property
        let targetValue: string;
        if (f.field === 'Email' || f.field === 'email') targetValue = provider.email;
        else if (f.field === 'First Name' || f.field === 'firstName') targetValue = provider.firstName;
        else if (f.field === 'Last Name' || f.field === 'lastName') targetValue = provider.lastName;
        else if (f.field === 'DOB' || f.field === 'dob') targetValue = provider.dob;
        else if (f.field === 'Phone' || f.field === 'phone') targetValue = provider.phone;
        else if (f.field === 'NPI' || f.field === 'npi') targetValue = provider.npi;
        else if (f.field === 'License' || f.field === 'license') targetValue = provider.license;
        else if (f.field === 'DEA#' || f.field === 'dea') targetValue = provider.dea;
        else if (f.field === 'Active' || f.field === 'active') targetValue = provider.active;
        else {
          // If default/unmapped, search across all relevant fields
          targetValue = `${provider.name} ${provider.email} ${provider.firstName} ${provider.lastName} ${provider.dob} ${provider.phone} ${provider.npi} ${provider.license} ${provider.dea} ${provider.active}`;
        }

        if (f.operator === 'Is') {
          return targetValue.toLowerCase() === searchTerm;
        }
        if (f.operator === 'Starts With') {
          return targetValue.toLowerCase().startsWith(searchTerm);
        }
        if (f.operator === 'Ends With') {
          return targetValue.toLowerCase().endsWith(searchTerm);
        }
        // Default operator "Contains" or "Education" fallback (contains)
        return targetValue.toLowerCase().includes(searchTerm);
      });

      if (!matchesTopFilters) return false;

      // 2. Global Search Toolbar
      const matchesGlobal = 
        globalSearch === '' ||
        provider.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        provider.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        provider.firstName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        provider.lastName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        provider.dob.includes(globalSearch) ||
        provider.phone.includes(globalSearch) ||
        provider.npi.includes(globalSearch) ||
        provider.license.toLowerCase().includes(globalSearch.toLowerCase()) ||
        provider.dea.toLowerCase().includes(globalSearch.toLowerCase());

      if (!matchesGlobal) return false;

      // 3. Inline Header Filters
      const matchesEmail = filterEmail === '' || provider.email.toLowerCase().includes(filterEmail.toLowerCase()) || provider.name.toLowerCase().includes(filterEmail.toLowerCase());
      const matchesFirst = filterFirst === '' || provider.firstName.toLowerCase().includes(filterFirst.toLowerCase());
      const matchesLast = filterLast === '' || provider.lastName.toLowerCase().includes(filterLast.toLowerCase());
      const matchesDob = filterDob === '' || provider.dob.includes(filterDob);
      const matchesPhone = filterPhone === '' || provider.phone.includes(filterPhone);
      const matchesNpi = filterNpi === '' || provider.npi.includes(filterNpi);
      const matchesLicense = filterLicense === '' || provider.license.toLowerCase().includes(filterLicense.toLowerCase());
      const matchesDea = filterDea === '' || provider.dea.toLowerCase().includes(filterDea.toLowerCase());
      const matchesActive = filterActive === 'All' || provider.active === filterActive;

      return matchesEmail && matchesFirst && matchesLast && matchesDob && matchesPhone && matchesNpi && matchesLicense && matchesDea && matchesActive;
    });
  }, [appliedTopFilters, globalSearch, filterEmail, filterFirst, filterLast, filterDob, filterPhone, filterNpi, filterLicense, filterDea, filterActive]);

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
    const headers = ['Name', 'Email', 'First', 'Last', 'DOB', 'Phone', 'NPI', 'License', 'DEA#', 'Active'];
    const rows = filteredProviders.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.email}"`,
      `"${p.firstName}"`,
      `"${p.lastName}"`,
      `"${p.dob}"`,
      `"${p.phone}"`,
      `"${p.npi}"`,
      `"${p.license}"`,
      `"${p.dea}"`,
      `"${p.active}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "providers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleProviders = useMemo(() => {
    return filteredProviders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredProviders, page, rowsPerPage]);

  return (
    <Box sx={{ animation: `${fadeInUp} 0.3s ease-in-out` }}>
      
      {/* Top Query Builder Card (Filters) */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.05)' }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Filters
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filterRows.map((row) => (
            <Box 
              key={row.id} 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center', 
                flexWrap: 'wrap' 
              }}
            >
              {/* Dropdown 1: Fields / Data Sets */}
              <TextField
                  select
                  value={row.field}
                  onChange={(e) => handleUpdateCriteria(row.id, { field: e.target.value })}
                  slotProps={{
                    select: { native: true }
                  }}
              >
                <option value="Data Sets">Data Sets</option>
                <option value="Email">Email</option>
                <option value="First Name">First Name</option>
                <option value="Last Name">Last Name</option>
                <option value="DOB">DOB</option>
                <option value="Phone">Phone</option>
                <option value="NPI">NPI</option>
                <option value="License">License</option>
                <option value="DEA#">DEA#</option>
                <option value="Active">Active</option>
              </TextField>

              {/* Dropdown 2: Operators / Education */}
              <TextField
                  select
                  value={row.operator}
                  onChange={(e) => handleUpdateCriteria(row.id, { operator: e.target.value })}
                  slotProps={{
                    select: { native: true }
                  }}
              >
                <option value="Education">Education</option>
                <option value="Contains">Contains</option>
                <option value="Is">Is</option>
                <option value="Starts With">Starts With</option>
                <option value="Ends With">Ends With</option>
              </TextField>

              {/* Input Value */}
              <TextField
                placeholder="Value"
                value={row.value}
                onChange={(e) => handleUpdateCriteria(row.id, { value: e.target.value })}
              />

              {/* Delete Button */}
              <Button
                variant="modalCancel"
                onClick={() => handleDeleteCriteria(row.id)}
                sx={{ marginRight: 10 }}
              >
                Delete
              </Button>

              {/* Search Button */}
              <Button
                variant="modalAdd"
                onClick={handleApplySearch}
              >
                Search
              </Button>

              {/* Add Criteria Button */}
              <Button
                variant="modalCancel"
                startIcon={<Plus size={16} />}
                onClick={handleAddCriteria}
              >
                Add Criteria
              </Button>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Main Table Card */}
      <Box sx={{ pt: 2.5, bgcolor: theme.palette.background.paper, borderRadius: 2, overflow: 'hidden', boxShadow: '0px 0px 16px 0px rgba(0, 0, 0, 0.05)' }}>
        
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
        <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%', border: 'none' }}>
          <Table sx={{ minWidth: 1000 }} aria-label="provider enrollment table">
            <TableHead>
              {/* Header Columns */}
              <TableRow>
                <TableCell sx={{ minWidth: 200 }}>Email</TableCell>
                <TableCell>First</TableCell>
                <TableCell>Last</TableCell>
                <TableCell sx={{ minWidth: 130 }}>DOB</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Phone</TableCell>
                <TableCell sx={{ minWidth: 140 }}>NPI</TableCell>
                <TableCell sx={{ minWidth: 120 }}>License</TableCell>
                <TableCell sx={{ minWidth: 140 }}>DEA#</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Active</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
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
                      fullWidth
                    />
                  </TableCell>

                  {/* First Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterFirst}
                      onChange={(e) => {
                        setFilterFirst(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* Last Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterLast}
                      onChange={(e) => {
                        setFilterLast(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* DOB Filter (DatePicker) */}
                  <TableCell sx={{ p: 1.5, fontSize: '12px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileDatePicker
                        label="Is"
                        value={filterDob ? dayjs(filterDob, 'MM/DD/YYYY') : null}
                        onChange={(newValue) => {
                          setFilterDob(newValue ? newValue.format('MM/DD/YYYY') : '');
                          setPage(0);
                        }}
                        slotProps={{
                          textField: { 
                            className: 'small',
                            fullWidth: true
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </TableCell>

                  {/* Phone Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterPhone}
                      onChange={(e) => {
                        setFilterPhone(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* NPI Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterNpi}
                      onChange={(e) => {
                        setFilterNpi(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* License Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterLicense}
                      onChange={(e) => {
                        setFilterLicense(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* DEA Filter */}
                  <TableCell sx={{ p: 1.5 }}>
                    <TextField
                      size="small"
                      label="Contains"
                      value={filterDea}
                      onChange={(e) => {
                        setFilterDea(e.target.value);
                        setPage(0);
                      }}
                      fullWidth
                    />
                  </TableCell>

                  {/* Active Filter Dropdown */}
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
                      <option value="All">Is</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </TextField>
                  </TableCell>
                </TableRow>
              )}

              {visibleProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No providers found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                visibleProviders.map((row, index) => {
                  const isCream = index % 2 === 0;
                  const rowBg = theme.palette.mode === 'light' 
                  ? (isCream ? '#FEF4E4' : '#FFFFFF') // Alternating cream row background matching Users Management
                  : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');

                  return (
                    <TableRow 
                      key={row.id + '-' + index}
                      sx={{ 
                        bgcolor: rowBg,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.primary.hover,
                          '& .MuiTableCell-root:first-of-type .dataset-link': {
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                          }
                        }
                      }}
                    >
                      {/* Name & Email stacked */}
                      <TableCell>
                        <Link 
                          href="#" 
                          onClick={(e) => e.preventDefault()}
                          sx={{ 
                            fontSize: '14px',
                            fontWeight: 500, 
                            color: theme.palette.text.primary,
                            textDecoration: 'underline',
                            display: 'block',
                            '&:hover': {
                              textDecoration: 'none'
                            }
                          }}
                        >
                          {row.name}
                        </Link>
                        <Link 
                          href="#" 
                          onClick={(e) => e.preventDefault()}
                          sx={{ 
                            fontSize: '12px',
                            fontWeight: 400, 
                            color: theme.palette.text.secondary,
                            textDecoration: 'underline',
                            display: 'block',
                            mt: 0.2,
                            '&:hover': {
                              textDecoration: 'none'
                            }
                          }}
                        >
                          {row.email}
                        </Link>
                      </TableCell>

                      {/* First */}
                      <TableCell>
                        {row.firstName}
                      </TableCell>

                      {/* Last */}
                      <TableCell>
                        {row.lastName}
                      </TableCell>

                      {/* DOB */}
                      <TableCell>
                        {row.dob}
                      </TableCell>

                      {/* Phone */}
                      <TableCell>
                        {row.phone}
                      </TableCell>

                      {/* NPI */}
                      <TableCell>
                        {row.npi}
                      </TableCell>

                      {/* License */}
                      <TableCell>
                        {row.license}
                      </TableCell>

                      {/* DEA# */}
                      <TableCell>
                        {row.dea}
                      </TableCell>

                      {/* Active */}
                      <TableCell>
                        {row.active}
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
            count={filteredProviders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
          />
        </TableContainer>
      </Box>
    </Box>
  );
}
