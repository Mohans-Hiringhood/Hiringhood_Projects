import React, { useEffect, useState } from 'react';
import { 
  TextField, 
  Grid, 
  Button, 
  Typography, 
  MenuItem, 
  InputAdornment,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MapPin, Briefcase, DollarSign, Calendar, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import useJobs from '../../hooks/useJobs';

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, getJobById, updateJob, loading, error, success, resetSuccess } = useJobs();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote'
  ];

  // Fetch job details
  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        await getJobById(id);
        setInitialLoading(false);
      };
      fetchJob();
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      title: job?.title || '',
      location: job?.location || '',
      description: job?.description || '',
      requirements: job?.requirements || '',
      type: job?.type || '',
      salary: job?.salary || '',
      skills: job?.skills || [],
      applicationDeadline: job?.applicationDeadline 
        ? new Date(job.applicationDeadline).toISOString().split('T')[0] 
        : '',
      isActive: job?.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Job title is required'),
      location: Yup.string().required('Location is required'),
      description: Yup.string().required('Job description is required').min(100, 'Description should be at least 100 characters'),
      requirements: Yup.string().required('Job requirements are required').min(50, 'Requirements should be at least 50 characters'),
      type: Yup.string().required('Job type is required').oneOf(jobTypes, 'Invalid job type'),
      salary: Yup.string(),
      skills: Yup.array().of(Yup.string()).min(1, 'At least one skill is required'),
      applicationDeadline: Yup.date().min(new Date(), 'Deadline must be in the future'),
      isActive: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      if (id) {
        await updateJob(id, values);
        setSuccessDialogOpen(true);
      }
    },
  });

  const handleAddSkill = () => {
    if (skillInput.trim() && !formik.values.skills.includes(skillInput.trim())) {
      formik.setFieldValue('skills', [...formik.values.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    formik.setFieldValue(
      'skills',
      formik.values.skills.filter((skill) => skill !== skillToDelete)
    );
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    resetSuccess();
    navigate('/employer/jobs');
  };

  if (initialLoading) {
    return <LoadingSpinner fullPage message="Loading job details..." />;
  }

  if (!job && !initialLoading) {
    return (
      <PageContainer title="Job Not Found">
        <Typography variant="body1" paragraph>
          The job you're trying to edit could not be found or you don't have permission to edit it.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/employer/jobs')}
        >
          Back to My Jobs
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Edit Job Posting"
      subtitle="Update your job listing information"
      breadcrumbs={[
        { label: 'Dashboard', path: '/employer/dashboard' },
        { label: 'My Jobs', path: '/employer/jobs' },
        { label: 'Edit Job' },
      ]}
    >
      {error && (
        <Box mb={3}>
          <AlertMessage severity="error" message={error} />
        </Box>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Job Title"
              variant="outlined"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              variant="outlined"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MapPin size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="type"
              name="type"
              select
              label="Job Type"
              variant="outlined"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.type && Boolean(formik.errors.type)}
              helperText={formik.touched.type && formik.errors.type}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Briefcase size={20} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">Select Job Type</MenuItem>
              {jobTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="salary"
              name="salary"
              label="Salary Range (Optional)"
              variant="outlined"
              value={formik.values.salary}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.salary && Boolean(formik.errors.salary)}
              helperText={formik.touched.salary && formik.errors.salary}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DollarSign size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Job Description"
              variant="outlined"
              multiline
              rows={6}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="requirements"
              name="requirements"
              label="Job Requirements"
              variant="outlined"
              multiline
              rows={4}
              value={formik.values.requirements}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requirements && Boolean(formik.errors.requirements)}
              helperText={formik.touched.requirements && formik.errors.requirements}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="skillInput"
              label="Skills Required"
              placeholder="e.g., JavaScript, React, Node.js (Press Enter to add)"
              variant="outlined"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillInputKeyDown}
              onBlur={handleAddSkill}
              disabled={loading}
              helperText={
                formik.touched.skills && formik.errors.skills 
                  ? formik.errors.skills 
                  : "Enter skills one by one and press Enter after each skill"
              }
              error={formik.touched.skills && Boolean(formik.errors.skills)}
            />
            
            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
              {formik.values.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleDeleteSkill(skill)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="applicationDeadline"
              name="applicationDeadline"
              label="Application Deadline"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={formik.values.applicationDeadline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.applicationDeadline && Boolean(formik.errors.applicationDeadline)}
              helperText={formik.touched.applicationDeadline && formik.errors.applicationDeadline}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Calendar size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={formik.handleChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="Job is active and visible to job seekers"
            />
          </Grid>

          <Grid item xs={12} mt={2}>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/employer/jobs')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                Update Job
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      
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
            Job Updated Successfully!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Your job listing has been updated and the changes are now visible to job seekers.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleCloseSuccessDialog}
          >
            Go to My Jobs
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default EditJob;