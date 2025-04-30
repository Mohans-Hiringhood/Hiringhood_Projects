import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
  } from '@mui/material';
  
  interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
  }
  
  const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    content,
  }: ConfirmDialogProps) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ConfirmDialog;