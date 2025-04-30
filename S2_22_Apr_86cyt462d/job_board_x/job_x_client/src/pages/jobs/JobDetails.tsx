import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Chip, 
  Divider, 
  Grid, 
  Typography, 
  Card, 
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  useMediaQuery,
  useTheme,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Clock,
  Building2,
  Share2,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  Check
} from 'lucide-react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useJobs from '../../hooks/useJobs';
import useApplications from '../../hooks/useApplications';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import AlertMessage from '../../components/common/AlertMessage';
import PageContainer from '../../components/layout/PageContainer';
import { formatDate } from '../../utils/dateUtils';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { job, loading: jobLoading, error: jobError, getJobById } = useJobs();
  const { 
    applyToJob, 
    loading: applyLoading, 
    error: applyError, 
    success: applySuccess, 
    resetSuccess 
  } = useApplications();
  const { user } = useAuth();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getJobById(id);
    }
  }, [id]);

  useEffect(() => {
    if (applySuccess) {
      setApplyDialogOpen(false);
      setSuccessDialogOpen(true);
      resetSuccess();
    }
  }, [applySuccess]);

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    
    setApplyDialogOpen(true);
  };

  const handleCloseApplyDialog = () => {
    setApplyDialogOpen(false);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  const applicationFormik = useFormik({
    initialValues: {
      coverLetter: '',
      resumeUrl: '',
    },
    validationSchema: Yup.object({
      coverLetter: Yup.string()
        .required('Cover letter is required')
        .min(100, 'Cover letter must be at least 100 characters'),
      resumeUrl: Yup.string()
        .required('Resume URL is required')
        .url('Must be a valid URL'),
    }),
    onSubmit: (values) => {
      if (id) {
        applyToJob({
          jobId: id,
          ...values,
        });
      }
    },
  });

  if (jobLoading) {
    return <LoadingSpinner fullPage message="Loading job details..." />;
  }

  if (jobError) {
    return (
      <PageContainer title="Job Details">
        <AlertMessage severity="error" message={jobError} />
        <Box mt={2}>
          <Button 
            variant="outlined" 
            startIcon={<ChevronLeft size={18} />}
            component={RouterLink} 
            to="/jobs"
          >
            Back to Jobs
          </Button>
        </Box>
      </PageContainer>
    );
  }

  if (!job) {
    return (
      <PageContainer title="Job Not Found">
        <Typography variant="body1" paragraph>
          The job you're looking for could not be found or has been removed.
        </Typography>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/jobs"
        >
          Browse All Jobs
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={job.title}
      subtitle={`${job.company} · ${job.location}`}
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Jobs', path: '/jobs' },
        { label: job.title },
      ]}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Job Description */}
          <Box mb={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Job Description
            </Typography>
            <Typography variant="body1" paragraph>
              {job.description}
            </Typography>
          </Box>

          {/* Job Requirements */}
          <Box mb={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Requirements
            </Typography>
            <Typography variant="body1" paragraph>
              {job.requirements}
            </Typography>
          </Box>

          {/* Skills */}
          <Box mb={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Skills
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {job.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Job Details Sidebar */}
          <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Building2 size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Company" 
                    secondary={job.company} 
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 'medium' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <MapPin size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Location" 
                    secondary={job.location}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Briefcase size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Job Type" 
                    secondary={job.type}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                {job.salary && (
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Clock size={20} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Salary" 
                      secondary={job.salary}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1', fontWeight: 'medium' }}
                    />
                  </ListItem>
                )}
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Calendar size={20} color={theme.palette.primary.main} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Posted On" 
                    secondary={formatDate(new Date(job.createdAt))}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                
                {job.applicationDeadline && (
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Calendar size={20} color={theme.palette.primary.main} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Application Deadline" 
                      secondary={formatDate(new Date(job.applicationDeadline))}
                      primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body1' }}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box mb={3}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleApplyClick}
              disabled={user?.role === 'employer'}
              sx={{ mb: 2 }}
            >
              Apply Now
            </Button>
            
            <Box display="flex" gap={1}>
              <Button 
                variant="outlined" 
                startIcon={<Bookmark size={18} />}
                sx={{ flex: 1 }}
              >
                Save
              </Button>
              <Button 
                variant="outlined"
                startIcon={<Share2 size={18} />}
                sx={{ flex: 1 }}
              >
                Share
              </Button>
            </Box>
          </Box>
          
          {/* Company Info */}
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                About the Company
              </Typography>
              <Typography variant="body2" paragraph>
                {job.company} is a leading employer in the industry, offering excellent opportunities for growth and professional development.
              </Typography>
              <Button
                variant="text"
                endIcon={<ExternalLink size={16} />}
                sx={{ textTransform: 'none', pl: 0 }}
              >
                Visit Company Website
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apply Dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={handleCloseApplyDialog}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>
          <Typography variant="h6">Apply to {job.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {job.company} · {job.location}
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          {applyError && (
            <Box mb={2}>
              <AlertMessage severity="error" message={applyError} />
            </Box>
          )}
          
          <form id="application-form" onSubmit={applicationFormik.handleSubmit}>
            <TextField
              fullWidth
              id="resumeUrl"
              name="resumeUrl"
              label="Resume URL"
              placeholder="https://example.com/my-resume.pdf"
              variant="outlined"
              margin="normal"
              value={applicationFormik.values.resumeUrl}
              onChange={applicationFormik.handleChange}
              onBlur={applicationFormik.handleBlur}
              error={applicationFormik.touched.resumeUrl && Boolean(applicationFormik.errors.resumeUrl)}
              helperText={applicationFormik.touched.resumeUrl && applicationFormik.errors.resumeUrl}
              disabled={applyLoading}
            />
            
            <TextField
              fullWidth
              id="coverLetter"
              name="coverLetter"
              label="Cover Letter"
              placeholder="Explain why you're a good fit for this position..."
              variant="outlined"
              margin="normal"
              multiline
              rows={8}
              value={applicationFormik.values.coverLetter}
              onChange={applicationFormik.handleChange}
              onBlur={applicationFormik.handleBlur}
              error={applicationFormik.touched.coverLetter && Boolean(applicationFormik.errors.coverLetter)}
              helperText={
                (applicationFormik.touched.coverLetter && applicationFormik.errors.coverLetter) ||
                'Explain why you are interested in this position and what makes you a great candidate.'
              }
              disabled={applyLoading}
            />
          </form>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseApplyDialog} disabled={applyLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="application-form"
            variant="contained"
            disabled={applyLoading}
            startIcon={applyLoading ? <LoadingSpinner size={16} message="" /> : null}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            bgcolor="success.light" 
            color="success.contrastText"
            width={60}
            height={60}
            borderRadius="50%"
            mx="auto"
            mb={2}
          >
            <Check size={32} />
          </Box>
          
          <Typography variant="h5" component="h2" gutterBottom>
            Application Submitted!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully submitted. You can track its status in the "My Applications" section.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleCloseSuccessDialog} sx={{ mr: 1 }}>
            Close
          </Button>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/applications"
          >
            View My Applications
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default JobDetails;