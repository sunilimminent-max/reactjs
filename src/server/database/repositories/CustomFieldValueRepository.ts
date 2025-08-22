import db from '../connection';
import { CustomFieldValue } from '../types';

export class CustomFieldValueRepository {
  async findByPostId(postId: number): Promise<CustomFieldValue[]> {
    try {
      const values = await db('custom_field_values')
        .where('post_id', postId)
        .orderBy('id', 'asc');
      
      return values;
    } catch (error) {
      console.error('Error fetching custom field values by post ID:', error);
      throw error;
    }
  }

  async findByFieldId(fieldId: number): Promise<CustomFieldValue[]> {
    try {
      const values = await db('custom_field_values')
        .where('field_id', fieldId)
        .orderBy('id', 'asc');
      
      return values;
    } catch (error) {
      console.error('Error fetching custom field values by field ID:', error);
      throw error;
    }
  }

  async findByPostAndField(postId: number, fieldId: number): Promise<CustomFieldValue | null> {
    try {
      const value = await db('custom_field_values')
        .where('post_id', postId)
        .where('field_id', fieldId)
        .first();
      
      return value || null;
    } catch (error) {
      console.error('Error fetching custom field value by post and field:', error);
      throw error;
    }
  }

  async create(postId: number, fieldId: number, value: string): Promise<CustomFieldValue> {
    try {
      const [fieldValue] = await db('custom_field_values')
        .insert({
          post_id: postId,
          field_id: fieldId,
          value,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      
      return fieldValue;
    } catch (error) {
      console.error('Error creating custom field value:', error);
      throw error;
    }
  }

  async upsert(postId: number, fieldId: number, value: string): Promise<CustomFieldValue> {
    try {
      // Try to update first
      const updated = await this.update(postId, fieldId, value);
      if (updated) {
        return updated;
      }
      
      // If no update, create new
      return await this.create(postId, fieldId, value);
    } catch (error) {
      console.error('Error upserting custom field value:', error);
      throw error;
    }
  }

  async update(postId: number, fieldId: number, value: string): Promise<CustomFieldValue | null> {
    try {
      const [fieldValue] = await db('custom_field_values')
        .where('post_id', postId)
        .where('field_id', fieldId)
        .update({
          value,
          updated_at: new Date()
        })
        .returning('*');
      
      return fieldValue || null;
    } catch (error) {
      console.error('Error updating custom field value:', error);
      throw error;
    }
  }

  async delete(postId: number, fieldId: number): Promise<boolean> {
    try {
      const deletedCount = await db('custom_field_values')
        .where('post_id', postId)
        .where('field_id', fieldId)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting custom field value:', error);
      throw error;
    }
  }

  async deleteByPostId(postId: number): Promise<boolean> {
    try {
      const deletedCount = await db('custom_field_values')
        .where('post_id', postId)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting custom field values by post ID:', error);
      throw error;
    }
  }

  async deleteByFieldId(fieldId: number): Promise<boolean> {
    try {
      const deletedCount = await db('custom_field_values')
        .where('field_id', fieldId)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting custom field values by field ID:', error);
      throw error;
    }
  }
} 