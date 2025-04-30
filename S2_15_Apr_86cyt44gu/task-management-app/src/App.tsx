import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TaskDetailsPage from './pages/TaskDetailsPage'
import AddEditTaskPage from './pages/AddEditTaskPage'
import NotificationManager from './features/notifications/NotificationManager'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }
      }
    }
  },
})

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationManager />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/tasks/add" element={<AddEditTaskPage />} />
          <Route path="/tasks/edit/:id" element={<AddEditTaskPage />} />
        </Routes>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App