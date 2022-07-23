import { getTransactions, createTransaction } from '../controllers/postsController.js';
import validateUser from '../middlewares/validateUser.js';
import { Router } from 'express';

const router = Router();

router.get('/transactions', validateUser, getTransactions);
router.post('/transaction', createTransaction);

export default router;
