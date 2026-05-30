"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const itemRoutes_1 = __importDefault(require("./itemRoutes"));
const profileRoutes_1 = __importDefault(require("./profileRoutes"));
const storageRoutes_1 = __importDefault(require("./storageRoutes"));
const publicRoutes_1 = __importDefault(require("./publicRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/items', itemRoutes_1.default);
router.use('/profile', profileRoutes_1.default);
router.use('/storage', storageRoutes_1.default);
router.use('/public', publicRoutes_1.default);
exports.default = router;
