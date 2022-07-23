import { getUsers, createUser, getUserById } from '../controllers/usersController.js';
import { Router } from 'express';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);

export default router;