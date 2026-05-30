import { Router } from 'express';
import { getPublicProfile, getShelfData, toggleLike, toggleFavorite, searchProfiles, getFavorites } from '../controllers/publicController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile/:username', getPublicProfile);
router.get('/shelf/:username', getShelfData);
router.post('/like', authenticateToken, toggleLike);
router.post('/favorite', authenticateToken, toggleFavorite);
router.get('/search', searchProfiles);
router.get('/favorites', authenticateToken, getFavorites);

export default router;
