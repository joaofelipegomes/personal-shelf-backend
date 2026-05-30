import { Router } from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/storageController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateToken);

router.post('/upload', upload.single('file'), uploadImage);
router.delete('/remove', deleteImage);

export default router;
