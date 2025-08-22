import { BaseController } from './BaseController'
import { TaskService } from '../services/TaskService'
import { CreateTaskInput, UpdateTaskInput } from '../database/types'

export class TaskController extends BaseController {
  private taskService = new TaskService()

  async createTask(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const data: CreateTaskInput = this.getBody<CreateTaskInput>()
      data.created_by = user.id

      if (!data.title || !data.project_id) {
        return this.error('Task title and project ID are required')
      }

      const task = await this.taskService.createTask(data, user.id)
      this.success(task, 'Task created successfully', 201)
    } catch (error) {
      console.error('Create task error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create task'
      this.error(message, 400)
    }
  }

  async getTask(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const taskId = parseInt(this.getParam('id') || '')
      if (!taskId || isNaN(taskId)) {
        return this.error('Valid task ID is required')
      }

      const task = await this.taskService.getTaskById(taskId, user.id)
      this.success(task, 'Task retrieved successfully')
    } catch (error) {
      console.error('Get task error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get task'
      this.error(message, 404)
    }
  }

  async getProjectTasks(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const projectId = parseInt(this.getParam('projectId') || '')
      if (!projectId || isNaN(projectId)) {
        return this.error('Valid project ID is required')
      }

      const tasks = await this.taskService.getProjectTasks(projectId, user.id)
      this.success(tasks, 'Project tasks retrieved successfully')
    } catch (error) {
      console.error('Get project tasks error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get project tasks'
      this.error(message, 400)
    }
  }

  async getUserTasks(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()

      const tasks = await this.taskService.getUserTasks(user.id)
      this.success(tasks, 'User tasks retrieved successfully')
    } catch (error) {
      console.error('Get user tasks error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get user tasks'
      this.error(message, 400)
    }
  }

  async updateTask(): Promise<void> {
    try {
      this.validateMethod(['PUT', 'PATCH'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const taskId = parseInt(this.getParam('id') || '')
      if (!taskId || isNaN(taskId)) {
        return this.error('Valid task ID is required')
      }

      const data: UpdateTaskInput = this.getBody<UpdateTaskInput>()
      
      const task = await this.taskService.updateTask(taskId, data, user.id)
      this.success(task, 'Task updated successfully')
    } catch (error) {
      console.error('Update task error:', error)
      const message = error instanceof Error ? error.message : 'Failed to update task'
      this.error(message, 400)
    }
  }

  async deleteTask(): Promise<void> {
    try {
      this.validateMethod(['DELETE'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const taskId = parseInt(this.getParam('id') || '')
      if (!taskId || isNaN(taskId)) {
        return this.error('Valid task ID is required')
      }

      const deleted = await this.taskService.deleteTask(taskId, user.id)
      if (deleted) {
        this.success({ deleted: true }, 'Task deleted successfully')
      } else {
        this.error('Failed to delete task', 400)
      }
    } catch (error) {
      console.error('Delete task error:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete task'
      this.error(message, 400)
    }
  }

  async assignTask(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const taskId = parseInt(this.getParam('id') || '')
      if (!taskId || isNaN(taskId)) {
        return this.error('Valid task ID is required')
      }

      const { assignedTo } = this.getBody<{ assignedTo: number }>()
      if (!assignedTo || isNaN(assignedTo)) {
        return this.error('Valid assigned user ID is required')
      }

      const task = await this.taskService.assignTask(taskId, assignedTo, user.id)
      this.success(task, 'Task assigned successfully')
    } catch (error) {
      console.error('Assign task error:', error)
      const message = error instanceof Error ? error.message : 'Failed to assign task'
      this.error(message, 400)
    }
  }

  async getTasksByStatus(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const status = this.getParam('status') as 'pending' | 'in_progress' | 'completed' | 'cancelled'
      if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return this.error('Valid status is required')
      }

      const tasks = await this.taskService.getTasksByStatus(status, user.id)
      this.success(tasks, `Tasks with status '${status}' retrieved successfully`)
    } catch (error) {
      console.error('Get tasks by status error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get tasks by status'
      this.error(message, 400)
    }
  }
} 