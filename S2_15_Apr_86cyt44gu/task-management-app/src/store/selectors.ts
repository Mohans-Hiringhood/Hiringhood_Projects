import { RootState } from './store'

export const selectFilteredTasks = (state: RootState) => {
  const { tasks, filters } = state.tasks
  return tasks.filter((task) => {
    const statusMatch = !filters.status || task.status === filters.status
    const priorityMatch = !filters.priority || task.priority === filters.priority
    return statusMatch && priorityMatch
  })
}