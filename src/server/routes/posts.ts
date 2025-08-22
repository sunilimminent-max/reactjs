import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const router = Router();
const postController = new PostController();

// Public routes (no authentication required)
router.get('/posts', postController.getPosts.bind(postController));
router.get('/posts/:id', postController.getPost.bind(postController));
router.get('/posts/slug/:slug', postController.getPostBySlug.bind(postController));
router.get('/posts/author/:authorId', postController.getPostsByAuthor.bind(postController));

// Routes for creating/updating posts (authentication can be added later)
router.post('/posts', postController.createPost.bind(postController));
router.put('/posts/:id', postController.updatePost.bind(postController));
router.delete('/posts/:id', postController.deletePost.bind(postController));

export default router; 