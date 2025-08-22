import { NextApiRequest, NextApiResponse } from 'next';
import { PostRepository } from '../../../server/database/repositories/PostRepository';
import { PostMetaRepository } from '../../../server/database/repositories/PostMetaRepository';
import { CreatePostData, UpdatePostData } from '../../../server/database/types';

const postRepository = new PostRepository();
const postMetaRepository = new PostMetaRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ 
          success: false, 
          message: `Method ${method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('Posts API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string || 'publish';
    const type = req.query.type as string;
    
    const offset = (page - 1) * limit;
    
    let posts;
    if (type) {
      posts = await postRepository.findByType(type, limit, offset);
    } else {
      posts = await postRepository.findAll(limit, offset, status);
    }
    
    const total = await postRepository.countByStatus(status);
    
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

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, content, excerpt, status, type, name, comment_status, ping_status } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const postData: CreatePostData = {
      author_id: 1, // Default author ID - you can get this from auth context
      title,
      content,
      excerpt: excerpt || '',
      status: status || 'draft',
      type: type || 'post',
      name: name || generateSlug(title),
      comment_status: comment_status || 'open',
      ping_status: ping_status || 'open'
    };
    
    const post = await postRepository.create(postData);
    
    // Handle post meta if provided
    if (req.body.meta && Array.isArray(req.body.meta)) {
      for (const metaItem of req.body.meta) {
        if (metaItem.key && metaItem.value !== undefined) {
          await postMetaRepository.create(post.id, metaItem.key, metaItem.value);
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
} 