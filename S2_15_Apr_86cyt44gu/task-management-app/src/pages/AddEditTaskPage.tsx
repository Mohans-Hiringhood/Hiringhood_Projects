import { Container, CircularProgress, Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import TaskForm from '../features/tasks/TaskForm'
import { useAppSelector } from '../store/store'

export default function AddEditTaskPage() {
  const { id } = useParams()
  const { isLoading } = useAppSelector((state) => state.tasks)
  const isEditing = !!id

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {isLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <TaskForm isEditing={isEditing} taskId={id} />
        </>
      )}
    </Container>
  )
}