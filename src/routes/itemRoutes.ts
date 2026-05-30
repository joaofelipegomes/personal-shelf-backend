import { Router } from 'express';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/itemController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken); // Todas as rotas de itens precisam de auth

router.get('/', getItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

export default router;
