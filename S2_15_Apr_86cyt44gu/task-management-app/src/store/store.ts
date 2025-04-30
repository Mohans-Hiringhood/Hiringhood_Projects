import { configureStore } from '@reduxjs/toolkit'
import taskReducer from './taskSlice'
import notificationReducer from '../features/notifications/notificationSlice'
import { 
  TypedUseSelectorHook, 
  useDispatch, 
  useSelector 
} from 'react-redux'

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    notifications: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector