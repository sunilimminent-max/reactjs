import db from '../connection'
import { User, CreateUserInput, UpdateUserInput } from '../types'

export class UserModel {
  private table = 'users'

  async create(data: CreateUserInput): Promise<User> {
    const [id] = await db(this.table)
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
    
    const user = await this.findById(id)
    if (!user) {
      throw new Error('Failed to create user')
    }
    
    return user
  }

  async findById(id: number): Promise<User | null> {
    const user = await db(this.table)
      .where({ id })
      .first()
    
    return user || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await db(this.table)
      .where({ email })
      .first()
    
    return user || null
  }

  async findAll(): Promise<User[]> {
    return db(this.table)
      .select('*')
      .orderBy('created_at', 'desc')
  }

  async update(id: number, data: UpdateUserInput): Promise<User | null> {
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

  async findUsersByProject(projectId: number): Promise<User[]> {
    return db(this.table)
      .join('project_members', 'users.id', 'project_members.user_id')
      .where('project_members.project_id', projectId)
      .select('users.*')
  }

  async findProjectOwners(): Promise<User[]> {
    return db(this.table)
      .join('projects', 'users.id', 'projects.owner_id')
      .select('users.*')
      .distinct()
  }
} 