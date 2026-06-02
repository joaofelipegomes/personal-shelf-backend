"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const supabase_1 = require("../config/supabase");
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }
    try {
        const authClient = (0, supabase_1.getAuthClient)(token);
        const { data: { user }, error } = await authClient.auth.getUser();
        if (error || !user) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Erro ao validar token de acesso.' });
    }
};
exports.authenticateToken = authenticateToken;
