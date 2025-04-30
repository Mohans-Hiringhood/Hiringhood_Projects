import React, { useState } from 'react';
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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MapPin, Briefcase, DollarSign, Calendar, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import AlertMessage from '../../components/common/AlertMessage';
import useJobs from '../../hooks/useJobs';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { createJob, loading, error, success, resetSuccess } = useJobs();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote'
  ];

  const formik = useFormik({
    initialValues: {
      title: '',
      location: '',
      description: '',
      requirements: '',
      type: '',
      salary: '',
      skills: [] as string[],
      applicationDeadline: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Job title is required'),
      location: Yup.string().required('Location is required'),
      description: Yup.string().required('Job description is required').min(100, 'Description should be at least 100 characters'),
      requirements: Yup.string().required('Job requirements are required').min(50, 'Requirements should be at least 50 characters'),
      type: Yup.string().required('Job type is required').oneOf(jobTypes, 'Invalid job type'),
      salary: Yup.string(),
      skills: Yup.array().of(Yup.string()).min(1, 'At least one skill is required'),
      applicationDeadline: Yup.date().min(new Date(), 'Deadline must be in the future'),
    }),
    onSubmit: async (values) => {
      await createJob(values);
      setSuccessDialogOpen(true);
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

  return (
    <PageContainer
      title="Post a New Job"
      subtitle="Create a compelling job posting to attract the right candidates"
      breadcrumbs={[
        { label: 'Dashboard', path: '/employer/dashboard' },
        { label: 'Post Job' },
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
              placeholder="e.g., Senior Software Engineer"
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
              placeholder="e.g., San Francisco, CA or Remote"
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
              placeholder="e.g., $80,000 - $100,000"
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
              placeholder="Describe the job role, responsibilities, and what the candidate will be doing..."
              variant="outlined"
              multiline
              rows={6}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={(formik.touched.description && formik.errors.description) || 'Provide a detailed description of the job, including day-to-day responsibilities.'}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="requirements"
              name="requirements"
              label="Job Requirements"
              placeholder="List the qualifications, experience, and skills required for this position..."
              variant="outlined"
              multiline
              rows={4}
              value={formik.values.requirements}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requirements && Boolean(formik.errors.requirements)}
              helperText={(formik.touched.requirements && formik.errors.requirements) || 'Specify the qualifications, experience, and education required for this role.'}
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

          <Grid item xs={12} mt={2}>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/employer/dashboard')}
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
                Post Job
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
            Job Posted Successfully!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Your job listing has been published and is now visible to job seekers.
            You can manage your job postings from the jobs dashboard.
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

export default PostJob;