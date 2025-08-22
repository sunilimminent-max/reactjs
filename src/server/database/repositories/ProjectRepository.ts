import db from '../connection'
import { Project, CreateProjectInput, UpdateProjectInput, ProjectWithDetails } from '../types'

export class ProjectRepository {
  private table = 'projects'

  async create(data: CreateProjectInput): Promise<Project> {
    const [id] = await db(this.table)
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      })
    
    const project = await this.findById(id)
    if (!project) {
      throw new Error('Failed to create project')
    }
    
    return project
  }

  async findById(id: number): Promise<Project | null> {
    const project = await db(this.table)
      .where({ id })
      .first()
    
    return project || null
  }

  async findByIdWithDetails(id: number): Promise<ProjectWithDetails | null> {
    const project = await db(this.table)
      .where({ 'projects.id': id })
      .leftJoin('users as owner', 'projects.owner_id', 'owner.id')
      .leftJoin('project_members', 'projects.id', 'project_members.project_id')
      .leftJoin('users as members', 'project_members.user_id', 'members.id')
      .leftJoin('tasks', 'projects.id', 'tasks.project_id')
      .select(
        'projects.*',
        'owner.name as owner_name',
        'owner.email as owner_email',
        db.raw('COUNT(DISTINCT tasks.id) as task_count'),
        db.raw('COUNT(DISTINCT CASE WHEN tasks.status = "completed" THEN tasks.id END) as completed_task_count')
      )
      .groupBy('projects.id', 'owner.id')
      .first()
    
    return project || null
  }

  async findByOwner(ownerId: number): Promise<Project[]> {
    return db(this.table)
      .where({ owner_id: ownerId })
      .orderBy('created_at', 'desc')
  }

  async findByMember(userId: number): Promise<Project[]> {
    return db(this.table)
      .join('project_members', 'projects.id', 'project_members.project_id')
      .where('project_members.user_id', userId)
      .select('projects.*')
      .orderBy('projects.created_at', 'desc')
  }

  async findAll(): Promise<Project[]> {
    return db(this.table)
      .select('*')
      .orderBy('created_at', 'desc')
  }

  async update(id: number, data: UpdateProjectInput): Promise<Project | null> {
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

  async findActiveProjects(): Promise<Project[]> {
    return db(this.table)
      .where({ status: 'active' })
      .orderBy('created_at', 'desc')
  }

  async findProjectsByStatus(status: Project['status']): Promise<Project[]> {
    return db(this.table)
      .where({ status })
      .orderBy('created_at', 'desc')
  }
} 