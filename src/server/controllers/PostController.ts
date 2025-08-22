import { Request, Response } from 'express';
import { PostRepository } from '../database/repositories/PostRepository';
import { PostMetaRepository } from '../database/repositories/PostMetaRepository';
import { CreatePostData, UpdatePostData } from '../database/types';

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
}

export class PostController {
  private postRepository: PostRepository;
  private postMetaRepository: PostMetaRepository;

  constructor() {
    this.postRepository = new PostRepository();
    this.postMetaRepository = new PostMetaRepository();
  }

  // Get all posts with pagination
  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string || 'publish';
      const type = req.query.type as string;
      
      const offset = (page - 1) * limit;
      
      let posts;
      if (type) {
        posts = await this.postRepository.findByType(type, limit, offset);
      } else {
        posts = await this.postRepository.findAll(limit, offset, status);
      }
      
      const total = await this.postRepository.countByStatus(status);
      
      res.json({
        success: true,
        data: posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch posts',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get a single post by ID
  async getPost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = await this.postRepository.findById(parseInt(id));
      
      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post not found'
        });
        return;
      }
      
      // Get post meta
      const meta = await this.postMetaRepository.findByPostId(post.id);
      
      res.json({
        success: true,
        data: {
          ...post,
          meta
        }
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch post',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get a single post by slug
  async getPostBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const post = await this.postRepository.findBySlug(slug);
      
      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post not found'
        });
        return;
      }
      
      // Get post meta
      const meta = await this.postMetaRepository.findByPostId(post.id);
      
      res.json({
        success: true,
        data: {
          ...post,
          meta
        }
      });
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch post',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create a new post
  async createPost(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const postData: CreatePostData = {
        author_id: req.body.author_id || req.user?.id,
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt,
        status: req.body.status || 'draft',
        type: req.body.type || 'post',
        name: req.body.name || this.generateSlug(req.body.title),
        comment_status: req.body.comment_status || 'open',
        ping_status: req.body.ping_status || 'open'
      };
      
      const post = await this.postRepository.create(postData);
      
      // Handle post meta if provided
      if (req.body.meta && Array.isArray(req.body.meta)) {
        for (const metaItem of req.body.meta) {
          if (metaItem.key && metaItem.value !== undefined) {
            await this.postMetaRepository.create(post.id, metaItem.key, metaItem.value);
          }
        }
      }
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update an existing post
  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const postData: UpdatePostData = {
        title: req.body.title,
        content: req.body.content,
        excerpt: req.body.excerpt,
        status: req.body.status,
        type: req.body.type,
        name: req.body.name,
        comment_status: req.body.comment_status,
        ping_status: req.body.ping_status
      };
      
      const post = await this.postRepository.update(parseInt(id), postData);
      
      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post not found'
        });
        return;
      }
      
      // Handle post meta updates if provided
      if (req.body.meta && Array.isArray(req.body.meta)) {
        for (const metaItem of req.body.meta) {
          if (metaItem.key && metaItem.value !== undefined) {
            await this.postMetaRepository.upsert(post.id, metaItem.key, metaItem.value);
          }
        }
      }
      
      res.json({
        success: true,
        message: 'Post updated successfully',
        data: post
      });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update post',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete a post
  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Delete post meta first
      await this.postMetaRepository.deleteByPostId(parseInt(id));
      
      // Delete the post
      const deleted = await this.postRepository.delete(parseInt(id));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Post not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete post',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get posts by author
  async getPostsByAuthor(req: Request, res: Response): Promise<void> {
    try {
      const { authorId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      const posts = await this.postRepository.findByAuthor(parseInt(authorId), limit, offset);
      
      res.json({
        success: true,
        data: posts
      });
    } catch (error) {
      console.error('Error fetching posts by author:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch posts by author',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Helper method to generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
} 