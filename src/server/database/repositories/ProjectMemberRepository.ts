import db from '../connection'
import { ProjectMember, CreateProjectMemberInput } from '../types'

export class ProjectMemberRepository {
  private table = 'project_members'

  async create(data: CreateProjectMemberInput): Promise<ProjectMember> {
    const [id] = await db(this.table)
      .insert({
        ...data,
        created_at: new Date()
      })
    
    const member = await this.findById(id)
    if (!member) {
      throw new Error('Failed to create project member')
    }
    
    return member
  }

  async findById(id: number): Promise<ProjectMember | null> {
    const member = await db(this.table)
      .where({ id })
      .first()
    
    return member || null
  }

  async findByProject(projectId: number): Promise<ProjectMember[]> {
    return db(this.table)
      .where({ project_id: projectId })
      .orderBy('created_at', 'asc')
  }

  async findByUser(userId: number): Promise<ProjectMember[]> {
    return db(this.table)
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
  }

  async findByProjectAndUser(projectId: number, userId: number): Promise<ProjectMember | null> {
    const member = await db(this.table)
      .where({ project_id: projectId, user_id: userId })
      .first()
    
    return member || null
  }

  async updateRole(projectId: number, userId: number, role: ProjectMember['role']): Promise<ProjectMember | null> {
    await db(this.table)
      .where({ project_id: projectId, user_id: userId })
      .update({ role })
    
    return this.findByProjectAndUser(projectId, userId)
  }

  async removeMember(projectId: number, userId: number): Promise<boolean> {
    const deletedRows = await db(this.table)
      .where({ project_id: projectId, user_id: userId })
      .del()
    
    return deletedRows > 0
  }

  async removeAllProjectMembers(projectId: number): Promise<boolean> {
    const deletedRows = await db(this.table)
      .where({ project_id: projectId })
      .del()
    
    return deletedRows > 0
  }

  async getProjectMembersWithUserDetails(projectId: number) {
    return db(this.table)
      .join('users', 'project_members.user_id', 'users.id')
      .where('project_members.project_id', projectId)
      .select(
        'project_members.*',
        'users.name as user_name',
        'users.email as user_email'
      )
      .orderBy('project_members.created_at', 'asc')
  }

  async getUserProjectsWithDetails(userId: number) {
    return db(this.table)
      .join('projects', 'project_members.project_id', 'projects.id')
      .where('project_members.user_id', userId)
      .select(
        'project_members.*',
        'projects.name as project_name',
        'projects.description as project_description',
        'projects.status as project_status'
      )
      .orderBy('projects.created_at', 'desc')
  }
} 