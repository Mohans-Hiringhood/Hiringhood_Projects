import { Task } from '../types/taskTypes'

const TASKS_KEY = 'task-management-app-tasks'

export const loadTasks = (): Task[] => {
  const data = localStorage.getItem(TASKS_KEY)
  return data ? JSON.parse(data) : []
}

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}