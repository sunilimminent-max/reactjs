import { NextApiRequest, NextApiResponse } from 'next';
import { PostRepository } from '../../../../server/database/repositories/PostRepository';

const postRepository = new PostRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { authorId } = req.query;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${method} Not Allowed` 
    });
  }

  if (!authorId || typeof authorId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Author ID is required'
    });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const posts = await postRepository.findByAuthor(parseInt(authorId), limit, offset);
    
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