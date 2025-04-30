import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  message = 'Loading...', 
  fullPage = false 
}) => {
  const content = (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      p={3}
    >
      <CircularProgress size={size} color="primary" />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          mt={2} 
          textAlign="center"
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="calc(100vh - 64px)" // Adjust based on your header height
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;