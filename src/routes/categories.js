import { getCategories, getPostById, createCategorie } from '../controllers/categoriesController.js';
import { Router } from 'express';

const router = Router();

router.get('/categories', getCategories);
//router.get('/posts/:id', getPostById);
router.post('/categories', createCategorie);

export default router;