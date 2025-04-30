import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  Chip,
  Switch,
  Snackbar,
  Alert,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers, updateUserRole, toggleUserStatus, createUser, deleteUser } from './usersSlice';
import { useEffect, useState } from 'react';
import { Role, User } from '../../types';
import RoleEditDialog from './RoleEditDialog';
import UserForm from './UserForm';

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, status, error } = useAppSelector((state) => state.users);
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      setSnackbar({
        open: true,
        message: 'User role updated successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update user role',
        severity: 'error',
      });
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      await dispatch(toggleUserStatus(userId)).unwrap();
      setSnackbar({
        open: true,
        message: 'User status updated successfully',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update user status',
        severity: 'error',
      });
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id' | 'disabled'>) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      setSnackbar({
        open: true,
        message: 'User created successfully',
        severity: 'success',
      });
      setCreateDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to create user',
        severity: 'error',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.id)).unwrap();
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to delete user',
          severity: 'error',
        });
      }
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (status === 'loading') {
    return <Typography>Loading users...</Typography>;
  }

  if (status === 'failed') {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                    {user.name}
                    {user.id === currentUser?.id && (
                      <Chip label="You" size="small" color="primary" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.id === currentUser?.id ? (
                    <Chip label={user.role} color="primary" />
                  ) : (
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={!user.disabled}
                    onChange={() => handleStatusToggle(user.id)}
                    color="success"
                    disabled={user.id === currentUser?.id}
                  />
                  <Chip
                    label={user.disabled ? 'Disabled' : 'Active'}
                    color={user.disabled ? 'default' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenEditDialog(user)}
                    disabled={user.id === currentUser?.id}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(user)}
                    disabled={user.id === currentUser?.id}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedUser && (
        <RoleEditDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          user={selectedUser}
          onRoleChange={handleRoleChange}
        />
      )}

      <UserForm
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateUser}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userToDelete && `Are you sure you want to permanently delete ${userToDelete.name} (${userToDelete.email})?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;