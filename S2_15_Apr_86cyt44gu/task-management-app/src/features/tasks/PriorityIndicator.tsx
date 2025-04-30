import { Chip, Tooltip } from '@mui/material'
import { TaskPriority } from '../../types/taskTypes'

interface PriorityIndicatorProps {
  priority: TaskPriority
  size?: 'small' | 'medium'
}

const priorityColors = {
  Low: 'success',
  Medium: 'warning',
  High: 'error',
} as const

export default function PriorityIndicator({ priority, size = 'medium' }: PriorityIndicatorProps) {
  return (
    <Tooltip title={`Priority: ${priority}`}>
      <Chip
        label={priority}
        color={priorityColors[priority]}
        size={size}
        sx={{
          height: size === 'small' ? 24 : 32,
          '& .MuiChip-label': {
            px: size === 'small' ? 1 : 1.5,
            fontWeight: 600
          }
        }}
      />
    </Tooltip>
  )
}