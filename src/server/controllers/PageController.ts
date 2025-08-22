import { BaseController } from './BaseController'
import { PostRepository } from '../database/repositories/PostRepository'
import { PostMetaRepository } from '../database/repositories/PostMetaRepository'

interface CreatePageInput {
  title: string
  content: string
  slug?: string
  status?: 'draft' | 'publish' | 'private'
  template?: string
  meta?: Record<string, any>
  customFields?: {
    sectionTitle?: string
    subtitle?: string
    excerpt?: string
    featuredImage?: string
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    [key: string]: any
  }
}

interface UpdatePageInput {
  title?: string
  content?: string
  slug?: string
  status?: 'draft' | 'publish' | 'private'
  template?: string
  meta?: Record<string, any>
  customFields?: {
    sectionTitle?: string
    subtitle?: string
    excerpt?: string
    featuredImage?: string
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string
    [key: string]: any
  }
}

export class PageController extends BaseController {
  private postRepository = new PostRepository()
  private postMetaRepository = new PostMetaRepository()

  async createPage(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const data: CreatePageInput = this.getBody<CreatePageInput>()
      
      if (!data.title || !data.content) {
        return this.error('Page title and content are required')
      }

      // Generate slug if not provided
      if (!data.slug) {
        data.slug = this.generateSlug(data.title)
      }

      // Set default values
      const pageData = {
        title: data.title,
        content: data.content,
        name: data.slug,
        status: data.status || 'draft',
        type: 'page' as const,
        author_id: user.id
      }

      const page = await this.postRepository.create(pageData)
      
      // Save meta data if provided
      if (data.meta) {
        for (const [key, value] of Object.entries(data.meta)) {
          await this.postMetaRepository.create(page.id, key, JSON.stringify(value))
        }
      }

      // Save custom fields as meta data
      if (data.customFields) {
        for (const [key, value] of Object.entries(data.customFields)) {
          if (value) { // Only save non-empty values
            await this.postMetaRepository.create(page.id, `custom_${key}`, JSON.stringify(value))
          }
        }
      }

      this.success(page, 'Page created successfully', 200)
    } catch (error) {
      console.error('Create page error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create page'
      this.error(message, 400)
    }
  }

  async getPages(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      
      const query = this.getQuery() as any
      const page = parseInt(query.page || '1')
      const limit = parseInt(query.limit || '10')
      const status = query.status || 'publish'
      
      const offset = (page - 1) * limit
      
      const pages = await this.postRepository.findAll(limit, offset, status)
      // Filter pages only (we'll need to add a method to count by type)
      const pagePosts = pages.filter(p => p.type === 'page')
      
      this.success({
        pages: pagePosts,
        pagination: {
          page,
          limit,
          total: pagePosts.length,
          pages: Math.ceil(pagePosts.length / limit)
        }
      }, 'Pages retrieved successfully')
    } catch (error) {
      console.error('Get pages error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get pages'
      this.error(message, 400)
    }
  }

  async getPage(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      const pageId = parseInt(this.getParam('id') || '')
      const slug = this.getParam('slug')
      
      let page
      if (pageId && !isNaN(pageId)) {
        page = await this.postRepository.findById(pageId)
      } else if (slug) {
        page = await this.postRepository.findBySlug(slug)
      } else {
        return this.error('Page ID or slug is required')
      }
      
      if (!page || page.type !== 'page') {
        return this.error('Page not found', 404)
      }

      // Get page meta
      const meta = await this.postMetaRepository.findByPostId(page.id)
      
      // Organize custom fields
      const customFields: Record<string, any> = {}
      const regularMeta: Record<string, any> = {}
      
      meta.forEach(item => {
        if (item.meta_key.startsWith('custom_')) {
          const key = item.meta_key.replace('custom_', '')
          try {
            customFields[key] = JSON.parse(item.meta_value)
          } catch {
            customFields[key] = item.meta_value
          }
        } else {
          try {
            regularMeta[item.meta_key] = JSON.parse(item.meta_value)
          } catch {
            regularMeta[item.meta_key] = item.meta_value
          }
        }
      })
      
      this.success({
        ...page,
        meta: regularMeta,
        customFields
      }, 'Page retrieved successfully')
    } catch (error) {
      console.error('Get page error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get page'
      this.error(message, 404)
    }
  }

  async updatePage(): Promise<void> {
    try {
      this.validateMethod(['PUT', 'PATCH'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const pageId = parseInt(this.getParam('id') || '')
      if (!pageId || isNaN(pageId)) {
        return this.error('Valid page ID is required')
      }

      const data: UpdatePageInput = this.getBody<UpdatePageInput>()
      
      // Check if user can edit this page
      const existingPage = await this.postRepository.findById(pageId)
      if (!existingPage || existingPage.type !== 'page') {
        return this.error('Page not found', 404)
      }

      if (existingPage.author_id !== user.id) {
        return this.error('You can only edit your own pages', 403)
      }

      // Generate slug if title changed and slug not provided
      if (data.title && !data.slug) {
        data.slug = this.generateSlug(data.title)
      }

      const updateData = {
        title: data.title,
        content: data.content,
        name: data.slug,
        status: data.status
      }

      const page = await this.postRepository.update(pageId, updateData)
      
      // Update meta data if provided
      if (data.meta) {
        // Remove existing meta
        await this.postMetaRepository.deleteByPostId(pageId)
        
        // Add new meta
        for (const [key, value] of Object.entries(data.meta)) {
          await this.postMetaRepository.create(pageId, key, JSON.stringify(value))
        }
      }

      // Update custom fields if provided
      if (data.customFields) {
        // Remove existing custom fields
        const existingMeta = await this.postMetaRepository.findByPostId(pageId)
        for (const meta of existingMeta) {
          if (meta.meta_key.startsWith('custom_')) {
            await this.postMetaRepository.delete(pageId, meta.meta_key)
          }
        }
        
        // Add new custom fields
        for (const [key, value] of Object.entries(data.customFields)) {
          if (value) { // Only save non-empty values
            await this.postMetaRepository.create(pageId, `custom_${key}`, JSON.stringify(value))
          }
        }
      }

      this.success(page, 'Page updated successfully')
    } catch (error) {
      console.error('Update page error:', error)
      const message = error instanceof Error ? error.message : 'Failed to update page'
      this.error(message, 400)
    }
  }

  async deletePage(): Promise<void> {
    try {
      this.validateMethod(['DELETE'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const pageId = parseInt(this.getParam('id') || '')
      if (!pageId || isNaN(pageId)) {
        return this.error('Valid page ID is required')
      }

      // Check if user can delete this page
      const existingPage = await this.postRepository.findById(pageId)
      if (!existingPage || existingPage.type !== 'page') {
        return this.error('Page not found', 404)
      }

      if (existingPage.author_id !== user.id) {
        return this.error('You can only delete your own pages', 403)
      }

      await this.postRepository.delete(pageId)
      
      this.success({}, 'Page deleted successfully')
    } catch (error) {
      console.error('Delete page error:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete page'
      this.error(message, 400)
    }
  }

  async getHomePage(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      // Try to find existing home page
      let homePage = await this.postRepository.findBySlug('home')
      
      if (!homePage) {
        // Create default home page if it doesn't exist
        homePage = await this.postRepository.create({
          title: 'Home',
          content: 'Welcome to our project management platform',
          name: 'home',
          status: 'publish',
          type: 'page',
          author_id: 1 // Default author
        })
      }

      // Get page meta and custom fields
      const meta = await this.postMetaRepository.findByPostId(homePage.id)
      
      // Organize custom fields
      const customFields: Record<string, any> = {}
      const regularMeta: Record<string, any> = {}
      
      meta.forEach(item => {
        if (item.meta_key.startsWith('custom_')) {
          const key = item.meta_key.replace('custom_', '')
          try {
            customFields[key] = JSON.parse(item.meta_value)
          } catch {
            customFields[key] = item.meta_value
          }
        } else {
          try {
            regularMeta[item.meta_key] = JSON.parse(item.meta_value)
          } catch {
            regularMeta[item.meta_key] = item.meta_value
          }
        }
      })
      
      this.success({
        ...homePage,
        meta: regularMeta,
        customFields
      }, 'Home page retrieved successfully')
    } catch (error) {
      console.error('Get home page error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get home page'
      this.error(message, 400)
    }
  }

  async updateHomePage(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      // Find or create home page
      let homePage = await this.postRepository.findBySlug('home')
      
      if (!homePage) {
        // Create new home page
        homePage = await this.postRepository.create({
          title: 'Home',
          content: 'Welcome to our project management platform',
          name: 'home',
          status: 'publish',
          type: 'page',
          author_id: user.id
        })
      }

      const data = this.getBody<any>()
      
      // Update page content if provided
      if (data.content) {
        await this.postRepository.update(homePage.id, {
          content: data.content
        })
      }

      // Update custom fields
      if (data.customFields) {
        // Remove existing custom fields
        const existingMeta = await this.postMetaRepository.findByPostId(homePage.id)
        for (const meta of existingMeta) {
          if (meta.meta_key.startsWith('custom_')) {
            await this.postMetaRepository.delete(homePage.id, meta.meta_key)
          }
        }
        
        // Add new custom fields
        for (const [key, value] of Object.entries(data.customFields)) {
          if (value) { // Only save non-empty values
            await this.postMetaRepository.create(homePage.id, `custom_${key}`, JSON.stringify(value))
          }
        }
      }

      // Get updated page
      const updatedPage = await this.postRepository.findById(homePage.id)
      const meta = await this.postMetaRepository.findByPostId(homePage.id)
      
      // Organize custom fields
      const customFields: Record<string, any> = {}
      meta.forEach(item => {
        if (item.meta_key.startsWith('custom_')) {
          const key = item.meta_key.replace('custom_', '')
          try {
            customFields[key] = JSON.parse(item.meta_value)
          } catch {
            customFields[key] = item.meta_value
          }
        }
      })
      
      this.success({
        ...updatedPage,
        customFields
      }, 'Home page updated successfully')
    } catch (error) {
      console.error('Update home page error:', error)
      const message = error instanceof Error ? error.message : 'Failed to update home page'
      this.error(message, 400)
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
} 