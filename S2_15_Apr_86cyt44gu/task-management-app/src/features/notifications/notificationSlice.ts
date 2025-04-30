import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const initialState: Notification[] = []

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      if (state.length >= 3) {
        state.shift() // Remove oldest notification if more than 3
      }
      state.push({ 
        ...action.payload, 
        id: Date.now().toString(),
        duration: action.payload.duration || 
                 (action.payload.type === 'error' ? 10000 : 6000)
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      return state.filter((n) => n.id !== action.payload)
    },
  },
})

export const { addNotification, removeNotification } = notificationSlice.actions

// Helper function for showing notifications
export const showNotification = (message: string, type: Notification['type']) => 
  addNotification({ message, type })

export default notificationSlice.reducer