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
import type { User } from './users-management-view';

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (newUser: User) => void;
}

export function AddUser({open, onClose, onAddUser}: AddUserProps) {

    const theme = useTheme();

    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('User');
    const [newTitle, setNewTitle] = useState('');
    const [newAllowPrint, setNewAllowPrint] = useState<'Yes' | 'No'>('Yes');
    const [newFrequency, setNewFrequency] = useState<'Never' | 'Weekly' | 'Monthly' | 'Daily'>('Never');
    const [newActive, setNewActive] = useState<'Yes' | 'No'>('Yes');
    const [prevOpen, setPrevOpen] = useState(open);

    if (open !== prevOpen) {
      setPrevOpen(open);
      if (open) {
        setNewFirstName('');
        setNewLastName('');
        setNewEmail('');
        setNewRole('User');
        setNewTitle('');
        setNewAllowPrint('Yes');
        setNewFrequency('Never');
        setNewActive('Yes');
      }
    }
    
      const handleAddUser = (e: React.SyntheticEvent) => {
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
    
        onAddUser(newUser);
        onClose();
      };

    return (
        <Dialog 
          open={open} 
          onClose={onClose}
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, rowGap: 4, columnGap: 3, pt: 5, pb: 3, px: 4.5 }}>
              <TextField
                required
                label="First Name"
                placeholder="First name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />

              <TextField
                required
                label="Last Name"
                placeholder="Last name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />

              <TextField
                required
                type="email"
                label="Email Address"
                placeholder="Email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                sx={{ gridColumn: { sm: 'span 2' } }}
              />

              <TextField
                select
                label="Role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                slotProps={{ select: { native: true } }}
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
              />

              <TextField
                select
                label="Allow Print"
                value={newAllowPrint}
                onChange={(e) => setNewAllowPrint(e.target.value as 'Yes' | 'No')}
                slotProps={{ select: { native: true } }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>

              <TextField
                select
                label="Frequency"
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value as User['frequency'])}
                slotProps={{ select: { native: true } }}
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
                slotProps={{ select: { native: true } }}
                sx={{ gridColumn: { sm: 'span 2' } }}
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
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="modalAdd" 
                disabled={!newFirstName || !newLastName || !newEmail}
              >
                Add
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
    );
}