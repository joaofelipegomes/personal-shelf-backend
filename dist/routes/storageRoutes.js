"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const storageController_1 = require("../controllers/storageController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(authMiddleware_1.authenticateToken);
router.post('/upload', upload.single('file'), storageController_1.uploadImage);
router.delete('/remove', storageController_1.deleteImage);
exports.default = router;
