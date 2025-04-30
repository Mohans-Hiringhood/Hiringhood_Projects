import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Plus,
  Briefcase,
  AlertTriangle
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import useJobs from '../../hooks/useJobs';
import PageContainer from '../../components/layout/PageContainer';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import AlertMessage from '../../components/common/AlertMessage';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate, formatDistanceToNow } from '../../utils/dateUtils';

const EmployerJobs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { 
    employerJobs, 
    loading, 
    error, 
    deleteJob, 
    getEmployerJobs,
    success
  } = useJobs();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    getEmployerJobs();
  }, []);

  // Refresh after successful deletion
  useEffect(() => {
    if (success) {
      getEmployerJobs();
    }
  }, [success]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, jobId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedJobId(jobId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedJobId) {
      setDeleteLoading(true);
      await deleteJob(selectedJobId);
      setDeleteLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
  };

  if (loading && !deleteLoading) {
    return <LoadingSpinner fullPage message="Loading your jobs..." />;
  }

  if (error) {
    return (
      <PageContainer title="My Jobs">
        <AlertMessage severity="error" message={error} />
      </PageContainer>
    );
  }

  if (employerJobs.length === 0) {
    return (
      <PageContainer title="My Jobs">
        <EmptyState
          title="No jobs posted yet"
          description="Start attracting top talent by posting your first job"
          actionText="Post a Job"
          actionPath="/employer/post-job"
          icon={<Briefcase size={64} />}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer 
      title="Manage Your Job Postings" 
      subtitle="View, edit, and manage all your job listings"
    >
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          component={RouterLink}
          to="/employer/post-job"
        >
          Post New Job
        </Button>
      </Box>

      {/* Mobile view - cards */}
      {isMobile ? (
        <Grid container spacing={2}>
          {employerJobs.map((job) => (
            <Grid item xs={12} key={job._id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="h3" gutterBottom>
                      {job.title}
                    </Typography>
                    <Chip
                      label={job.isActive ? "Active" : "Inactive"}
                      color={job.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {job.location} • {job.type}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mt={1} mb={2}>
                    <Users size={16} style={{ marginRight: 8 }} />
                    <Typography variant="body2">
                      {job.applicationsCount} Applications
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" display="block">
                    Posted {formatDistanceToNow(new Date(job.createdAt))} ago
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Eye size={16} />}
                    component={RouterLink}
                    to={`/jobs/${job._id}`}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit size={16} />}
                    component={RouterLink}
                    to={`/employer/jobs/${job._id}/edit`}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Users size={16} />}
                    component={RouterLink}
                    to={`/employer/jobs/${job._id}/applications`}
                  >
                    Applications
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Trash2 size={16} />}
                    onClick={() => {
                      setSelectedJobId(job._id);
                      setConfirmDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Desktop view - table */
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Applications</TableCell>
                <TableCell>Posted Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employerJobs.map((job) => (
                <TableRow key={job._id} hover>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1" fontWeight="medium">
                      {job.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Users size={16} style={{ marginRight: 8 }} />
                      {job.applicationsCount}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={formatDate(new Date(job.createdAt))}>
                      <Typography variant="body2">
                        {formatDistanceToNow(new Date(job.createdAt))} ago
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={job.isActive ? "Active" : "Inactive"}
                      color={job.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="View Job">
                        <IconButton
                          component={RouterLink}
                          to={`/jobs/${job._id}`}
                          size="small"
                        >
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="View Applications">
                        <IconButton
                          component={RouterLink}
                          to={`/employer/jobs/${job._id}/applications`}
                          size="small"
                          color="primary"
                        >
                          <Users size={18} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Edit Job">
                        <IconButton
                          component={RouterLink}
                          to={`/employer/jobs/${job._id}/edit`}
                          size="small"
                          color="secondary"
                        >
                          <Edit size={18} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="More Options">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, job._id)}
                        >
                          <MoreVertical size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          component={RouterLink}
          to={selectedJobId ? `/employer/jobs/${selectedJobId}/edit` : '#'}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <Edit size={18} />
          </ListItemIcon>
          <ListItemText>Edit Job</ListItemText>
        </MenuItem>
        
        <MenuItem
          component={RouterLink}
          to={selectedJobId ? `/employer/jobs/${selectedJobId}/applications` : '#'}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <Users size={18} />
          </ListItemIcon>
          <ListItemText>View Applications</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <Trash2 size={18} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText primary="Delete Job" primaryTypographyProps={{ color: 'error' }} />
        </MenuItem>
      </Menu>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialogOpen}
        title="Delete Job"
        message={
          <Typography variant="body1">
            Are you sure you want to delete this job posting? This action cannot be undone.
            All applications for this job will also be deleted.
          </Typography>
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleteLoading}
        icon={<AlertTriangle size={24} color={theme.palette.error.main} />}
      />
    </PageContainer>
  );
};

export default EmployerJobs;