import { Router } from 'express';
import { signUp, signIn, signOut, resetPassword, getSession, checkUsername, updatePassword } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', signUp);
router.post('/login', signIn);
router.post('/logout', authenticateToken, signOut);
router.post('/reset-password', resetPassword);
router.get('/session', authenticateToken, getSession);
router.get('/check-username/:username', checkUsername);
router.post('/update-password', authenticateToken, updatePassword);

export default router;
