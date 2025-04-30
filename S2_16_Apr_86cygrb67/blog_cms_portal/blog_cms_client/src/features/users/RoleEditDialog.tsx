import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Avatar,
    Typography,
  } from '@mui/material';
  import { User, Role } from '../../types';
import { useState } from 'react';
  
  interface RoleEditDialogProps {
    open: boolean;
    onClose: () => void;
    user: User;
    onRoleChange: (userId: string, role: Role) => void;
  }
  
  const RoleEditDialog = ({ open, onClose, user, onRoleChange }: RoleEditDialogProps) => {
    const [role, setRole] = useState<Role>(user.role);
  
    const handleRoleChange = () => {
      onRoleChange(user.id, role);
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar src={user.avatar} sx={{ width: 56, height: 56 }} />
            <Box>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <FormControl fullWidth>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
            </Select>
          </FormControl>
          <DialogContentText sx={{ mt: 2 }}>
            Admins have full access to all features. Editors can manage content but not users.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleRoleChange} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default RoleEditDialog;