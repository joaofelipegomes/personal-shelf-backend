import { Router } from 'express';
import { getProfile, updateProfile, deleteAccount } from '../controllers/profileController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/account', deleteAccount);

export default router;
