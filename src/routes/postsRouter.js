import { getPosts, getPostById, createPost } from '../controllers/postsController.js';
import { Router } from 'express';

const router = Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', createPost);

export default router;