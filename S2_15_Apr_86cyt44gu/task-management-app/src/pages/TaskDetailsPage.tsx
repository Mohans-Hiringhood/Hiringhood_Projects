import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/store'
import { deleteTask } from '../store/taskSlice'
import ConfirmationModal from '../components/ConfirmationModal'
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Chip,
  Divider,
  Stack,
  useTheme 
} from '@mui/material'
import PriorityIndicator from '../features/tasks/PriorityIndicator'
import StatusBadge from '../features/tasks/StatusBadge'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function TaskDetailsPage() {
  const { id } = useParams()
  const { tasks } = useAppSelector((state) => state.tasks)
  const task = tasks.find((t) => t.id === id)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  const handleDelete = () => {
    dispatch(deleteTask(id!))
    navigate('/')
  }

  if (!task) return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h5" color="error" sx={{ mb: 2 }}>
        Task not found
      </Typography>
      <Button 
        variant="outlined" 
        onClick={() => navigate('/')}
        sx={{ borderRadius: 2 }}
      >
        Back to tasks
      </Button>
    </Container>
  )

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done'

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 3,
          textTransform: 'none',
          borderRadius: 2,
          px: 2,
          color: 'text.secondary'
        }}
      >
        Back to tasks
      </Button>

      <Paper elevation={0} sx={{ 
        p: 4,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1]
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'text.primary'
              }}
            >
              {task.title}
            </Typography>
            
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                component={Link}
                to={`/tasks/edit/${task.id}`}
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Edit
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setShowDeleteModal(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3
                }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
          
          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <PriorityIndicator priority={task.priority} />
            <StatusBadge status={task.status} />
            <Chip 
              label={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
              variant="outlined"
              sx={{
                borderColor: isOverdue ? 'error.main' : 'success.main',
                color: isOverdue ? 'error.main' : 'success.main'
              }}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              Description
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                color: 'text.secondary'
              }}
            >
              {task.description || 'No description provided'}
            </Typography>
          </Box>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {task.tags.map((tag) => (
                  <Chip 
                    key={tag} 
                    label={tag}
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark'
                        ? 'primary.dark'
                        : 'primary.light',
                      color: theme.palette.mode === 'dark'
                        ? 'primary.contrastText'
                        : 'primary.dark'
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Paper>

      <ConfirmationModal
        open={showDeleteModal}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </Container>
  )
}