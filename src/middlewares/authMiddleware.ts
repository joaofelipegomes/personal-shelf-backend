import { Request, Response, NextFunction } from 'express';

// Extender a interface Request para incluir o token
declare global {
  namespace Express {
    interface Request {
      token?: string;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  req.token = token;
  next();
};
