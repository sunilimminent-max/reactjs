import { BaseController } from './BaseController'
import { CustomFieldGroupRepository } from '../database/repositories/CustomFieldGroupRepository'
import { CustomFieldRepository } from '../database/repositories/CustomFieldRepository'
import { CustomFieldValueRepository } from '../database/repositories/CustomFieldValueRepository'
import { CreateCustomFieldGroupInput, UpdateCustomFieldGroupInput, CreateCustomFieldInput, UpdateCustomFieldInput } from '../database/types'

export class CustomFieldController extends BaseController {
  private fieldGroupRepo = new CustomFieldGroupRepository()
  private fieldRepo = new CustomFieldRepository()
  private fieldValueRepo = new CustomFieldValueRepository()

  // Field Group Methods
  async getFieldGroups(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      
      const groups = await this.fieldGroupRepo.findAll()
      
      this.success(groups, 'Field groups retrieved successfully')
    } catch (error) {
      console.error('Get field groups error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get field groups'
      this.error(message, 400)
    }
  }

  async createFieldGroup(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      const user = this.getAuthenticatedUser()
      
      const data: CreateCustomFieldGroupInput = this.getBody<CreateCustomFieldGroupInput>()
      
      if (!data.name || !data.key) {
        return this.error('Field group name and key are required')
      }

      const group = await this.fieldGroupRepo.create(data)
      
      this.success(group, 'Field group created successfully', 201)
    } catch (error) {
      console.error('Create field group error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create field group'
      this.error(message, 400)
    }
  }

  async updateFieldGroup(): Promise<void> {
    try {
      this.validateMethod(['PUT', 'PATCH'])
      
      await this.authenticate()
      
      const groupId = parseInt(this.getParam('id') || '')
      if (!groupId || isNaN(groupId)) {
        return this.error('Valid field group ID is required')
      }

      const data: UpdateCustomFieldGroupInput = this.getBody<UpdateCustomFieldGroupInput>()
      
      const group = await this.fieldGroupRepo.update(groupId, data)
      
      if (!group) {
        return this.error('Field group not found', 404)
      }

      this.success(group, 'Field group updated successfully')
    } catch (error) {
      console.error('Update field group error:', error)
      const message = error instanceof Error ? error.message : 'Failed to update field group'
      this.error(message, 400)
    }
  }

  async deleteFieldGroup(): Promise<void> {
    try {
      this.validateMethod(['DELETE'])
      
      await this.authenticate()
      
      const groupId = parseInt(this.getParam('id') || '')
      if (!groupId || isNaN(groupId)) {
        return this.error('Valid field group ID is required')
      }

      // Delete all fields in the group first
      await this.fieldRepo.deleteByGroupId(groupId)
      
      // Delete the group
      await this.fieldGroupRepo.delete(groupId)
      
      this.success({}, 'Field group deleted successfully')
    } catch (error) {
      console.error('Delete field group error:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete field group'
      this.error(message, 400)
    }
  }

  // Field Methods
  async getFieldsByGroup(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      await this.authenticate()
      
      const groupId = parseInt(this.getParam('id') || '')
      if (!groupId || isNaN(groupId)) {
        return this.error('Valid field group ID is required')
      }
      
      const fields = await this.fieldRepo.findByGroupId(groupId)
      
      this.success(fields, 'Fields retrieved successfully')
    } catch (error) {
      console.error('Get fields error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get fields'
      this.error(message, 400)
    }
  }

  async createField(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      
      const data: CreateCustomFieldInput = this.getBody<CreateCustomFieldInput>()
      
      if (!data.name || !data.key || !data.type || !data.label || !data.field_group_id) {
        return this.error('Field name, key, type, label, and group ID are required')
      }

      const field = await this.fieldRepo.create(data)
      
      this.success(field, 'Field created successfully', 201)
    } catch (error) {
      console.error('Create field error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create field'
      this.error(message, 400)
    }
  }

  async updateField(): Promise<void> {
    try {
      this.validateMethod(['PUT', 'PATCH'])
      
      await this.authenticate()
      
      const fieldId = parseInt(this.getParam('id') || '')
      if (!fieldId || isNaN(fieldId)) {
        return this.error('Valid field ID is required')
      }

      const data: UpdateCustomFieldInput = this.getBody<UpdateCustomFieldInput>()
      
      const field = await this.fieldRepo.update(fieldId, data)
      
      if (!field) {
        return this.error('Field not found', 404)
      }

      this.success(field, 'Field updated successfully')
    } catch (error) {
      console.error('Update field error:', error)
      const message = error instanceof Error ? error.message : 'Failed to update field'
      this.error(message, 400)
    }
  }

  async deleteField(): Promise<void> {
    try {
      this.validateMethod(['DELETE'])
      
      await this.authenticate()
      
      const fieldId = parseInt(this.getParam('id') || '')
      if (!fieldId || isNaN(fieldId)) {
        return this.error('Valid field ID is required')
      }

      // Delete all values for this field
      await this.fieldValueRepo.deleteByFieldId(fieldId)
      
      // Delete the field
      await this.fieldRepo.delete(fieldId)
      
      this.success({}, 'Field deleted successfully')
    } catch (error) {
      console.error('Delete field error:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete field'
      this.error(message, 400)
    }
  }

  // Field Values Methods
  async getFieldValues(): Promise<void> {
    try {
      this.validateMethod(['GET'])
      
      const postId = parseInt(this.getParam('postId') || '')
      if (!postId || isNaN(postId)) {
        return this.error('Valid post ID is required')
      }
      
      const values = await this.fieldValueRepo.findByPostId(postId)
      
      this.success(values, 'Field values retrieved successfully')
    } catch (error) {
      console.error('Get field values error:', error)
      const message = error instanceof Error ? error.message : 'Failed to get field values'
      this.error(message, 400)
    }
  }

  async saveFieldValues(): Promise<void> {
    try {
      this.validateMethod(['POST'])
      
      await this.authenticate()
      
      const postId = parseInt(this.getParam('postId') || '')
      if (!postId || isNaN(postId)) {
        return this.error('Valid post ID is required')
      }

      const data = this.getBody<{ [fieldId: string]: any }>()
      
      // Save each field value
      for (const [fieldId, value] of Object.entries(data)) {
        if (value !== null && value !== undefined && value !== '') {
          await this.fieldValueRepo.upsert(postId, parseInt(fieldId), JSON.stringify(value))
        }
      }
      
      this.success({}, 'Field values saved successfully')
    } catch (error) {
      console.error('Save field values error:', error)
      const message = error instanceof Error ? error.message : 'Failed to save field values'
      this.error(message, 400)
    }
  }
} 