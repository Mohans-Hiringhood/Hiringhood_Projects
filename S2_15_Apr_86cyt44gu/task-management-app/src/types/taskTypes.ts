export type TaskStatus = 'To Do' | 'In Progress' | 'In Review' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  tags?: string[]
}