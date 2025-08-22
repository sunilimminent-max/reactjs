import { BaseController } from './BaseController'
import { ProjectService } from '../services/ProjectService'
import { CreateProjectInput, UpdateProjectInput, CreateProjectMemberInput } from '../database/types'

export class ProjectController extends BaseController {
  private projectService = new ProjectService()

  async createProject(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const data: CreateProjectInput = this.getBody<CreateProjectInput>()
      data.owner_id = user.id

      if (!data.name) {
        return this.error('Project name is required')
      }

      const project = await this.projectService.createProject(data)
      this.success(project, 'Project created successfully', 201)
    } catch (error) {
      console.error('Create project error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create project'
      this.error(message, 400)
    }
  }

  async getProject(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const projectId = parseInt(this.getParam('id') || '')
      if (!projectId || isNaN(projectId)) {
        return this.error('Valid project ID is required')
      }

      const project = await this.projectService.getProjectById(projectId, user.id)
      this.success(project, 'Project retrieved successfully')
    } catch (error) {
      console.error('Get project error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get project'
      this.error(message, 404)
    }
  }

  async getUserProjects(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()

      const projects = await this.projectService.getUserProjects(user.id)
      this.success(projects, 'Projects retrieved successfully')
    } catch (error) {
      console.error('Get user projects error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get projects'
      this.error(message, 400)
    }
  }

  async updateProject(): Promise<void> {
    try {
      this.validateMethod(['PUT', 'PATCH'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const projectId = parseInt(this.getParam('id') || '')
      if (!projectId || isNaN(projectId)) {
        return this.error('Valid project ID is required')
      }

      const data: UpdateProjectInput = this.getBody<UpdateProjectInput>()
      
      const project = await this.projectService.updateProject(projectId, data, user.id)
      this.success(project, 'Project updated successfully')
    } catch (error) {
      console.error('Update project error:', error)
      const message = error instanceof Error ? error.message : 'Failed to update project'
      this.error(message, 400)
    }
  }

  async deleteProject(): Promise<void> {
    try {
      this.validateMethod(['DELETE'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const projectId = parseInt(this.getParam('id') || '')
      if (!projectId || isNaN(projectId)) {
        return this.error('Valid project ID is required')
      }

      const deleted = await this.projectService.deleteProject(projectId, user.id)
      if (deleted) {
        this.success({ deleted: true }, 'Project deleted successfully')
      } else {
        this.error('Failed to delete project', 400)
      }
    } catch (error) {
      console.error('Delete project error:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete project'
      this.error(message, 400)
    }
  }

  async addProjectMember(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const projectId = parseInt(this.getParam('id') || '')
      if (!projectId || isNaN(projectId)) {
        return this.error('Valid project ID is required')
      }

      const data: CreateProjectMemberInput = this.getBody<CreateProjectMemberInput>()
      data.project_id = projectId

      if (!data.user_id) {
        return this.error('User ID is required')
      }

      const member = await this.projectService.addProjectMember(projectId, data, user.id)
      this.success(member, 'Member added successfully', 201)
    } catch (error) {
      console.error('Add project member error:', error)
      const message = error instanceof Error ? error.message : 'Failed to add member'
      this.error(message, 400)
    }
  }

  async removeProjectMember(): Promise<void> {
    try {
      this.validateMethod(['DELETE'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const projectId = parseInt(this.getParam('id') || '')
      if (!projectId || isNaN(projectId)) {
        return this.error('Valid project ID is required')
      }

      const memberUserId = parseInt(this.getParam('userId') || '')
      if (!memberUserId || isNaN(memberUserId)) {
        return this.error('Valid user ID is required')
      }

      const removed = await this.projectService.removeProjectMember(projectId, memberUserId, user.id)
      if (removed) {
        this.success({ removed: true }, 'Member removed successfully')
      } else {
        this.error('Failed to remove member', 400)
      }
    } catch (error) {
      console.error('Remove project member error:', error)
      const message = error instanceof Error ? error.message : 'Failed to remove member'
      this.error(message, 400)
    }
  }

  async getProjectMembers(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const projectId = parseInt(this.getParam('id') || '')
      if (!projectId || isNaN(projectId)) {
        return this.error('Valid project ID is required')
      }

      const members = await this.projectService.getProjectMembersWithUsers(projectId, user.id)
      this.success(members, 'Project members retrieved successfully')
    } catch (error) {
      console.error('Get project members error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get project members'
      this.error(message, 400)
    }
  }
} 