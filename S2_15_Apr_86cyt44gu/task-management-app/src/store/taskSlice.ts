import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task } from '../types/taskTypes'
import { loadTasks, saveTasks } from '../utils/storage'

interface TasksState {
  tasks: Task[]
  filters: {
    status: string | null
    priority: string | null
  }
  searchQuery: string
  isLoading: boolean
}

const initialState: TasksState = {
  tasks: loadTasks(),
  filters: {
    status: null,
    priority: null,
  },
  searchQuery: '',
  isLoading: false
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) state.tasks[index] = action.payload
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload
    },
    setPriorityFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.priority = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.filters = { status: null, priority: null }
      state.searchQuery = ''
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => action.type.startsWith('tasks/'),
      (state) => {
        saveTasks(state.tasks)
      }
    )
  },
})

// Export all action creators
export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  setStatusFilter, 
  setPriorityFilter,
  setSearchQuery,
  clearFilters,
  setLoading
} = tasksSlice.actions

// Export selectors
export const selectTasks = (state: { tasks: TasksState }) => state.tasks.tasks
export const selectFilters = (state: { tasks: TasksState }) => state.tasks.filters
export const selectSearchQuery = (state: { tasks: TasksState }) => state.tasks.searchQuery
export const selectIsLoading = (state: { tasks: TasksState }) => state.tasks.isLoading

export default tasksSlice.reducer