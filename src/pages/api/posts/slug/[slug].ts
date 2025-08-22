import { NextApiRequest, NextApiResponse } from 'next';
import { PostRepository } from '../../../../server/database/repositories/PostRepository';
import { PostMetaRepository } from '../../../../server/database/repositories/PostMetaRepository';

const postRepository = new PostRepository();
const postMetaRepository = new PostMetaRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { slug } = req.query;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${method} Not Allowed` 
    });
  }

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Post slug is required'
    });
  }

  try {
    const post = await postRepository.findBySlug(slug);
    
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
    console.error('Error fetching post by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 