import express, { Request, Response, NextFunction } from 'express';
import { getEpaycoToken } from '../services/epayco.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Obtiene un token de autenticación de ePayco
 */
router.post('/login', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Solicitando token de ePayco...');
    
    const authResponse = await getEpaycoToken();
    
    // Retornar la respuesta exacta del API de ePayco
    res.json(authResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
