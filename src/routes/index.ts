import { Router } from 'express';
import authRoutes from './authRoutes';
import itemRoutes from './itemRoutes';
import profileRoutes from './profileRoutes';
import storageRoutes from './storageRoutes';
import publicRoutes from './publicRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/profile', profileRoutes);
router.use('/storage', storageRoutes);
router.use('/public', publicRoutes);

export default router;
