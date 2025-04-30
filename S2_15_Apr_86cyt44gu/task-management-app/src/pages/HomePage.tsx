import { Box, Button, Container, Typography, TextField, Paper, useTheme } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../store/store'
import TaskCard from '../features/tasks/TaskCard'
import FilterBar from '../features/filters/FilterBar'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { TaskStatus } from '../types/taskTypes'
import { setSearchQuery } from '../store/taskSlice'

const statusColumns: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done']

export default function HomePage() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { tasks, searchQuery, filters } = useAppSelector((state) => state.tasks) // Added filters here

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.tags && task.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    const matchesStatus = !filters.status || task.status === filters.status
    const matchesPriority = !filters.priority || task.priority === filters.priority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <Container maxWidth="xl" sx={{
      py: 4,
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h3" sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontSize: { xs: '1.8rem', sm: '2.2rem' }
        }}>
          My Tasks
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/tasks/add"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: theme.shadows[1],
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[3]
            },
            transition: 'all 0.2s ease'
          }}
        >
          + New Task
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <TextField
          fullWidth
          placeholder="Search tasks..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            sx: {
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }
          }}
          sx={{
            maxWidth: { sm: 400 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        <FilterBar />
      </Box>
      
      {/* Status Columns */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
        gap: 3,
        alignItems: 'flex-start'
      }}>
        {statusColumns.map((status) => {
          const statusTasks = filteredTasks.filter(task => task.status === status)
          return (
            <Paper key={status} elevation={1} sx={{
              p: 2,
              borderRadius: 3,
              borderTop: `4px solid ${
                status === 'To Do' ? theme.palette.grey[500] :
                status === 'In Progress' ? theme.palette.primary.main :
                status === 'In Review' ? theme.palette.warning.main :
                theme.palette.success.main
              }`
            }}>
              <Typography variant="h6" sx={{ 
                mb: 2, 
                fontWeight: 600,
                color: 'text.primary',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 
                    status === 'To Do' ? 'grey.500' :
                    status === 'In Progress' ? 'primary.main' :
                    status === 'In Review' ? 'warning.main' : 'success.main'
                }} />
                {status} ({statusTasks.length})
              </Typography>
              
              {statusTasks.length > 0 ? (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {statusTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </Box>
              ) : (
                <Box sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: 'action.hover'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    No {status} tasks
                  </Typography>
                </Box>
              )}
            </Paper>
          )
        })}
      </Box>
    </Container>
  )
}