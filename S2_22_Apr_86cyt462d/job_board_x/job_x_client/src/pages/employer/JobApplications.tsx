import React, { useEffect, useState } from 'react';
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
  Chip,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Link,
  Divider,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import { 
  MoreVertical, 
  ExternalLink, 
  Download,
  Mail,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import useJobs from '../../hooks/useJobs';
import useApplications from '../../hooks/useApplications';
import PageContainer from '../../components/layout/PageContainer';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import AlertMessage from '../../components/common/AlertMessage';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/dateUtils';

// Status colors mapping
const statusColors: Record<string, any> = {
  pending: 'default',
  reviewed: 'info',
  interviewed: 'secondary',
  rejected: 'error',
  accepted: 'success',
};

// Status labels mapping
const statusLabels: Record<string, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  interviewed: 'Interviewed',
  rejected: 'Rejected',
  accepted: 'Accepted',
};

const JobApplications: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { job, loading: jobLoading, error: jobError, getJobById } = useJobs();
  const { 
    jobApplications, 
    loading: applicationsLoading, 
    error: applicationsError, 
    getJobApplications,
    updateApplicationStatus,
    success,
  } = useApplications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const loading = jobLoading || applicationsLoading;

  // Fetch job and applications on component mount
  useEffect(() => {
    if (id) {
      getJobById(id);
      getJobApplications(id);
    }
  }, [id]);

  // Refresh applications after status update
  useEffect(() => {
    if (success && id) {
      getJobApplications(id);
    }
  }, [success]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, applicationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedApplication(applicationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusClick = () => {
    handleMenuClose();
    
    // Find the current application to pre-populate the dialog
    const application = jobApplications.find(app => app._id === selectedApplication);
    if (application) {
      setNewStatus(application.status);
      setNotes(application.notes || '');
      setStatusDialogOpen(true);
    }
  };

  const handleDetailsClick = () => {
    handleMenuClose();
    setDetailsDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedApplication) {
      setUpdateLoading(true);
      await updateApplicationStatus(selectedApplication, {
        status: newStatus as any,
        notes,
      });
      setUpdateLoading(false);
      setStatusDialogOpen(false);
    }
  };

  if (loading && !updateLoading) {
    return <LoadingSpinner fullPage message="Loading applications..." />;
  }

  if (jobError || applicationsError) {
    return (
      <PageContainer title="Applications">
        <AlertMessage severity="error" message={jobError || applicationsError || 'An error occurred'} />
      </PageContainer>
    );
  }

  if (!job) {
    return (
      <PageContainer title="Job Not Found">
        <Typography variant="body1" paragraph>
          The job you're looking for could not be found or you don't have permission to view it.
        </Typography>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/employer/jobs"
        >
          Back to My Jobs
        </Button>
      </PageContainer>
    );
  }

  const selectedApplicationData = jobApplications.find(app => app._id === selectedApplication);

  return (
    <PageContainer
      title={`Applications for ${job.title}`}
      subtitle={`${jobApplications.length} candidate${jobApplications.length !== 1 ? 's' : ''} applied`}
      breadcrumbs={[
        { label: 'Dashboard', path: '/employer/dashboard' },
        { label: 'My Jobs', path: '/employer/jobs' },
        { label: 'Applications' },
      ]}
    >
      {jobApplications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="There are no applications for this job posting yet. Check back later."
          icon={<FileText size={64} />}
          actionText="View Job Details"
          actionPath={`/jobs/${id}`}
        />
      ) : isMobile ? (
        // Mobile view - cards
        <Grid container spacing={2}>
          {jobApplications.map((application) => (
            <Grid item xs={12} key={application._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {application.jobSeeker.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {application.jobSeeker.email}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={2}>
                    <Chip
                      label={statusLabels[application.status]}
                      color={statusColors[application.status]}
                      size="small"
                    />
                    
                    <Typography variant="caption" color="text.secondary">
                      Applied on {formatDate(new Date(application.createdAt))}
                    </Typography>
                  </Box>
                  
                  {application.notes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Notes:</strong> {application.notes}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ExternalLink size={16} />}
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </Button>
                  
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedApplication(application._id);
                      setDetailsDialogOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                      setSelectedApplication(application._id);
                      setNewStatus(application.status);
                      setNotes(application.notes || '');
                      setStatusDialogOpen(true);
                    }}
                  >
                    Update Status
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Desktop view - table
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobApplications.map((application) => (
                <TableRow key={application._id} hover>
                  <TableCell component="th" scope="row">
                    <Typography variant="body1" fontWeight="medium">
                      {application.jobSeeker.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{application.jobSeeker.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[application.status]}
                      color={statusColors[application.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(new Date(application.createdAt))}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="View Resume">
                        <IconButton
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                        >
                          <ExternalLink size={18} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Send Email">
                        <IconButton
                          href={`mailto:${application.jobSeeker.email}`}
                          size="small"
                        >
                          <Mail size={18} />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="More Options">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, application._id)}
                          size="small"
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
      >
        <MenuItem onClick={handleDetailsClick}>
          <FileText size={18} style={{ marginRight: '8px' }} />
          View Application Details
        </MenuItem>
        <MenuItem onClick={handleStatusClick}>
          <Clock size={18} style={{ marginRight: '8px' }} />
          Update Status
        </MenuItem>
      </Menu>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
              <MenuItem value="interviewed">Interviewed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            margin="normal"
            id="notes"
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this candidate..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Application Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedApplicationData && (
          <>
            <DialogTitle>
              <Typography variant="h6">Application Details</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {job.title} - {selectedApplicationData.jobSeeker.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>Applicant Information</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedApplicationData.jobSeeker.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedApplicationData.jobSeeker.email}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mt={2} mb={1}>
                    <Calendar size={16} style={{ marginRight: 8 }} />
                    <Typography variant="body2" color="text.secondary">
                      Applied on {formatDate(new Date(selectedApplicationData.createdAt))}
                    </Typography>
                  </Box>
                  
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ExternalLink size={16} />}
                      href={selectedApplicationData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </Button>
                  </Box>
                  
                  <Box mt={3}>
                    <Typography variant="subtitle2" gutterBottom>Status</Typography>
                    <Chip
                      label={statusLabels[selectedApplicationData.status]}
                      color={statusColors[selectedApplicationData.status]}
                    />
                    
                    {selectedApplicationData.notes && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                        <Typography variant="body2">
                          {selectedApplicationData.notes}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>Cover Letter</Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'background.default',
                      height: '100%',
                      minHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {selectedApplicationData.coverLetter}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  setDetailsDialogOpen(false);
                  setNewStatus(selectedApplicationData.status);
                  setNotes(selectedApplicationData.notes || '');
                  setStatusDialogOpen(true);
                }}
              >
                Update Status
              </Button>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageContainer>
  );
};

export default JobApplications;