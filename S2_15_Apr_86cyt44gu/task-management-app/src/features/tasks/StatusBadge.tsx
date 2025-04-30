import { Chip, Tooltip } from '@mui/material'
import { TaskStatus } from '../../types/taskTypes'
import {
  CheckCircleOutline as DoneIcon,
  PlayCircleOutline as InProgressIcon,
  RateReview as InReviewIcon,
  RadioButtonUnchecked as TodoIcon
} from '@mui/icons-material'

interface StatusBadgeProps {
  status: TaskStatus
  size?: 'small' | 'medium'
}

const statusColors = {
  'To Do': 'default',
  'In Progress': 'primary',
  'In Review': 'secondary',
  'Done': 'success',
} as const

const statusIcons = {
  'To Do': <TodoIcon fontSize="small" />,
  'In Progress': <InProgressIcon fontSize="small" />,
  'In Review': <InReviewIcon fontSize="small" />,
  'Done': <DoneIcon fontSize="small" />
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  return (
    <Tooltip title={`Status: ${status}`}>
      <Chip
        label={status}
        color={statusColors[status]}
        size={size}
        variant="outlined"
        icon={statusIcons[status]}
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