import { Card, CardContent, Typography, Chip, Box, Stack, useTheme } from '@mui/material'
import { Task } from '../../types/taskTypes'
import { Link } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import PriorityIndicator from './PriorityIndicator'
import StatusBadge from './StatusBadge'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const theme = useTheme()
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done'
  const dueDateText = new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  return (
    <Card
      component={Link}
      to={`/tasks/${task.id}`}
      sx={{
        textDecoration: 'none',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}
    >
      <CardContent sx={{ 
        p: 2.5,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}>
        {/* Top row - Status and Priority */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0.5
        }}>
          <StatusBadge status={task.status} size="small" />
          <PriorityIndicator priority={task.priority} size="small" />
        </Box>

        {/* Task Title */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.title}
        </Typography>

        {/* Due Date */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          mt: 1
        }}>
          <EventIcon 
            sx={{ 
              fontSize: '18px',
              color: isOverdue ? 'error.main' : 'text.secondary'
            }} 
          />
          <Typography 
            variant="body2"
            sx={{ 
              color: isOverdue ? 'error.main' : 'text.secondary',
              fontWeight: isOverdue ? 600 : 400
            }}
          >
            {dueDateText}
            {isOverdue && ' • Overdue'}
          </Typography>
        </Box>

        {/* Description (only show if exists) */}
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: '0.875rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Tags (only show if exists) */}
        {task.tags && task.tags.length > 0 && (
          <Box sx={{ 
            mt: 'auto', 
            pt: 1.5,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5
          }}>
            {task.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: '24px',
                  backgroundColor: theme.palette.action.selected,
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}