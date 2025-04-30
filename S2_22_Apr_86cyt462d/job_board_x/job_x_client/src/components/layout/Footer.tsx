import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  Stack
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Briefcase as BriefcaseBusiness, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { APP_NAME } from '../../config';
import styled from '@emotion/styled';

const FooterContainer = styled(Box)`
  background-color: #f8fafc;
  padding: 3rem 0;
  margin-top: auto;
`;

const FooterLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  line-height: 2;
  
  &:hover {
    color: #3b82f6;
    text-decoration: none;
  }
`;

const SocialIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #4b5563;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3b82f6;
    color: white;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <BriefcaseBusiness size={24} color="#3b82f6" style={{ marginRight: '0.5rem' }} />
              <Typography variant="h6" color="primary" fontWeight="bold">{APP_NAME}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connecting talented professionals with outstanding opportunities. Find your dream job or the perfect candidate with our comprehensive job board platform.
            </Typography>
            <Stack direction="row" spacing={1} mt={2}>
              <SocialIcon component="a" href="#" aria-label="Facebook">
                <Facebook size={20} />
              </SocialIcon>
              <SocialIcon component="a" href="#" aria-label="Twitter">
                <Twitter size={20} />
              </SocialIcon>
              <SocialIcon component="a" href="#" aria-label="LinkedIn">
                <Linkedin size={20} />
              </SocialIcon>
              <SocialIcon component="a" href="#" aria-label="Instagram">
                <Instagram size={20} />
              </SocialIcon>
            </Stack>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              For Job Seekers
            </Typography>
            <Box component="nav">
              <FooterLink component={RouterLink} to="/jobs" display="block">Browse Jobs</FooterLink>
              <FooterLink component={RouterLink} to="/applications" display="block">My Applications</FooterLink>
              <FooterLink component={RouterLink} to="/profile" display="block">Profile</FooterLink>
              <FooterLink component="a" href="#" display="block">Career Advice</FooterLink>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              For Employers
            </Typography>
            <Box component="nav">
              <FooterLink component={RouterLink} to="/employer/post-job" display="block">Post a Job</FooterLink>
              <FooterLink component={RouterLink} to="/employer/jobs" display="block">Manage Jobs</FooterLink>
              <FooterLink component="a" href="#" display="block">Talent Search</FooterLink>
              <FooterLink component="a" href="#" display="block">Pricing</FooterLink>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Company
            </Typography>
            <Box component="nav">
              <FooterLink component={RouterLink} to="/about" display="block">About Us</FooterLink>
              <FooterLink component={RouterLink} to="/contact" display="block">Contact</FooterLink>
              <FooterLink component={RouterLink} to="/privacy" display="block">Privacy Policy</FooterLink>
              <FooterLink component={RouterLink} to="/terms" display="block">Terms of Service</FooterLink>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;