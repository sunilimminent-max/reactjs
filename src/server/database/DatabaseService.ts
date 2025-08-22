import { UserRepository } from './repositories/UserModel'
import { ProjectRepository } from './repositories/ProjectRepository'
import { TaskRepository } from './repositories/TaskRepository'
import { ProjectMemberRepository } from './repositories/ProjectMemberRepository'
import db from './connection'

export class DatabaseService {
  public users: UserRepository
  public projects: ProjectRepository
  public tasks: TaskRepository
  public projectMembers: ProjectMemberRepository

  constructor() {
    this.users = new UserRepository()
    this.projects = new ProjectRepository()
    this.tasks = new TaskRepository()
    this.projectMembers = new ProjectMemberRepository()
  }

  // Database connection management
  async connect(): Promise<void> {
    try {
      await db.raw('SELECT 1')
      console.log('Database connected successfully')
    } catch (error) {
      console.error('Database connection failed:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    try {
      await db.destroy()
      console.log('Database disconnected successfully')
    } catch (error) {
      console.error('Database disconnection failed:', error)
      throw error
    }
  }

  // Transaction support
  async transaction<T>(callback: (trx: any) => Promise<T>): Promise<T> {
    return db.transaction(callback)
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await db.raw('SELECT 1')
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }

  // Get database statistics
  async getStats() {
    try {
      const [userCount] = await db('users').count('* as count')
      const [projectCount] = await db('projects').count('* as count')
      const [taskCount] = await db('tasks').count('* as count')
      const [memberCount] = await db('project_members').count('* as count')

      return {
        users: parseInt(userCount.count as string),
        projects: parseInt(projectCount.count as string),
        tasks: parseInt(taskCount.count as string),
        projectMembers: parseInt(memberCount.count as string)
      }
    } catch (error) {
      console.error('Failed to get database stats:', error)
      return null
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService() 