import db from '../connection'
import { Task, CreateTaskInput, UpdateTaskInput, TaskWithDetails } from '../types'

export class TaskRepository {
  private table = 'tasks'

  async create(data: CreateTaskInput): Promise<Task> {
    const [id] = await db(this.table)
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
    
    const task = await this.findById(id)
    if (!task) {
      throw new Error('Failed to create task')
    }
    
    return task
  }

  async findById(id: number): Promise<Task | null> {
    const task = await db(this.table)
      .where({ id })
      .first()
    
    return task || null
  }

  async findByIdWithDetails(id: number): Promise<TaskWithDetails | null> {
    const task = await db(this.table)
      .where({ 'tasks.id': id })
      .leftJoin('projects', 'tasks.project_id', 'projects.id')
      .leftJoin('users as assigned_user', 'tasks.assigned_to', 'assigned_user.id')
      .leftJoin('users as created_by_user', 'tasks.created_by', 'created_by_user.id')
      .select(
        'tasks.*',
        'projects.name as project_name',
        'assigned_user.name as assigned_user_name',
        'assigned_user.email as assigned_user_email',
        'created_by_user.name as created_by_user_name',
        'created_by_user.email as created_by_user_email'
      )
      .first()
    
    return task || null
  }

  async findByProject(projectId: number): Promise<Task[]> {
    return db(this.table)
      .where({ project_id: projectId })
      .orderBy('created_at', 'desc')
  }

  async findByAssignedUser(userId: number): Promise<Task[]> {
    return db(this.table)
      .where({ assigned_to: userId })
      .orderBy('due_date', 'asc')
      .orderBy('created_at', 'desc')
  }

  async findByStatus(status: Task['status']): Promise<Task[]> {
    return db(this.table)
      .where({ status })
      .orderBy('created_at', 'desc')
  }

  async findByPriority(priority: Task['priority']): Promise<Task[]> {
    return db(this.table)
      .where({ priority })
      .orderBy('due_date', 'asc')
      .orderBy('created_at', 'desc')
  }

  async findOverdueTasks(): Promise<Task[]> {
    return db(this.table)
      .where('due_date', '<', new Date())
      .whereNot('status', 'completed')
      .orderBy('due_date', 'asc')
  }

  async findAll(): Promise<Task[]> {
    return db(this.table)
      .select('*')
      .orderBy('created_at', 'desc')
  }

  async update(id: number, data: UpdateTaskInput): Promise<Task | null> {
    await db(this.table)
      .where({ id })
      .update({
        ...data,
        updated_at: new Date()
      })
    
    return this.findById(id)
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await db(this.table)
      .where({ id })
      .del()
    
    return deletedRows > 0
  }

  async getTaskStats(projectId?: number) {
    let query = db(this.table)
    
    if (projectId) {
      query = query.where({ project_id: projectId })
    }

    const stats = await query
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(CASE WHEN status = "pending" THEN 1 END) as pending'),
        db.raw('COUNT(CASE WHEN status = "in_progress" THEN 1 END) as in_progress'),
        db.raw('COUNT(CASE WHEN status = "completed" THEN 1 END) as completed'),
        db.raw('COUNT(CASE WHEN status = "cancelled" THEN 1 END) as cancelled')
      )
      .first()

    return stats
  }
} 