import { Request, Response, NextFunction } from 'express';
import { getAuthClient } from '../config/supabase';

// Extender a interface Request para incluir o token e o user
declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: any;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const authClient = getAuthClient(token);
    const { data: { user }, error } = await authClient.auth.getUser();

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Erro ao validar token de acesso.' });
  }
};
