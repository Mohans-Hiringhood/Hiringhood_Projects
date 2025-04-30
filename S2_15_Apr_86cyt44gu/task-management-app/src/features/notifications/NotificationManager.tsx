import { Snackbar, Alert, Slide, SlideProps, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { removeNotification } from './notificationSlice'

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />
}

export default function NotificationManager() {
  const notifications = useAppSelector((state) => state.notifications)
  const dispatch = useAppDispatch()

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open
          autoHideDuration={notification.type === 'error' ? 10000 : 6000}
          onClose={() => dispatch(removeNotification(notification.id))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={SlideTransition}
          sx={{
            '& .MuiAlert-root': {
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              alignItems: 'center',
              width: '100%'
            }
          }}
        >
          <Alert 
            severity={notification.type}
            onClose={() => dispatch(removeNotification(notification.id))}
            sx={{ 
              width: '100%',
              '& .MuiAlert-icon': {
                alignItems: 'center',
                mr: 2
              },
              '& .MuiAlert-message': {
                py: 1
              }
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {notification.message}
            </Typography>
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}