import db from '../connection';
import { CustomField, CreateCustomFieldInput, UpdateCustomFieldInput } from '../types';

export class CustomFieldRepository {
  async findByGroupId(groupId: number): Promise<CustomField[]> {
    try {
      const fields = await db('custom_fields')
        .where('field_group_id', groupId)
        .orderBy('menu_order', 'asc')
        .orderBy('name', 'asc');
      
      return fields;
    } catch (error) {
      console.error('Error fetching custom fields by group ID:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<CustomField | null> {
    try {
      const field = await db('custom_fields')
        .where('id', id)
        .first();
      
      return field || null;
    } catch (error) {
      console.error('Error fetching custom field by ID:', error);
      throw error;
    }
  }

  async findByKey(key: string): Promise<CustomField | null> {
    try {
      const field = await db('custom_fields')
        .where('key', key)
        .first();
      
      return field || null;
    } catch (error) {
      console.error('Error fetching custom field by key:', error);
      throw error;
    }
  }

  async create(data: CreateCustomFieldInput): Promise<CustomField> {
    try {
      const [field] = await db('custom_fields')
        .insert({
          ...data,
          menu_order: data.menu_order || 0,
          required: data.required || false,
          field_config: data.field_config ? JSON.stringify(data.field_config) : null,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      
      return field;
    } catch (error) {
      console.error('Error creating custom field:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateCustomFieldInput): Promise<CustomField | null> {
    try {
      const updateData: any = { ...data };
      if (data.field_config) {
        updateData.field_config = JSON.stringify(data.field_config);
      }
      updateData.updated_at = new Date();

      const [field] = await db('custom_fields')
        .where('id', id)
        .update(updateData)
        .returning('*');
      
      return field || null;
    } catch (error) {
      console.error('Error updating custom field:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deletedCount = await db('custom_fields')
        .where('id', id)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting custom field:', error);
      throw error;
    }
  }

  async updateMenuOrder(updates: { id: number; menu_order: number }[]): Promise<void> {
    try {
      for (const update of updates) {
        await db('custom_fields')
          .where('id', update.id)
          .update({ 
            menu_order: update.menu_order,
            updated_at: new Date()
          });
      }
    } catch (error) {
      console.error('Error updating menu order:', error);
      throw error;
    }
  }

  async deleteByGroupId(groupId: number): Promise<boolean> {
    try {
      const deletedCount = await db('custom_fields')
        .where('field_group_id', groupId)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting custom fields by group ID:', error);
      throw error;
    }
  }
} 