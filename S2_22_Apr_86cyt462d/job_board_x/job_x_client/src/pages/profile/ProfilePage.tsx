import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Grid, 
  Paper, 
  Divider, 
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Stack,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Briefcase, 
  GraduationCap, 
  Share2,
  Check,
  Github,
  Linkedin,
  Globe,
  X
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useProfile, { Experience, Education } from '../../hooks/useProfile';
import useAuth from '../../hooks/useAuth';
import PageContainer from '../../components/layout/PageContainer';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import AlertMessage from '../../components/common/AlertMessage';
import EmptyState from '../../components/common/EmptyState';

// Helper component for date display
const DateRangeDisplay: React.FC<{ from: string; to?: string; current: boolean }> = ({ 
  from, 
  to, 
  current 
}) => {
  const fromDate = new Date(from);
  const toDate = to ? new Date(to) : null;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };
  
  return (
    <Typography variant="body2" color="text.secondary">
      {formatDate(fromDate)} - {current ? 'Present' : toDate ? formatDate(toDate) : ''}
    </Typography>
  );
};

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { 
    profile, 
    loading, 
    error, 
    updateSuccess, 
    updateProfile 
  } = useProfile();
  const [skillInput, setSkillInput] = useState('');
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Show success message when profile is updated
  useEffect(() => {
    if (updateSuccess) {
      setSuccessMessage('Profile updated successfully');
      
      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const handleSkillAdd = () => {
    if (skillInput.trim() && profile) {
      const newSkills = [...(profile.skills || [])];
      
      if (!newSkills.includes(skillInput.trim())) {
        newSkills.push(skillInput.trim());
        updateProfile({ skills: newSkills });
        setSkillInput('');
      }
    }
  };

  const handleSkillDelete = (skillToDelete: string) => {
    if (profile) {
      const newSkills = profile.skills.filter(
        (skill) => skill !== skillToDelete
      );
      updateProfile({ skills: newSkills });
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSkillAdd();
    }
  };

  // Experience form validation schema
  const experienceSchema = Yup.object({
    title: Yup.string().required('Job title is required'),
    company: Yup.string().required('Company is required'),
    location: Yup.string(),
    from: Yup.date().required('Start date is required'),
    to: Yup.date().when('current', {
      is: false,
      then: (schema) => schema.required('End date is required'),
    }),
    current: Yup.boolean(),
    description: Yup.string(),
  });

  // Education form validation schema
  const educationSchema = Yup.object({
    school: Yup.string().required('School is required'),
    degree: Yup.string().required('Degree is required'),
    fieldOfStudy: Yup.string().required('Field of study is required'),
    from: Yup.date().required('Start date is required'),
    to: Yup.date().when('current', {
      is: false,
      then: (schema) => schema.required('End date is required'),
    }),
    current: Yup.boolean(),
    description: Yup.string(),
  });

  // Profile form
  const profileFormik = useFormik({
    initialValues: {
      bio: profile?.bio || '',
      location: profile?.location || '',
      resumeUrl: profile?.resumeUrl || '',
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      website: profile?.socialLinks?.website || '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateProfile({
        bio: values.bio,
        location: values.location,
        resumeUrl: values.resumeUrl,
        socialLinks: {
          linkedin: values.linkedin,
          github: values.github,
          website: values.website,
        },
      });
    },
  });

  // Experience form
  const experienceFormik = useFormik({
    initialValues: {
      title: editingExperience?.title || '',
      company: editingExperience?.company || '',
      location: editingExperience?.location || '',
      from: editingExperience?.from 
        ? new Date(editingExperience.from).toISOString().split('T')[0] 
        : '',
      to: editingExperience?.to 
        ? new Date(editingExperience.to).toISOString().split('T')[0] 
        : '',
      current: editingExperience?.current || false,
      description: editingExperience?.description || '',
    },
    enableReinitialize: true,
    validationSchema: experienceSchema,
    onSubmit: (values) => {
      if (profile) {
        let updatedExperience: Experience[] = [...(profile.experience || [])];
        
        if (editingExperience && editingExperience._id) {
          // Update existing experience
          updatedExperience = updatedExperience.map((exp) =>
            exp._id === editingExperience._id ? { ...values, _id: exp._id } : exp
          );
        } else {
          // Add new experience
          updatedExperience.push(values);
        }
        
        updateProfile({ experience: updatedExperience });
        setExperienceDialogOpen(false);
        setEditingExperience(null);
      }
    },
  });

  // Education form
  const educationFormik = useFormik({
    initialValues: {
      school: editingEducation?.school || '',
      degree: editingEducation?.degree || '',
      fieldOfStudy: editingEducation?.fieldOfStudy || '',
      from: editingEducation?.from 
        ? new Date(editingEducation.from).toISOString().split('T')[0] 
        : '',
      to: editingEducation?.to 
        ? new Date(editingEducation.to).toISOString().split('T')[0] 
        : '',
      current: editingEducation?.current || false,
      description: editingEducation?.description || '',
    },
    enableReinitialize: true,
    validationSchema: educationSchema,
    onSubmit: (values) => {
      if (profile) {
        let updatedEducation: Education[] = [...(profile.education || [])];
        
        if (editingEducation && editingEducation._id) {
          // Update existing education
          updatedEducation = updatedEducation.map((edu) =>
            edu._id === editingEducation._id ? { ...values, _id: edu._id } : edu
          );
        } else {
          // Add new education
          updatedEducation.push(values);
        }
        
        updateProfile({ education: updatedEducation });
        setEducationDialogOpen(false);
        setEditingEducation(null);
      }
    },
  });

  const handleDeleteExperience = (experienceId?: string) => {
    if (profile && experienceId) {
      const updatedExperience = profile.experience.filter(
        (exp) => exp._id !== experienceId
      );
      updateProfile({ experience: updatedExperience });
    }
  };

  const handleDeleteEducation = (educationId?: string) => {
    if (profile && educationId) {
      const updatedEducation = profile.education.filter(
        (edu) => edu._id !== educationId
      );
      updateProfile({ education: updatedEducation });
    }
  };

  const openExperienceDialog = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience);
    } else {
      setEditingExperience(null);
    }
    setExperienceDialogOpen(true);
  };

  const openEducationDialog = (education?: Education) => {
    if (education) {
      setEditingEducation(education);
    } else {
      setEditingEducation(null);
    }
    setEducationDialogOpen(true);
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading profile..." />;
  }

  const isJobSeeker = user?.role === 'jobSeeker';

  return (
    <PageContainer title="Profile">
      {error && <AlertMessage severity="error" message={error} />}
      {successMessage && <AlertMessage severity="success" message={successMessage} />}

      {!profile && !loading ? (
        <EmptyState
          title="Complete Your Profile"
          description="Set up your profile to showcase your skills and experience to potential employers."
          icon={<Briefcase size={64} />}
          actionText="Create Profile"
          onActionClick={() => {
            updateProfile({
              bio: '',
              location: '',
              skills: [],
              resumeUrl: '',
              socialLinks: {},
            });
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  Basic Information
                </Typography>
                
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {user?.name.charAt(0).toUpperCase()}
                  </Box>
                  
                  <Typography variant="h6" component="h4" gutterBottom>
                    {user?.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user?.email}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ 
                      textTransform: 'capitalize',
                      fontWeight: 'medium' 
                    }}
                  >
                    {user?.role === 'jobSeeker' ? 'Job Seeker' : 'Employer'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <form onSubmit={profileFormik.handleSubmit}>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      id="location"
                      name="location"
                      label="Location"
                      placeholder="e.g., San Francisco, CA"
                      variant="outlined"
                      margin="normal"
                      value={profileFormik.values.location}
                      onChange={profileFormik.handleChange}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      id="bio"
                      name="bio"
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={4}
                      value={profileFormik.values.bio}
                      onChange={profileFormik.handleChange}
                    />
                  </Box>
                  
                  {isJobSeeker && (
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        id="resumeUrl"
                        name="resumeUrl"
                        label="Resume URL"
                        placeholder="Link to your resume"
                        variant="outlined"
                        margin="normal"
                        value={profileFormik.values.resumeUrl}
                        onChange={profileFormik.handleChange}
                      />
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Social Links
                  </Typography>
                  
                  <TextField
                    fullWidth
                    id="linkedin"
                    name="linkedin"
                    label="LinkedIn"
                    placeholder="https://linkedin.com/in/username"
                    variant="outlined"
                    margin="normal"
                    value={profileFormik.values.linkedin}
                    onChange={profileFormik.handleChange}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" mr={1} display="flex" alignItems="center">
                          <Linkedin size={20} />
                        </Box>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    id="github"
                    name="github"
                    label="GitHub"
                    placeholder="https://github.com/username"
                    variant="outlined"
                    margin="normal"
                    value={profileFormik.values.github}
                    onChange={profileFormik.handleChange}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" mr={1} display="flex" alignItems="center">
                          <Github size={20} />
                        </Box>
                      ),
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    id="website"
                    name="website"
                    label="Website"
                    placeholder="https://example.com"
                    variant="outlined"
                    margin="normal"
                    value={profileFormik.values.website}
                    onChange={profileFormik.handleChange}
                    InputProps={{
                      startAdornment: (
                        <Box component="span" mr={1} display="flex" alignItems="center">
                          <Globe size={20} />
                        </Box>
                      ),
                    }}
                  />
                  
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            {/* Skills */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h3">
                  Skills
                </Typography>
              </Box>
              
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Add Skills"
                  placeholder="e.g., JavaScript, React (Press Enter to add)"
                  variant="outlined"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  onBlur={handleSkillAdd}
                  sx={{ mb: 2 }}
                />
                
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {profile?.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleSkillDelete(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  
                  {profile?.skills.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No skills added yet. Add your key skills to stand out to employers.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Work Experience */}
            {isJobSeeker && (
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h3">
                    Work Experience
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Plus size={18} />}
                    onClick={() => openExperienceDialog()}
                  >
                    Add Experience
                  </Button>
                </Box>
                
                {profile?.experience && profile.experience.length > 0 ? (
                  profile.experience.map((exp, index) => (
                    <Box key={exp._id || index} mb={3}>
                      {index > 0 && <Divider sx={{ my: 2 }} />}
                      
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" component="h4">
                            {exp.title}
                          </Typography>
                          
                          <Typography variant="subtitle1" gutterBottom>
                            {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                          </Typography>
                          
                          <DateRangeDisplay
                            from={exp.from}
                            to={exp.to}
                            current={exp.current}
                          />
                          
                          {exp.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {exp.description}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => openExperienceDialog(exp)}
                            aria-label="edit experience"
                          >
                            <Edit size={18} />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteExperience(exp._id)}
                            aria-label="delete experience"
                            color="error"
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No work experience added yet. Add your professional experience to showcase your skills.
                  </Typography>
                )}
              </Paper>
            )}

            {/* Education */}
            {isJobSeeker && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="h3">
                    Education
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Plus size={18} />}
                    onClick={() => openEducationDialog()}
                  >
                    Add Education
                  </Button>
                </Box>
                
                {profile?.education && profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <Box key={edu._id || index} mb={3}>
                      {index > 0 && <Divider sx={{ my: 2 }} />}
                      
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" component="h4">
                            {edu.school}
                          </Typography>
                          
                          <Typography variant="subtitle1" gutterBottom>
                            {edu.degree} in {edu.fieldOfStudy}
                          </Typography>
                          
                          <DateRangeDisplay
                            from={edu.from}
                            to={edu.to}
                            current={edu.current}
                          />
                          
                          {edu.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {edu.description}
                            </Typography>
                          )}
                        </Box>
                        
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => openEducationDialog(edu)}
                            aria-label="edit education"
                          >
                            <Edit size={18} />
                          </IconButton>
                          
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteEducation(edu._id)}
                            aria-label="delete education"
                            color="error"
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No education history added yet. Add your educational background to complete your profile.
                  </Typography>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      )}

      {/* Experience Dialog */}
      <Dialog 
        open={experienceDialogOpen} 
        onClose={() => setExperienceDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingExperience ? 'Edit Experience' : 'Add Experience'}
        </DialogTitle>
        
        <DialogContent dividers>
          <form id="experience-form" onSubmit={experienceFormik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="Job Title"
                  variant="outlined"
                  margin="normal"
                  value={experienceFormik.values.title}
                  onChange={experienceFormik.handleChange}
                  onBlur={experienceFormik.handleBlur}
                  error={experienceFormik.touched.title && Boolean(experienceFormik.errors.title)}
                  helperText={experienceFormik.touched.title && experienceFormik.errors.title}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="company"
                  name="company"
                  label="Company"
                  variant="outlined"
                  margin="normal"
                  value={experienceFormik.values.company}
                  onChange={experienceFormik.handleChange}
                  onBlur={experienceFormik.handleBlur}
                  error={experienceFormik.touched.company && Boolean(experienceFormik.errors.company)}
                  helperText={experienceFormik.touched.company && experienceFormik.errors.company}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="location"
                  name="location"
                  label="Location"
                  variant="outlined"
                  margin="normal"
                  value={experienceFormik.values.location}
                  onChange={experienceFormik.handleChange}
                  onBlur={experienceFormik.handleBlur}
                  error={experienceFormik.touched.location && Boolean(experienceFormik.errors.location)}
                  helperText={experienceFormik.touched.location && experienceFormik.errors.location}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="from"
                  name="from"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={experienceFormik.values.from}
                  onChange={experienceFormik.handleChange}
                  onBlur={experienceFormik.handleBlur}
                  error={experienceFormik.touched.from && Boolean(experienceFormik.errors.from)}
                  helperText={experienceFormik.touched.from && experienceFormik.errors.from}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="flex-start" mt={2}>
                  <Stack spacing={1} width="100%">
                    <TextField
                      fullWidth
                      id="to"
                      name="to"
                      label="End Date"
                      type="date"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      value={experienceFormik.values.to}
                      onChange={experienceFormik.handleChange}
                      onBlur={experienceFormik.handleBlur}
                      error={experienceFormik.touched.to && Boolean(experienceFormik.errors.to)}
                      helperText={experienceFormik.touched.to && experienceFormik.errors.to}
                      disabled={experienceFormik.values.current}
                      required={!experienceFormik.values.current}
                    />
                    <Box display="flex" alignItems="center">
                      <Chip
                        label="I currently work here"
                        onClick={() => experienceFormik.setFieldValue('current', !experienceFormik.values.current)}
                        color={experienceFormik.values.current ? 'primary' : 'default'}
                        icon={experienceFormik.values.current ? <Check size={16} /> : undefined}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  value={experienceFormik.values.description}
                  onChange={experienceFormik.handleChange}
                  onBlur={experienceFormik.handleBlur}
                  error={experienceFormik.touched.description && Boolean(experienceFormik.errors.description)}
                  helperText={experienceFormik.touched.description && experienceFormik.errors.description}
                  placeholder="Describe your responsibilities and achievements..."
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setExperienceDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            type="submit"
            form="experience-form"
          >
            {editingExperience ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Education Dialog */}
      <Dialog 
        open={educationDialogOpen} 
        onClose={() => setEducationDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingEducation ? 'Edit Education' : 'Add Education'}
        </DialogTitle>
        
        <DialogContent dividers>
          <form id="education-form" onSubmit={educationFormik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="school"
                  name="school"
                  label="School"
                  variant="outlined"
                  margin="normal"
                  value={educationFormik.values.school}
                  onChange={educationFormik.handleChange}
                  onBlur={educationFormik.handleBlur}
                  error={educationFormik.touched.school && Boolean(educationFormik.errors.school)}
                  helperText={educationFormik.touched.school && educationFormik.errors.school}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="degree"
                  name="degree"
                  label="Degree"
                  variant="outlined"
                  margin="normal"
                  value={educationFormik.values.degree}
                  onChange={educationFormik.handleChange}
                  onBlur={educationFormik.handleBlur}
                  error={educationFormik.touched.degree && Boolean(educationFormik.errors.degree)}
                  helperText={educationFormik.touched.degree && educationFormik.errors.degree}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  label="Field of Study"
                  variant="outlined"
                  margin="normal"
                  value={educationFormik.values.fieldOfStudy}
                  onChange={educationFormik.handleChange}
                  onBlur={educationFormik.handleBlur}
                  error={educationFormik.touched.fieldOfStudy && Boolean(educationFormik.errors.fieldOfStudy)}
                  helperText={educationFormik.touched.fieldOfStudy && educationFormik.errors.fieldOfStudy}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="from"
                  name="from"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={educationFormik.values.from}
                  onChange={educationFormik.handleChange}
                  onBlur={educationFormik.handleBlur}
                  error={educationFormik.touched.from && Boolean(educationFormik.errors.from)}
                  helperText={educationFormik.touched.from && educationFormik.errors.from}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="flex-start" mt={2}>
                  <Stack spacing={1} width="100%">
                    <TextField
                      fullWidth
                      id="to"
                      name="to"
                      label="End Date"
                      type="date"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      value={educationFormik.values.to}
                      onChange={educationFormik.handleChange}
                      onBlur={educationFormik.handleBlur}
                      error={educationFormik.touched.to && Boolean(educationFormik.errors.to)}
                      helperText={educationFormik.touched.to && educationFormik.errors.to}
                      disabled={educationFormik.values.current}
                      required={!educationFormik.values.current}
                    />
                    <Box display="flex" alignItems="center">
                      <Chip
                        label="I am currently studying here"
                        onClick={() => educationFormik.setFieldValue('current', !educationFormik.values.current)}
                        color={educationFormik.values.current ? 'primary' : 'default'}
                        icon={educationFormik.values.current ? <Check size={16} /> : undefined}
                      />
                    </Box>
                  </Stack>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  value={educationFormik.values.description}
                  onChange={educationFormik.handleChange}
                  onBlur={educationFormik.handleBlur}
                  error={educationFormik.touched.description && Boolean(educationFormik.errors.description)}
                  helperText={educationFormik.touched.description && educationFormik.errors.description}
                  placeholder="Add details about your studies, achievements, activities..."
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setEducationDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            type="submit"
            form="education-form"
          >
            {editingEducation ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ProfilePage;