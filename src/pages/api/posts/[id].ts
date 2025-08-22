import { NextApiRequest, NextApiResponse } from 'next';
import { PostRepository } from '../../../server/database/repositories/PostRepository';
import { PostMetaRepository } from '../../../server/database/repositories/PostMetaRepository';
import { UpdatePostData } from '../../../server/database/types';

const postRepository = new PostRepository();
const postMetaRepository = new PostMetaRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Post ID is required'
    });
  }

  const postId = parseInt(id);

  try {
    switch (method) {
      case 'GET':
        await handleGet(postId, res);
        break;
      case 'PUT':
        await handlePut(postId, req, res);
        break;
      case 'DELETE':
        await handleDelete(postId, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ 
          success: false, 
          message: `Method ${method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('Post API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(postId: number, res: NextApiResponse) {
  try {
    const post = await postRepository.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get post meta
    const meta = await postMetaRepository.findByPostId(post.id);
    
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

async function handlePut(postId: number, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, content, excerpt, status, type, name, comment_status, ping_status } = req.body;
    
    const postData: UpdatePostData = {
      title,
      content,
      excerpt,
      status,
      type,
      name,
      comment_status,
      ping_status
    };
    
    const post = await postRepository.update(postId, postData);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Handle post meta updates if provided
    if (req.body.meta && Array.isArray(req.body.meta)) {
      for (const metaItem of req.body.meta) {
        if (metaItem.key && metaItem.value !== undefined) {
          await postMetaRepository.upsert(post.id, metaItem.key, metaItem.value);
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

async function handleDelete(postId: number, res: NextApiResponse) {
  try {
    // Delete post meta first
    await postMetaRepository.deleteByPostId(postId);
    
    // Delete the post
    const deleted = await postRepository.delete(postId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
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