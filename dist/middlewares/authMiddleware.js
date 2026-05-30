"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }
    req.token = token;
    next();
};
exports.authenticateToken = authenticateToken;
