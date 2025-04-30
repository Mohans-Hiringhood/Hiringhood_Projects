import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FileX } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionPath?: string;
  onActionClick?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  actionPath,
  onActionClick,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      textAlign="center"
    >
      <Box mb={3} color="text.secondary">
        {icon || <FileX size={64} />}
      </Box>
      
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 450, mb: 4 }}
      >
        {description}
      </Typography>
      
      {actionText && (actionPath || onActionClick) && (
        <Button
          variant="contained"
          color="primary"
          component={actionPath ? RouterLink : 'button'}
          to={actionPath}
          onClick={onActionClick}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;