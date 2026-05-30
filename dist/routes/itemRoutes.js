"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemController_1 = require("../controllers/itemController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken); // Todas as rotas de itens precisam de auth
router.get('/', itemController_1.getItems);
router.post('/', itemController_1.createItem);
router.put('/:id', itemController_1.updateItem);
router.delete('/:id', itemController_1.deleteItem);
exports.default = router;
