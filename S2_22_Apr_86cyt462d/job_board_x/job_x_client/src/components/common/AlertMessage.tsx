import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material';
import { X } from 'lucide-react';

interface AlertMessageProps {
  severity: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onClose?: () => void;
  autoHideDuration?: number;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  severity,
  title,
  message,
  onClose,
  autoHideDuration
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoHideDuration) {
      timer = setTimeout(() => {
        setOpen(false);
        if (onClose) {
          setTimeout(onClose, 300); // Allow collapse animation to complete
        }
      }, autoHideDuration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoHideDuration, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow collapse animation to complete
    }
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <X size={16} />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;