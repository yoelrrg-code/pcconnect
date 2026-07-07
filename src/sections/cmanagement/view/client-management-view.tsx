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
  useTheme, 
  alpha,
  TablePagination,
  Switch,
  Card
} from '@mui/material';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { GREY } from '../../../theme/palette';
import dayjs from 'dayjs';
import { AddClient } from './add-client-view';
import { fadeInUp } from '../../../theme/effects';

// Import your custom background image assets here:
import profileBG from '../../../assets/bg-profile.png';

// ----------------------------------------------------------------------

/**
 * Interfaz que define la estructura de datos de un cliente en el sistema.
 */
export interface Client {
  id: string;
  dataSet: string; // e.g. A01
  los: number;     // e.g. 1
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  start: string;   // YYYY-MM-DD
  end: string;     // YYYY-MM-DD or empty
  active: 'Yes' | 'No';
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', dataSet: 'A01', los: 1, name: 'South Shore Anesthesia Staffing, LLC', address: '2212 Fitch Avenue', city: 'MARQUETTE', state: 'MI', zip: '49855-5406', phone: '906-361-4901', fax: '', start: '2020-11-17', end: '', active: 'Yes' },
  { id: '2', dataSet: 'A02', los: 1, name: 'Elite Anesthesia LLC', address: '7400 France Ave S Ste 102', city: 'MINNEAPOLIS', state: 'MN', zip: '55435-4738', phone: '507-676-1011', fax: '', start: '2022-03-01', end: '', active: 'Yes' },
  { id: '3', dataSet: 'A03', los: 1, name: 'UP Bell Hospital Anesthesia (Lifepoint)', address: '901 Lakeshore Drive', city: 'ISHPEMING', state: 'MI', zip: '49849', phone: '', fax: '', start: '2022-07-01', end: '', active: 'Yes' },
  { id: '4', dataSet: 'A04', los: 1, name: 'Fairfax Colon & Rectal Surgery', address: '2710 Prosperity Ave\nSuite 200', city: 'FAIRFAX', state: 'VA', zip: '220314358', phone: '7036502333', fax: '', start: '2023-02-01', end: '', active: 'Yes' },
  { id: '5', dataSet: 'A05', los: 1, name: 'AAS Indiana, LLC', address: '43422 W Oaks Dr\nSte 332', city: 'NOVI', state: 'MI', zip: '48377', phone: '', fax: '', start: '2023-03-01', end: '', active: 'Yes' },
  { id: '6', dataSet: 'A05A', los: 2, name: 'AAS Indiana, LLC', address: '43422 W Oaks Dr\nSte 332', city: 'NOVI', state: 'MI', zip: '48377', phone: '', fax: '', start: '2023-03-01', end: '', active: 'Yes' },
  { id: '7', dataSet: 'A06', los: 1, name: 'Detroit Anesthesia Group LLC', address: '26750 Providence Pkwy\nSuite 100', city: 'NOVI', state: 'MI', zip: '483741211', phone: '248-662-1500', fax: '', start: '2023-05-01', end: '', active: 'Yes' },
  { id: '8', dataSet: 'A06A', los: 2, name: 'Detroit Anesthesia Group LLC', address: '24430 Ford Rd', city: 'DEARBORN HEIGHTS', state: 'MI', zip: '481273280', phone: '313-357-2688', fax: '', start: '2023-05-01', end: '', active: 'Yes' },
  { id: '9', dataSet: 'A06B', los: 3, name: 'Detroit Anesthesia Group LLC', address: '19725 Allen Rd', city: 'TRENTON', state: 'MI', zip: '481831090', phone: '734-479-7246', fax: '', start: '2023-05-01', end: '', active: 'Yes' },
  { id: '10', dataSet: 'A06C', los: 4, name: 'Detroit Anesthesia Group LLC', address: '4550 Investment Dr\nSuite B111', city: 'TROY', state: 'MI', zip: '480986362', phone: '248-952-5019', fax: '', start: '2023-05-01', end: '', active: 'Yes' },
  { id: '11', dataSet: 'A07', los: 1, name: 'Michigan CRNAS Staffing LLC', address: '26750 Providence Pkwy\nSuite 100', city: 'NOVI', state: 'MI', zip: '483741211', phone: '248-662-1500', fax: '', start: '2023-05-01', end: '', active: 'Yes' },
];

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }
  return dateStr;
};

/**
 * Vista principal de la gestión de clientes (Client Management).
 * Maneja dos estados principales:
 * 1. Tabla de listado de clientes con filtros múltiples, búsqueda global, paginación y exportación CSV.
 * 2. Vista de perfil de cliente detallado (cuando activeTab es '#client-profile').
 * 
 * @param props - Propiedades del componente.
 * @param props.activeTab - El ID de la vista/tab actualmente activo.
 * @param props.setActiveTab - Función callback para navegar entre vistas.
 */
export default function ClientManagementView({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab?: string; 
  setActiveTab?: (tab: string) => void; 
}) {
  const theme = useTheme();

  // Client States
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);

  // Selected client for profile view
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Dialog state for adding a client
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Profile Form States
  const [profileName, setProfileName] = useState('');
  const [profileLos, setProfileLos] = useState(1);
  const [profileNpi, setProfileNpi] = useState('1013525112');
  const [profileStart, setProfileStart] = useState('');
  const [profileEnd, setProfileEnd] = useState('');
  const [profileCredNecessary, setProfileCredNecessary] = useState(false);
  const [profileCredVerification, setProfileCredVerification] = useState(false);
  const [profileActive, setProfileActive] = useState(true);

  // Contact
  const [profileContactTab, setProfileContactTab] = useState('Primary');
  const [profileAddress1, setProfileAddress1] = useState('');
  const [profileAddress2, setProfileAddress2] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileState, setProfileState] = useState('');
  const [profileZip, setProfileZip] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileFax, setProfileFax] = useState('');

  // Business
  const [profileEin, setProfileEin] = useState('85-1930565');
  const [profileEntityType, setProfileEntityType] = useState('');
  const [profileEntityDate, setProfileEntityDate] = useState('');
  const [profileFiscal, setProfileFiscal] = useState('');
  const [profilePermit, setProfilePermit] = useState('');
  const [profileBusinessEffective, setProfileBusinessEffective] = useState('');
  const [profileBusinessExpiration, setProfileBusinessExpiration] = useState('');

  // Administration
  const [profileNpSwitch, setProfileNpSwitch] = useState(false);
  const [profilePaSwitch, setProfilePaSwitch] = useState(false);
  const [profileResSwitch, setProfileResSwitch] = useState(false);
  const [profilePhysName, setProfilePhysName] = useState('');
  const [profilePhysPhone, setProfilePhysPhone] = useState('');
  const [profilePhysFax, setProfilePhysFax] = useState('');
  const [profileAdminName, setProfileAdminName] = useState('');
  const [profileAdminPhone, setProfileAdminPhone] = useState('');
  const [profileAdminFax, setProfileAdminFax] = useState('');

  // Malpractice
  const [profileMalLegalName, setProfileMalLegalName] = useState('');
  const [profileMalCarrier, setProfileMalCarrier] = useState('');
  const [profileMalPolicy, setProfileMalPolicy] = useState('');
  const [profileMalEffective, setProfileMalEffective] = useState('');
  const [profileMalExpiration, setProfileMalExpiration] = useState('');
  const [profileMalLimitOccur, setProfileMalLimitOccur] = useState('');
  const [profileMalCarrierAgg, setProfileMalCarrierAgg] = useState('');

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setProfileName(client.name);
    setProfileLos(client.los);
    setProfileNpi(client.dataSet === 'A01' ? '1013525112' : '1013525112');
    setProfileStart(client.start);
    setProfileEnd(client.end || '');
    setProfileCredNecessary(false);
    setProfileCredVerification(false);
    setProfileActive(client.active === 'Yes');

    // Contact
    setProfileContactTab('Primary');
    setProfileAddress1(client.address.split('\n')[0]);
    setProfileAddress2(client.address.split('\n')[1] || '');
    setProfileCity(client.city);
    setProfileState(client.state);
    setProfileZip(client.zip);
    setProfilePhone(client.phone);
    setProfileFax(client.fax);

    // Business
    setProfileEin(client.dataSet === 'A01' ? '85-1930565' : '85-1930565');
    setProfileEntityType('');
    setProfileEntityDate('');
    setProfileFiscal('');
    setProfilePermit('');
    setProfileBusinessEffective('');
    setProfileBusinessExpiration('');

    // Admin & Malpractice
    setProfileNpSwitch(false);
    setProfilePaSwitch(false);
    setProfileResSwitch(false);
    setProfilePhysName('');
    setProfilePhysPhone('');
    setProfilePhysFax('');
    setProfileAdminName('');
    setProfileAdminPhone('');
    setProfileAdminFax('');

    setProfileMalLegalName('');
    setProfileMalCarrier('');
    setProfileMalPolicy('');
    setProfileMalEffective('');
    setProfileMalExpiration('');
    setProfileMalLimitOccur('');
    setProfileMalCarrierAgg('');

    if (setActiveTab) {
      setActiveTab('#client-profile');
    }
  };

  const handleBackToList = () => {
    if (selectedClient) {
      setClients(prev => prev.map(c => c.id === selectedClient.id ? {
        ...c,
        name: profileName,
        los: profileLos,
        start: profileStart,
        end: profileEnd,
        address: profileAddress2 ? `${profileAddress1}\n${profileAddress2}` : profileAddress1,
        city: profileCity,
        state: profileState,
        zip: profileZip,
        phone: profilePhone,
        fax: profileFax,
        active: profileActive ? 'Yes' : 'No'
      } : c));
    }
    setSelectedClient(null);
    if (setActiveTab) {
      setActiveTab('#client-management');
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Search & filter states
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterDataSet, setFilterDataSet] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterZip, setFilterZip] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterFax, setFilterFax] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [filterActive, setFilterActive] = useState('All');
  
  const [showFiltersRow, setShowFiltersRow] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter logic
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      // Global search matches any of the text fields
      const matchesGlobal = 
        globalSearch === '' ||
        c.dataSet.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.address.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.city.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.state.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.zip.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.phone.toLowerCase().includes(globalSearch.toLowerCase()) ||
        c.fax.toLowerCase().includes(globalSearch.toLowerCase()) ||
        formatDateDisplay(c.start).includes(globalSearch) ||
        formatDateDisplay(c.end).includes(globalSearch);

      const matchesDataSet = 
        filterDataSet === '' ||
        c.dataSet.toLowerCase().includes(filterDataSet.toLowerCase()) ||
        `los: ${c.los}`.toLowerCase().includes(filterDataSet.toLowerCase());

      const matchesName = 
        filterName === '' ||
        c.name.toLowerCase().includes(filterName.toLowerCase());

      const matchesAddress = 
        filterAddress === '' ||
        c.address.toLowerCase().includes(filterAddress.toLowerCase());

      const matchesCity = 
        filterCity === '' ||
        c.city.toLowerCase().includes(filterCity.toLowerCase());

      const matchesState = 
        filterState === '' ||
        c.state.toLowerCase().includes(filterState.toLowerCase());

      const matchesZip = 
        filterZip === '' ||
        c.zip.toLowerCase().includes(filterZip.toLowerCase());

      const matchesPhone = 
        filterPhone === '' ||
        c.phone.toLowerCase().includes(filterPhone.toLowerCase());

      const matchesFax = 
        filterFax === '' ||
        c.fax.toLowerCase().includes(filterFax.toLowerCase());

      const matchesStart = 
        filterStart === '' ||
        c.start.includes(filterStart); // matches YYYY-MM-DD input date

      const matchesEnd = 
        filterEnd === '' ||
        c.end.includes(filterEnd); // matches YYYY-MM-DD input date

      const matchesActive = 
        filterActive === 'All' ||
        c.active === filterActive;

      return (
        matchesGlobal &&
        matchesDataSet &&
        matchesName &&
        matchesAddress &&
        matchesCity &&
        matchesState &&
        matchesZip &&
        matchesPhone &&
        matchesFax &&
        matchesStart &&
        matchesEnd &&
        matchesActive
      );
    });
  }, [
    globalSearch,
    filterDataSet,
    filterName,
    filterAddress,
    filterCity,
    filterState,
    filterZip,
    filterPhone,
    filterFax,
    filterStart,
    filterEnd,
    filterActive,
    clients
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
    const headers = ['Data Set', 'LOS', 'Name', 'Address', 'City', 'State', 'Zip', 'Phone', 'Fax', 'Start', 'End', 'Active'];
    const rows = filteredClients.map(c => [
      `"${c.dataSet.replace(/"/g, '""')}"`,
      c.los,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      `"${c.city.replace(/"/g, '""')}"`,
      `"${c.state.replace(/"/g, '""')}"`,
      `"${c.zip.replace(/"/g, '""')}"`,
      `"${c.phone.replace(/"/g, '""')}"`,
      `"${c.fax.replace(/"/g, '""')}"`,
      `"${formatDateDisplay(c.start)}"`,
      `"${formatDateDisplay(c.end)}"`,
      `"${c.active}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "clients_management.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleClients = useMemo(() => {
    return filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredClients, page, rowsPerPage]);



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

  // Render Client Profile View if #client-profile route is active
  if (activeTab === '#client-profile' && selectedClient) {
    return (
      <Box key={`profile-${selectedClient.id}`} sx={{ pb: 5, animation: `${fadeInUp} 0.3s ease-in-out` }}>
        {/* Breadcrumbs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3.5, mt: -1 }}>
          <Typography 
            variant="body2" 
            onClick={handleBackToList}
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600, 
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontFamily: 'Poppins, sans-serif',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 600, mx: 0.5 }}>
            &gt;
          </Typography>
          <Typography variant="body2" sx={{ color: GREY[700], fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
            Client
          </Typography>
        </Box>

        {/* Hero Banner Card */}
        <Box sx={{ bgcolor: 'background.paper', px: 3, pb: 3.5, borderRadius: 2.5, overflow: 'hidden'}}>
          <Card 
            sx={{ 
              borderRadius: 0, 
              boxShadow: 'none', 
              mb: 2, 
              mx: -3,
              overflow: 'hidden',
              position: 'relative',
              border: `0px`,
              bgcolor: 'background.paper'
            }}
          >
            {/* Burgundy/Magenta gradient banner */}
            <Box 
              sx={{ 
                height: 80, 
                borderRadius: '8px 8px 0 0',
                // background: 'linear-gradient(135deg, #4D002E 0%, #80004E 50%, #B81A80 100%)',
                background: profileBG
                            ? `url(${profileBG}) no-repeat center center / cover`
                            : 'linear-gradient(135deg, #FF5B26 0%, #A90065 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
            </Box>

            {/* Banner bottom details (Avatar, Name, Tabs) */}
            <Box sx={{ px: 3, pb: 2.5, pt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, position: 'relative' }}>
              {/* Avatar & Name container */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Circular Avatar overlapping the banner */}
                <Box 
                  sx={{ 
                    width: 96, 
                    height: 96, 
                    borderRadius: '50%', 
                    bgcolor: '#E4A11B', // Secondary Orange Gold
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '28px',
                    fontFamily: 'Poppins, sans-serif',
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: theme.customShadows.z8,
                    position: 'absolute',
                    top: -50,
                    left: 24,
                    zIndex: 2
                  }}
                >
                  {selectedClient.dataSet}
                </Box>

                {/* Client Name */}
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary', 
                    ml: '140px', // Margin left to clear the absolute avatar
                    fontSize: '20px',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  {profileName}
                </Typography>
              </Box>

              {/* Profile Tabs */}
              <Box sx={{ display: 'flex', gap: 3.5, mr: 2 }}>
                <Box 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    color: 'primary.main', 
                    borderBottom: '3px solid',
                    borderColor: 'primary.main',
                    pb: 0.5,
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                >
                  Client
                </Box>
                <Box 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    color: GREY[700], 
                    pb: 0.5,
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Banks
                </Box>
                <Box 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    color: GREY[700], 
                    pb: 0.5,
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  Systems
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Client Information Card */}
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              boxShadow: '0px 0px 16px 0px #33333326',
              mb: 4,
              bgcolor: 'background.paper',
              animation: `${fadeInUp} 0.3s ease-in-out`
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, fontSize: '16px', color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
              Client Information
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <TextField
                required
                label="Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                sx={{ gridColumn: 'span 2' }}
              />

              <TextField
                required
                type="number"
                label="Location of Service"
                value={profileLos}
                onChange={(e) => setProfileLos(Number(e.target.value))}
              />

              <TextField
                label="NPI"
                value={profileNpi}
                onChange={(e) => setProfileNpi(e.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="Start Date"
                  value={profileStart ? dayjs(profileStart) : null}
                  onChange={(newValue) => setProfileStart(newValue ? newValue.format('YYYY-MM-DD') : '')}
                  slotProps={{
                    textField: { 
                      className: 'large-input'
                    }
                  }}
                />

                <MobileDatePicker
                  label="End Date"
                  value={profileEnd ? dayjs(profileEnd) : null}
                  onChange={(newValue) => setProfileEnd(newValue ? newValue.format('YYYY-MM-DD') : '')}
                  slotProps={{
                    textField: { 
                      className: 'large-input'
                    }
                  }}
                />
              </LocalizationProvider>

              <Box sx={{ gridColumn: 'span 2', display: 'flex', gap: 4, mt: 1, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch 
                    checked={profileCredNecessary} 
                    onChange={(e) => setProfileCredNecessary(e.target.checked)}
                    color="primary"
                    sx={switchStyles}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400, ml: 0.5, color: GREY[700], fontFamily: 'Poppins, sans-serif' }}>
                    Credential Necessary
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch 
                    checked={profileCredVerification} 
                    onChange={(e) => setProfileCredVerification(e.target.checked)}
                    color="primary"
                    sx={switchStyles}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400, ml: 0.5, color: GREY[700], fontFamily: 'Poppins, sans-serif' }}>
                    Credential Verification
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch 
                    checked={profileActive} 
                    onChange={(e) => setProfileActive(e.target.checked)}
                    color="primary"
                    sx={switchStyles}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400, ml: 0.5, color: GREY[700], fontFamily: 'Poppins, sans-serif' }}>
                    Active
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
            {/* Contact Card */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                boxShadow: '0px 0px 16px 0px #33333326',
                bgcolor: 'background.paper',
                animation: `${fadeInUp} 0.3s ease-in-out`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, fontSize: '16px', color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                Contact
              </Typography>

              {/* Contact Sub-tabs */}
              <Box sx={{ display: 'flex', gap: 2.5, pb: 1, mb: 3.5, overflowX: 'auto' }}>
                {['Primary', 'Facility', 'Billing', 'Bank', 'Collection Agency', 'Insurance Agency'].map((tab) => {
                  const isSelected = profileContactTab === tab;
                  return (
                    <Typography
                      key={tab}
                      onClick={() => setProfileContactTab(tab)}
                      sx={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        cursor: 'pointer',
                        pb: 0.5,
                        borderBottom: isSelected ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Poppins, sans-serif',
                        '&:hover': { color: 'primary.main' }
                      }}
                    >
                      {tab}
                    </Typography>
                  );
                })}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                <TextField
                  label="Address 1"
                  value={profileAddress1}
                  onChange={(e) => setProfileAddress1(e.target.value)}
                />

                <TextField
                  label="Address 2"
                  value={profileAddress2}
                  onChange={(e) => setProfileAddress2(e.target.value)}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: 2 }}>
                  <TextField
                    label="City"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                  />
                  <TextField
                    label="State"
                    value={profileState}
                    onChange={(e) => setProfileState(e.target.value)}
                  />
                  <TextField
                    label="Zip"
                    value={profileZip}
                    onChange={(e) => setProfileZip(e.target.value)}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Phone"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                  />
                  <TextField
                    label="Fax"
                    value={profileFax}
                    onChange={(e) => setProfileFax(e.target.value)}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Business Card */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                boxShadow: '0px 0px 16px 0px #33333326',
                bgcolor: 'background.paper',
                animation: `${fadeInUp} 0.3s ease-in-out`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, fontSize: '16px', color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                Business
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                <TextField
                  label="EIN"
                  value={profileEin}
                  onChange={(e) => setProfileEin(e.target.value)}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Entity Type"
                    value={profileEntityType}
                    onChange={(e) => setProfileEntityType(e.target.value)}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Entity Date"
                      value={profileEntityDate ? dayjs(profileEntityDate) : null}
                      onChange={(newValue) => setProfileEntityDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
                      slotProps={{
                        textField: { 
                          className: 'large-input'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Fiscal"
                    value={profileFiscal}
                    onChange={(e) => setProfileFiscal(e.target.value)}
                  />
                  <TextField
                    label="Permit#"
                    value={profilePermit}
                    onChange={(e) => setProfilePermit(e.target.value)}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Effective"
                      value={profileBusinessEffective ? dayjs(profileBusinessEffective) : null}
                      onChange={(newValue) => setProfileBusinessEffective(newValue ? newValue.format('YYYY-MM-DD') : '')}
                      slotProps={{
                        textField: { 
                          className: 'large-input'
                        }
                      }}
                    />
                    <MobileDatePicker
                      label="Expiration"
                      value={profileBusinessExpiration ? dayjs(profileBusinessExpiration) : null}
                      onChange={(newValue) => setProfileBusinessExpiration(newValue ? newValue.format('YYYY-MM-DD') : '')}
                      slotProps={{
                        textField: { 
                          className: 'large-input'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* Administration Card */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                boxShadow: '0px 0px 16px 0px #33333326',
                bgcolor: 'background.paper',
                animation: `${fadeInUp} 0.3s ease-in-out`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, fontSize: '16px', color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                Administration
              </Typography>

              <Box sx={{ display: 'flex', columnGap: 3, mb: 3.5, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch 
                    checked={profileNpSwitch} 
                    onChange={(e) => setProfileNpSwitch(e.target.checked)}
                    color="primary"
                    sx={switchStyles}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400, ml: 0.5, color: GREY[700], fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                    Nurse Practitioners
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch 
                    checked={profilePaSwitch} 
                    onChange={(e) => setProfilePaSwitch(e.target.checked)}
                    color="primary"
                    sx={switchStyles}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400, ml: 0.5, color: GREY[700], fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                    Physician Assistants
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch 
                    checked={profileResSwitch} 
                    onChange={(e) => setProfileResSwitch(e.target.checked)}
                    color="primary"
                    sx={switchStyles}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 400, ml: 0.5, color: GREY[700], fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
                    Residents/Fellows
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                {/* Physician Sub-block */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, fontSize: '13px', color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                    Physician
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
                    <TextField
                      label="Name"
                      value={profilePhysName}
                      onChange={(e) => setProfilePhysName(e.target.value)}
                    />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Phone"
                        value={profilePhysPhone}
                        onChange={(e) => setProfilePhysPhone(e.target.value)}
                      />
                      <TextField
                        label="Fax"
                        value={profilePhysFax}
                        onChange={(e) => setProfilePhysFax(e.target.value)}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Administrator Sub-block */}
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, fontSize: '13px', color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                    Administrator
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2.5 }}>
                    <TextField
                      label="Name"
                      value={profileAdminName}
                      onChange={(e) => setProfileAdminName(e.target.value)}
                    />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="Phone"
                        value={profileAdminPhone}
                        onChange={(e) => setProfileAdminPhone(e.target.value)}
                      />
                      <TextField
                        label="Fax"
                        value={profileAdminFax}
                        onChange={(e) => setProfileAdminFax(e.target.value)}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Malpractice Card */}
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                boxShadow: '0px 0px 16px 0px #33333326',
                bgcolor: 'background.paper',
                animation: `${fadeInUp} 0.3s ease-in-out`
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2.5, fontSize: '16px', color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                Malpractice
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
                <TextField
                  label="Legal Name"
                  value={profileMalLegalName}
                  onChange={(e) => setProfileMalLegalName(e.target.value)}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Carrier"
                    value={profileMalCarrier}
                    onChange={(e) => setProfileMalCarrier(e.target.value)}
                  />
                  <TextField
                    label="Policy #"
                    value={profileMalPolicy}
                    onChange={(e) => setProfileMalPolicy(e.target.value)}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      label="Effective"
                      value={profileMalEffective ? dayjs(profileMalEffective) : null}
                      onChange={(newValue) => setProfileMalEffective(newValue ? newValue.format('YYYY-MM-DD') : '')}
                      slotProps={{
                        textField: {
                          className: 'large-input'
                        }
                      }}
                    />
                    <MobileDatePicker
                      label="Expiration"
                      value={profileMalExpiration ? dayjs(profileMalExpiration) : null}
                      onChange={(newValue) => setProfileMalExpiration(newValue ? newValue.format('YYYY-MM-DD') : '')}
                      slotProps={{
                        textField: {
                          className: 'large-input'
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <TextField
                  label="Limit Occurrence"
                  value={profileMalLimitOccur}
                  onChange={(e) => setProfileMalLimitOccur(e.target.value)}
                />

                <TextField
                  label="Carrier Aggregate"
                  value={profileMalCarrierAgg}
                  onChange={(e) => setProfileMalCarrierAgg(e.target.value)}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    );
  }

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
                startIcon={<Plus size={16} />}
                onClick={handleOpenModal}
            >
                Add Client
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
            <Table sx={{ minWidth: 1500 }} aria-label="clients management table">
                <TableHead>
                    {/* Header Columns */}
                    <TableRow>
                      <TableCell sx={{ px: 1, width: 80 }}>Data Set</TableCell>
                      <TableCell sx={{ px: 1, width: 200 }}>Name</TableCell>
                      <TableCell sx={{ px: 1, width: 200 }}>Address</TableCell>
                      <TableCell sx={{ px: 1, width: 140 }}>City</TableCell>
                      <TableCell sx={{ px: 1, width: 70 }}>State</TableCell>
                      <TableCell sx={{ px: 1, width: 110 }}>Zip</TableCell>
                      <TableCell sx={{ px: 1, width: 120 }}>Phone</TableCell>
                      <TableCell sx={{ px: 1, width: 110 }}>Fax</TableCell>
                      <TableCell sx={{ px: 1, width: 110 }}>Start</TableCell>
                      <TableCell sx={{ px: 1, width: 110 }}>End</TableCell>
                      <TableCell sx={{ px: 1, width: 100 }}>Active</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                  {/* Contains Filter Input Row */}
                    {showFiltersRow && (
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

                        {/* Address Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterAddress}
                              onChange={(e) => {
                                setFilterAddress(e.target.value);
                                setPage(0);
                              }}
                              fullWidth
                          />
                        </TableCell>

                        {/* City Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterCity}
                              onChange={(e) => {
                                setFilterCity(e.target.value);
                                setPage(0);
                              }}
                              fullWidth
                          />
                        </TableCell>

                        {/* State Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterState}
                              onChange={(e) => {
                                setFilterState(e.target.value);
                                setPage(0);
                              }}
                              fullWidth
                          />
                        </TableCell>

                        {/* Zip Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterZip}
                              onChange={(e) => {
                                setFilterZip(e.target.value);
                                setPage(0);
                              }}
                              fullWidth
                          />
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

                        {/* Fax Filter */}
                        <TableCell sx={{ p: 1.5 }}>
                          <TextField
                              size="small"
                              label="Contains"
                              value={filterFax}
                              onChange={(e) => {
                                setFilterFax(e.target.value);
                                setPage(0);
                              }}
                              fullWidth
                          />
                        </TableCell>

                        {/* Start Date Filter (DatePicker) */}
                        <TableCell sx={{ p: 1.5, fontSize: '12px' }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              label="Is"
                              value={filterStart ? dayjs(filterStart) : null}
                              onChange={(newValue) => {
                                setFilterStart(newValue ? newValue.format('YYYY-MM-DD') : '');
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

                        {/* End Date Filter (DatePicker) */}
                        <TableCell sx={{ p: 1.5, fontSize: '12px' }}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                              label="Is"
                              value={filterEnd ? dayjs(filterEnd) : null}
                              onChange={(newValue) => {
                                setFilterEnd(newValue ? newValue.format('YYYY-MM-DD') : '');
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
                    </TableRow>
                    )}
                    {visibleClients.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={11} align="center" sx={{ py: 6, color: GREY[700] }}>
                          No clients found matching your criteria.
                        </TableCell>
                    </TableRow>
                    ) : (
                    visibleClients.map((row, index) => {
                        const isCream = index % 2 === 0;
                        const rowBg = theme.palette.mode === 'light' 
                        ? (isCream ? '#FEF4E4' : '#FFFFFF') // Alternating cream row background matching Users Management
                        : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');

                        return (
                        <TableRow 
                            key={row.id}
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
                            {/* Data Set Cell */}
                            <TableCell>
                              <Box 
                                className="dataset-link"
                                onClick={() => handleSelectClient(row)}
                                sx={{ 
                                  fontWeight: 600, 
                                  color: '#737373', 
                                  textDecoration: 'underline', 
                                  cursor: 'pointer',
                                  display: 'inline-block',
                                  transition: 'color 0.2s, text-decoration 0.2s'
                                }}
                              >
                                {row.dataSet}
                              </Box>
                              <Box sx={{ fontSize: '11px', color: GREY[700], fontWeight: 500, mt: 0.5 }}>LOS: {row.los}</Box>
                            </TableCell>

                            {/* Name Cell */}
                            <TableCell>
                              {row.name}
                            </TableCell>

                            {/* Address Cell (Highlight 901 Lakeshore Drive in pink) */}
                            <TableCell>
                              {row.address}
                            </TableCell>

                            {/* City Cell */}
                            <TableCell>
                              {row.city}
                            </TableCell>

                            {/* State Cell */}
                            <TableCell>
                              {row.state}
                            </TableCell>

                            {/* Zip Cell */}
                            <TableCell>
                              {row.zip}
                            </TableCell>

                            {/* Phone Cell */}
                            <TableCell>
                              {row.phone}
                            </TableCell>

                            {/* Fax Cell */}
                            <TableCell>
                              {row.fax}
                            </TableCell>

                            {/* Start Date Cell */}
                            <TableCell>
                              {formatDateDisplay(row.start)}
                            </TableCell>

                            {/* End Date Cell */}
                            <TableCell>
                              {formatDateDisplay(row.end)}
                            </TableCell>

                            {/* Active Cell */}
                            <TableCell>
                              {row.active}
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
                justifyContent: 'flex-end', 
                alignItems: 'center', 
                px: 2.5,
                py: 1,
              }}
            >
              {/* Pagination (Right Aligned) */}
              <TablePagination
                rowsPerPageOptions={[5, 10, 20]}
                component="div"
                count={filteredClients.length}
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

        {/* Create Client Dialog Form */}
        <AddClient 
          open={isModalOpen}
          onClose={handleCloseModal}
          onAddClient={(newClient) => setClients(prev => [newClient, ...prev])}
        />
    </Box>
  );
}
