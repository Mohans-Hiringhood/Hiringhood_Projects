import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material'

interface ConfirmationModalProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmationModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmationModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: 400,
          maxWidth: 500
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 600,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ 
        px: 3,
        py: 2,
        gap: 2
      }}>
        <Button 
          onClick={onCancel} 
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {isLoading ? 'Deleting...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}