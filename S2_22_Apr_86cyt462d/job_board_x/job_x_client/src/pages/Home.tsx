import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  TextField,
  InputAdornment,
  Paper,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  Building2, 
  ShieldCheck,
  MonitorSmartphone,
  Sparkles
} from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import useAuth from '../hooks/useAuth';

const HeroSection = styled(Box)`
  background: linear-gradient(rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.85)), 
              url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 0;
`;

const FeatureCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const IconWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-bottom: 1rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
`;

const StatCard = styled(Paper)`
  padding: 1.5rem;
  text-align: center;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchQuery}`);
  };

  const features = [
    {
      icon: <Briefcase size={32} />,
      title: 'Find Your Dream Job',
      description: 'Browse thousands of job opportunities across various industries and locations. Filter by skills, experience, and more.'
    },
    {
      icon: <ShieldCheck size={32} />,
      title: 'Verified Employers',
      description: 'All employers are verified to ensure you connect with legitimate companies and opportunities.'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Skill Matching',
      description: 'Our intelligent system matches your skills and experience with the perfect job opportunities.'
    },
    {
      icon: <MonitorSmartphone size={32} />,
      title: 'Apply Anytime, Anywhere',
      description: 'Our mobile-friendly platform lets you search and apply for jobs from any device, anytime.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Job Listings' },
    { value: '8,500+', label: 'Companies' },
    { value: '150,000+', label: 'Job Seekers' },
    { value: '95%', label: 'Success Rate' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Box textAlign="center" maxWidth="800px" mx="auto">
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Find Your Perfect Job Match
            </Typography>
            <Typography variant="h6" paragraph>
              Connect with thousands of employers and opportunities in one place.
              Your next career move is just a click away.
            </Typography>
            
            <Paper 
              component="form" 
              elevation={3}
              sx={{ 
                p: 1, 
                display: 'flex', 
                alignItems: 'center',
                borderRadius: 2,
                mt: 4,
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 1 : 0,
              }}
              onSubmit={handleSearch}
            >
              <TextField
                fullWidth
                placeholder="Job title, keywords, or company"
                variant="outlined"
                size="medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="#9ca3af" />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: isMobile ? 1 : '8px 0 0 8px',
                    bgcolor: 'white',
                  }
                }}
                sx={{ flex: 2 }}
              />
              
              <Button 
                type="submit"
                variant="contained" 
                size="large" 
                sx={{ 
                  height: isMobile ? 'auto' : 56, 
                  borderRadius: isMobile ? 1 : '0 8px 8px 0',
                  width: isMobile ? '100%' : 'auto',
                  px: 4
                }}
              >
                Search Jobs
              </Button>
            </Paper>
            
            <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
              Popular: Software Engineer, Marketing, Design, Sales, Remote
            </Typography>
          </Box>
        </Container>
      </HeroSection>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <StatCard>
                <Typography variant="h4" component="div" color="primary" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box py={8} bgcolor="white">
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Why Choose JobBoardX
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              We connect talented professionals with outstanding opportunities through our comprehensive job platform.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard>
                  <CardContent>
                    <IconWrapper>
                      {feature.icon}
                    </IconWrapper>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={10}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundImage: 'linear-gradient(135deg, #60a5fa20 0%, #8b5cf620 100%)',
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
              Ready to Take the Next Step?
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
              Whether you're looking for your dream job or searching for the perfect candidate,
              JobBoardX has you covered with our comprehensive platform.
            </Typography>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
            >
              {!user ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/register"
                  >
                    Sign Up Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/login"
                  >
                    Log In
                  </Button>
                </>
              ) : user.role === 'employer' ? (
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/employer/post-job"
                >
                  Post a Job
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/jobs"
                >
                  Browse Jobs
                </Button>
              )}
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;