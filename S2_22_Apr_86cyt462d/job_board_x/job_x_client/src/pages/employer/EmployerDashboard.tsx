import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  CardActionArea,
  IconButton,
  styled,
} from '@mui/material';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Plus,
  BarChart
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import useAuth from '../../hooks/useAuth';
import useJobs from '../../hooks/useJobs';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/dateUtils';

// Styled components
const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '12px',
  marginBottom: theme.spacing(1),
}));

const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { employerJobs, loading, error, getEmployerJobs } = useJobs();
  
  useEffect(() => {
    getEmployerJobs();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading dashboard..." />;
  }

  // Dashboard stats
  const stats = [
    {
      title: 'Total Jobs',
      value: employerJobs.length,
      icon: <Briefcase size={24} />,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Total Applications',
      value: employerJobs.reduce((sum, job) => sum + job.applicationsCount, 0),
      icon: <Users size={24} />,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Active Jobs',
      value: employerJobs.filter(job => job.isActive).length,
      icon: <CheckCircle size={24} />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Expired Jobs',
      value: employerJobs.filter(job => !job.isActive).length,
      icon: <XCircle size={24} />,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
  ];

  return (
    <PageContainer title={`Welcome, ${user?.name}`} subtitle="Manage your job postings and applications">
      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <StatCard variant="outlined">
              <CardContent>
                <IconBox sx={{ bgcolor: stat.bgColor }}>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </IconBox>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        ))}

        {/* Recent Jobs */}
        <Grid item xs={12} md={7}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h3">
                  Recent Job Postings
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/employer/jobs"
                  endIcon={<ChevronRight size={16} />}
                >
                  View All
                </Button>
              </Box>
              
              {employerJobs.length === 0 ? (
                <EmptyState
                  title="No jobs posted yet"
                  description="Start attracting top talent by posting your first job"
                  actionText="Post a Job"
                  actionPath="/employer/post-job"
                  icon={<Briefcase size={48} />}
                />
              ) : (
                <List disablePadding>
                  {employerJobs.slice(0, 5).map((job, index) => (
                    <React.Fragment key={job._id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem 
                        disablePadding 
                        secondaryAction={
                          <Button 
                            size="small" 
                            component={RouterLink} 
                            to={`/employer/jobs/${job._id}/applications`}
                            endIcon={<ChevronRight size={16} />}
                          >
                            {job.applicationsCount > 0 
                              ? `${job.applicationsCount} Applications` 
                              : 'No Applications'}
                          </Button>
                        }
                        sx={{ py: 1.5 }}
                      >
                        <CardActionArea 
                          component={RouterLink} 
                          to={`/jobs/${job._id}`}
                          sx={{ borderRadius: 1 }}
                        >
                          <Box px={2} py={1}>
                            <Typography variant="subtitle1" component="div">
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {job.location} • Posted on {formatDate(new Date(job.createdAt))}
                            </Typography>
                          </Box>
                        </CardActionArea>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={5}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Quick Actions
              </Typography>
              
              <List disablePadding>
                <Paper 
                  variant="outlined" 
                  component={RouterLink} 
                  to="/employer/post-job"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      p: 1.5, 
                      borderRadius: 2, 
                      mr: 2,
                      display: 'flex'
                    }}
                  >
                    <Plus size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Post a New Job
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a new job posting to find talent
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper 
                  variant="outlined" 
                  component={RouterLink} 
                  to="/employer/jobs"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'secondary.light',
                      color: 'secondary.contrastText',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'secondary.main', 
                      color: 'white', 
                      p: 1.5, 
                      borderRadius: 2, 
                      mr: 2,
                      display: 'flex'
                    }}
                  >
                    <Briefcase size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Manage Jobs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Edit, delete, or view applications
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'info.light',
                      color: 'info.contrastText',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'info.main', 
                      color: 'white', 
                      p: 1.5, 
                      borderRadius: 2, 
                      mr: 2,
                      display: 'flex'
                    }}
                  >
                    <BarChart size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      View Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get insights on your job postings
                    </Typography>
                  </Box>
                </Paper>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default EmployerDashboard;