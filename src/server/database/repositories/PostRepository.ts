import db from '../connection';
import { Post, CreatePostData, UpdatePostData } from '../types';

export class PostRepository {

  async findAll(limit: number = 10, offset: number = 0, status: string = 'publish'): Promise<Post[]> {
    try {
      const posts = await db('posts')
        .select('posts.*', 'users.name as author_name')
        .leftJoin('users', 'posts.author_id', 'users.id')
        .orderBy('posts.date', 'desc')
        .limit(limit)
        .offset(offset);
      
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Post | null> {
    try {
      const post = await db('posts')
        .select('posts.*', 'users.name as author_name')
        .leftJoin('users', 'posts.author_id', 'users.id')
        .where('posts.id', id)
        .first();
      
      return post || null;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      throw error;
    }
  }

  async findBySlug(slug: string): Promise<Post | null> {
    try {
      const post = await db('posts')
        .select('posts.*', 'users.name as author_name')
        .leftJoin('users', 'posts.author_id', 'users.id')
        .where('posts.name', slug)
        .where('posts.status', 'publish')
        .first();
      
      return post || null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  }

  async create(postData: CreatePostData): Promise<Post> {
    try {
      const [post] = await db('posts')
        .insert({
          ...postData,
          date: new Date(),
          date_gmt: new Date(),
          modified: new Date(),
          modified_gmt: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      
      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async update(id: number, postData: UpdatePostData): Promise<Post | null> {
    try {
      const [post] = await db('posts')
        .where('id', id)
        .update({
          ...postData,
          modified: new Date(),
          modified_gmt: new Date(),
          updated_at: new Date()
        })
        .returning('*');
      
      return post || null;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const deletedCount = await db('posts')
        .where('id', id)
        .del();
      
      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async findByType(type: string, limit: number = 10, offset: number = 0): Promise<Post[]> {
    try {
      const posts = await db('posts')
        .select('posts.*', 'users.name as author_name')
        .leftJoin('users', 'posts.author_id', 'users.id')
        .where('posts.type', type)
        .where('posts.status', 'publish')
        .orderBy('posts.date', 'desc')
        .limit(limit)
        .offset(offset);
      
      return posts;
    } catch (error) {
      console.error('Error fetching posts by type:', error);
      throw error;
    }
  }

  async findByAuthor(authorId: number, limit: number = 10, offset: number = 0): Promise<Post[]> {
    try {
      const posts = await db('posts')
        .select('posts.*', 'users.name as author_name')
        .leftJoin('users', 'posts.author_id', 'users.id')
        .where('posts.author_id', authorId)
        .where('posts.status', 'publish')
        .orderBy('posts.date', 'desc')
        .limit(limit)
        .offset(offset);
      
      return posts;
    } catch (error) {
      console.error('Error fetching posts by author:', error);
      throw error;
    }
  }

  async countByStatus(status: string = 'publish'): Promise<number> {
    try {
      const result = await db('posts')
        .where('status', status)
        .count('* as count')
        .first();
      
      return parseInt(result?.count as string) || 0;
    } catch (error) {
      console.error('Error counting posts:', error);
      throw error;
    }
  }
} 