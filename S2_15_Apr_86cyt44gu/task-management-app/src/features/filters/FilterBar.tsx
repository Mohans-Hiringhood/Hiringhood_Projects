import { Box, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { 
  setStatusFilter, 
  setPriorityFilter,
  clearFilters
} from '../../store/taskSlice'
import ClearIcon from '@mui/icons-material/Clear'

export default function FilterBar() {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.tasks)

  const handleStatusChange = (e: any) => {
    const value = e.target.value === '' ? null : e.target.value
    dispatch(setStatusFilter(value))
  }

  const handlePriorityChange = (e: any) => {
    const value = e.target.value === '' ? null : e.target.value
    dispatch(setPriorityFilter(value))
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          value={filters.status || ''}
          onChange={handleStatusChange}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider'
            }
          }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="In Review">In Review</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel>Priority</InputLabel>
        <Select
          label="Priority"
          value={filters.priority || ''}
          onChange={handlePriorityChange}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider'
            }
          }}
        >
          <MenuItem value="">All Priority</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>

      {(filters.status || filters.priority) && (
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={() => dispatch(clearFilters())}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            borderColor: 'divider',
            color: 'text.secondary'
          }}
        >
          Clear
        </Button>
      )}
    </Box>
  )
}