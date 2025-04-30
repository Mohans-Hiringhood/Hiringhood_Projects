import { Formik, Form, Field } from 'formik'
import { 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Stack, 
  Chip, 
  InputLabel, 
  FormControl, 
  Autocomplete,
  Box,
  Typography,
  useTheme
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import * as Yup from 'yup'
import { Task, TaskPriority, TaskStatus } from '../../types/taskTypes'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { addTask, updateTask } from '../../store/taskSlice'
import { useNavigate } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

interface TaskFormProps {
  isEditing: boolean
  taskId?: string
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  dueDate: Yup.date().min(new Date(), 'Due date must be in the future'),
  priority: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  status: Yup.string().oneOf(['To Do', 'In Progress', 'In Review', 'Done']).required(),
  tags: Yup.array().of(Yup.string()),
})

export default function TaskForm({ isEditing, taskId }: TaskFormProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const { tasks } = useAppSelector((state) => state.tasks)
  
  const taskToEdit = taskId ? tasks.find((t) => t.id === taskId) : null

  const initialValues: Task = taskToEdit || {
    id: '',
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
    priority: 'Medium' as TaskPriority,
    status: 'To Do' as TaskStatus,
    tags: [],
  }

  const handleSubmit = (values: Task) => {
    if (isEditing && taskId) {
      dispatch(updateTask({ ...values, id: taskId }))
    } else {
      dispatch(addTask({ ...values, id: Date.now().toString() }))
    }
    navigate('/')
  }

  const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High']
  const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'In Review', 'Done']
  const tagOptions = ['Urgent', 'Backlog', 'Feature', 'Bug', 'Documentation']

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{
        maxWidth: '800px',
        margin: '0 auto',
        p: 4,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: theme.shadows[2]
      }}>
        <Typography variant="h4" sx={{ 
          mb: 4,
          fontWeight: 600,
          color: theme.palette.text.primary,
          textAlign: 'center'
        }}>
          {isEditing ? 'Edit Task' : 'Create New Task'}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <Stack spacing={3}>
                {/* Title Field */}
                <Field
                  as={TextField}
                  name="title"
                  label="Task Title"
                  error={touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: theme.palette.divider,
                      },
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />

                {/* Description Field */}
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  multiline
                  rows={5}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    },
                  }}
                />

                {/* Due Date Field */}
                <Field name="dueDate">
                  {({ field, form }: any) => (
                    <DatePicker
                      label="Due Date"
                      value={new Date(field.value)}
                      onChange={(date) => form.setFieldValue('dueDate', date?.toISOString())}
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          error: touched.dueDate && !!errors.dueDate,
                          helperText: touched.dueDate && errors.dueDate,
                          fullWidth: true,
                          variant: 'outlined',
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                            },
                          }
                        }
                      }}
                    />
                  )}
                </Field>

                {/* Priority and Status Row */}
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {/* Priority Field */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ 
                      backgroundColor: theme.palette.background.paper,
                      px: 1,
                      borderRadius: 1
                    }}>
                      Priority
                    </InputLabel>
                    <Field
                      as={Select}
                      name="priority"
                      label="Priority"
                      error={touched.priority && !!errors.priority}
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                      }}
                    >
                      {priorityOptions.map((option) => (
                        <MenuItem key={option} value={option} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: 
                              option === 'High' ? 'error.main' :
                              option === 'Medium' ? 'warning.main' : 'success.main',
                            mr: 1.5
                          }} />
                          {option}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>

                  {/* Status Field */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ 
                      backgroundColor: theme.palette.background.paper,
                      px: 1,
                      borderRadius: 1
                    }}>
                      Status
                    </InputLabel>
                    <Field
                      as={Select}
                      name="status"
                      label="Status"
                      error={touched.status && !!errors.status}
                      variant="outlined"
                      sx={{
                        borderRadius: '12px',
                      }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          <Chip
                            label={option}
                            size="small"
                            sx={{
                              backgroundColor:
                                option === 'Done' ? 'success.light' :
                                option === 'In Progress' ? 'info.light' :
                                option === 'In Review' ? 'warning.light' : 'grey.200',
                              color: 'text.primary',
                              mr: 1.5
                            }}
                          />
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Box>

                {/* Tags Field */}
                <Autocomplete
                  multiple
                  freeSolo
                  options={tagOptions}
                  value={values.tags || []}
                  onChange={(_, newValue) => setFieldValue('tags', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                      placeholder="Add tags"
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                        sx={{
                          borderRadius: '6px',
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.contrastText,
                          mr: 1,
                          my: 0.5
                        }}
                      />
                    ))
                  }
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isEditing ? 'Update Task' : 'Create Task'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </LocalizationProvider>
  )
}