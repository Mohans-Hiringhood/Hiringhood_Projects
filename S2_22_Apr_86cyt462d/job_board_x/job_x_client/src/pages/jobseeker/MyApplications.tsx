import React, { useEffect } from 'react';
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
  Grid,
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme,
  Tooltip,
  Link,
  IconButton,
} from '@mui/material';
import { 
  ExternalLink, 
  Briefcase, 
  Building2, 
  MapPin,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
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

const MyApplications: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { applications, loading, error, getMyApplications } = useApplications();

  // Fetch applications on component mount
  useEffect(() => {
    getMyApplications();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading your applications..." />;
  }

  if (error) {
    return (
      <PageContainer title="My Applications">
        <AlertMessage severity="error" message={error} />
      </PageContainer>
    );
  }

  if (applications.length === 0) {
    return (
      <PageContainer title="My Applications">
        <EmptyState
          title="No applications yet"
          description="You haven't applied to any jobs yet. Start exploring opportunities and submit your first application."
          actionText="Browse Jobs"
          actionPath="/jobs"
          icon={<Briefcase size={64} />}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="My Applications"
      subtitle="Track the status of your job applications"
    >
      {isMobile ? (
        // Mobile view - cards
        <Grid container spacing={2}>
          {applications.map((application) => (
            <Grid item xs={12} key={application._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {application.job.title}
                  </Typography>
                  
                  <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                    <Box display="flex" alignItems="center" component="span">
                      <Building2 size={16} style={{ marginRight: '4px' }} color="#6b7280" />
                      <Typography variant="body2" color="text.secondary">
                        {application.job.company}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" component="span">
                      <MapPin size={16} style={{ marginRight: '4px' }} color="#6b7280" />
                      <Typography variant="body2" color="text.secondary">
                        {application.job.location}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={1}>
                    <Chip
                      label={statusLabels[application.status]}
                      color={statusColors[application.status]}
                      size="small"
                    />
                    
                    <Typography variant="caption" color="text.secondary">
                      Applied on {formatDate(new Date(application.createdAt))}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Briefcase size={16} />}
                    component={RouterLink}
                    to={`/jobs/${application.job._id}`}
                  >
                    View Job
                  </Button>
                  
                  <Button
                    size="small"
                    startIcon={<ExternalLink size={16} />}
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
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
                <TableCell>Job Title</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Applied On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id} hover>
                  <TableCell component="th" scope="row">
                    <Link
                      component={RouterLink}
                      to={`/jobs/${application.job._id}`}
                      underline="hover"
                      color="inherit"
                      fontWeight="medium"
                    >
                      {application.job.title}
                    </Link>
                  </TableCell>
                  <TableCell>{application.job.company}</TableCell>
                  <TableCell>{application.job.location}</TableCell>
                  <TableCell>{formatDate(new Date(application.createdAt))}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[application.status]}
                      color={statusColors[application.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="View Job">
                        <IconButton
                          component={RouterLink}
                          to={`/jobs/${application.job._id}`}
                          size="small"
                        >
                          <Briefcase size={18} />
                        </IconButton>
                      </Tooltip>
                      
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default MyApplications;