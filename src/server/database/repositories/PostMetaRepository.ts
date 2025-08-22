import db from '../connection';
import { PostMeta } from '../types';

export class PostMetaRepository {
  async findByPostId(postId: number): Promise<PostMeta[]> {
    try {
      const meta = await db('postmeta')
        .where('post_id', postId)
        .orderBy('meta_key');
      
      return meta;
    } catch (error) {
      console.error('Error fetching post meta:', error);
      throw error;
    }
  }

  async findByPostIdAndKey(postId: number, metaKey: string): Promise<PostMeta | null> {
    try {
      const meta = await db('postmeta')
        .where('post_id', postId)
        .where('meta_key', metaKey)
        .first();
      
      return meta || null;
    } catch (error) {
      console.error('Error fetching post meta by key:', error);
      throw error;
    }
  }

  async create(postId: number, metaKey: string, metaValue: string): Promise<PostMeta> {
    try {
      const [meta] = await db('postmeta')
        .insert({
          post_id: postId,
          meta_key: metaKey,
          meta_value: metaValue,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      
      return meta;
    } catch (error) {
      console.error('Error creating post meta:', error);
      throw error;
    }
  }

  async update(postId: number, metaKey: string, metaValue: string): Promise<PostMeta | null> {
    try {
      const [meta] = await db('postmeta')
        .where('post_id', postId)
        .where('meta_key', metaKey)
        .update({
          meta_value: metaValue,
          updated_at: new Date()
        })
        .returning('*');
      
      return meta || null;
    } catch (error) {
      console.error('Error updating post meta:', error);
      throw error;
    }
  }

  async upsert(postId: number, metaKey: string, metaValue: string): Promise<PostMeta> {
    try {
      // Try to update first
      const updated = await this.update(postId, metaKey, metaValue);
      if (updated) {
        return updated;
      }
      
      // If no update, create new
      return await this.create(postId, metaKey, metaValue);
    } catch (error) {
      console.error('Error upserting post meta:', error);
      throw error;
    }
  }

  async delete(postId: number, metaKey: string): Promise<boolean> {
    try {
      const deletedCount = await db('postmeta')
        .where('post_id', postId)
        .where('meta_key', metaKey)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting post meta:', error);
      throw error;
    }
  }

  async deleteByPostId(postId: number): Promise<boolean> {
    try {
      const deletedCount = await db('postmeta')
        .where('post_id', postId)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting post meta by post ID:', error);
      throw error;
    }
  }

  async findByKey(metaKey: string): Promise<PostMeta[]> {
    try {
      const meta = await db('postmeta')
        .where('meta_key', metaKey)
        .orderBy('post_id');
      
      return meta;
    } catch (error) {
      console.error('Error fetching post meta by key:', error);
      throw error;
    }
  }
} 