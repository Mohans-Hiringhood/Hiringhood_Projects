import React from 'react';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <FileQuestion size={80} color="#9ca3af" style={{ marginBottom: '1.5rem' }} />
        
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500 }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/"
            size="large"
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            component={RouterLink}
            to="/jobs"
            size="large"
          >
            Browse Jobs
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;