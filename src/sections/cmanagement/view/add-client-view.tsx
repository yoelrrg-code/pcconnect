import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import type { Client } from './client-management-view';

interface AddClientProps {
  open: boolean;
  onClose: () => void;
  onAddClient: (newClient: Client) => void;
}

export function AddClient({ open, onClose, onAddClient }: AddClientProps) {
    const theme = useTheme();

    // Modal states for creating a new client
    const [newDataSet, setNewDataSet] = useState('');
    const [newLos, setNewLos] = useState<number>(1);
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newStateVal, setNewStateVal] = useState('');
    const [newZip, setNewZip] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newFax, setNewFax] = useState('');
    const [newStart, setNewStart] = useState<string>('');
    const [newEnd, setNewEnd] = useState<string>('');
    const [newActive, setNewActive] = useState<'Yes' | 'No'>('Yes');

    const handleCloseModal = () => {
        onClose();
        // Reset fields when closing
        setNewDataSet('');
        setNewLos(1);
        setNewName('');
        setNewAddress('');
        setNewCity('');
        setNewStateVal('');
        setNewZip('');
        setNewPhone('');
        setNewFax('');
        setNewStart('');
        setNewEnd('');
        setNewActive('Yes');
    };

    const handleAddClient = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!newDataSet || !newName || !newAddress || !newCity || !newStateVal || !newZip || !newStart) return;

        const newClient: Client = {
            id: String(Date.now()),
            dataSet: newDataSet,
            los: newLos,
            name: newName,
            address: newAddress,
            city: newCity,
            state: newStateVal,
            zip: newZip,
            phone: newPhone,
            fax: newFax,
            start: newStart,
            end: newEnd,
            active: newActive,
        };

        onAddClient(newClient);
        handleCloseModal();
    };

    return (
        <Dialog 
          open={open} 
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              component: 'form',
              onSubmit: handleAddClient,
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
              Add Client
            </Typography>
          </DialogTitle>

          <DialogContent sx={{bgcolor: theme.palette.background.default }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, pt: 5, pb: 3, px: 4.5 }}>
              <TextField
                required
                label="Data Set"
                placeholder="e.g. A08"
                value={newDataSet}
                onChange={(e) => setNewDataSet(e.target.value)}
              />

              <TextField
                required
                type="number"
                label="LOS"
                placeholder="e.g. 1"
                value={newLos}
                onChange={(e) => setNewLos(Number(e.target.value))}
              />

              <TextField
                required
                label="Client Name"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                sx={{ gridColumn: { sm: 'span 2' } }}
              />

              <TextField
                required
                label="Address"
                placeholder="Address line"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                sx={{ gridColumn: { sm: 'span 2' } }}
              />

              <TextField
                required
                label="City"
                placeholder="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />

              <TextField
                required
                label="State"
                placeholder="State (e.g. MI)"
                value={newStateVal}
                onChange={(e) => setNewStateVal(e.target.value)}
              />

              <TextField
                required
                label="Zip"
                placeholder="Zip code"
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
              />

              <TextField
                label="Phone"
                placeholder="Phone number"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />

              <TextField
                label="Fax"
                placeholder="Fax number"
                value={newFax}
                onChange={(e) => setNewFax(e.target.value)}
              />

              <TextField
                select
                label="Active"
                value={newActive}
                onChange={(e) => setNewActive(e.target.value as 'Yes' | 'No')}
                slotProps={{ select: { native: true } }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>

              {/* Start Date Input */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="Start Date"
                  value={newStart ? dayjs(newStart) : null}
                  onChange={(newValue) => {
                    setNewStart(newValue ? newValue.format('YYYY-MM-DD') : '');
                  }}
                  slotProps={{
                    textField: { 
                      required: true, 
                      className: 'large-input'
                    }
                  }}
                />
              </LocalizationProvider>

              {/* End Date Input */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="End Date"
                  value={newEnd ? dayjs(newEnd) : null}
                  onChange={(newValue) => {
                    setNewEnd(newValue ? newValue.format('YYYY-MM-DD') : '');
                  }}
                  slotProps={{
                    textField: { 
                      className: 'large-input'
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 7, pb: 5, gap: 1.5, bgcolor: theme.palette.background.default }}>
            <Button 
              variant="modalCancel"
              color="inherit" 
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="modalAdd" 
              color="primary" 
              disabled={!newDataSet || !newName || !newAddress || !newCity || !newStateVal || !newZip || !newStart}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>      
    );
};