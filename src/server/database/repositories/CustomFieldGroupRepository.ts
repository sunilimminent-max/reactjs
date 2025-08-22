import db from '../connection';
import { CustomFieldGroup, CreateCustomFieldGroupInput, UpdateCustomFieldGroupInput } from '../types';

export class CustomFieldGroupRepository {
  async findAll(): Promise<CustomFieldGroup[]> {
    try {
      const groups = await db('custom_field_groups')
        .where('active', true)
        .orderBy('menu_order', 'asc')
        .orderBy('name', 'asc');
      
      return groups;
    } catch (error) {
      console.error('Error fetching custom field groups:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<CustomFieldGroup | null> {
    try {
      const group = await db('custom_field_groups')
        .where('id', id)
        .first();
      
      return group || null;
    } catch (error) {
      console.error('Error fetching custom field group by ID:', error);
      throw error;
    }
  }

  async findByKey(key: string): Promise<CustomFieldGroup | null> {
    try {
      const group = await db('custom_field_groups')
        .where('key', key)
        .where('active', true)
        .first();
      
      return group || null;
    } catch (error) {
      console.error('Error fetching custom field group by key:', error);
      throw error;
    }
  }

  async create(data: CreateCustomFieldGroupInput): Promise<CustomFieldGroup> {
    try {
      const [group] = await db('custom_field_groups')
        .insert({
          ...data,
          menu_order: data.menu_order || 0,
          active: data.active !== undefined ? data.active : true,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      
      return group;
    } catch (error) {
      console.error('Error creating custom field group:', error);
      throw error;
    }
  }

  async update(id: number, data: UpdateCustomFieldGroupInput): Promise<CustomFieldGroup | null> {
    try {
      const [group] = await db('custom_field_groups')
        .where('id', id)
        .update({
          ...data,
          updated_at: new Date()
        })
        .returning('*');
      
      return group || null;
    } catch (error) {
      console.error('Error updating custom field group:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deletedCount = await db('custom_field_groups')
        .where('id', id)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting custom field group:', error);
      throw error;
    }
  }

  async updateMenuOrder(updates: { id: number; menu_order: number }[]): Promise<void> {
    try {
      for (const update of updates) {
        await db('custom_field_groups')
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
} 