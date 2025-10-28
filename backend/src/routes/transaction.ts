import express, { Request, Response, NextFunction } from 'express';
import { getTransactionByReference } from '../services/epayco.js';
import type { Transaction } from '../types.js';

const router = express.Router();

// Almacenamiento en memoria para las transacciones
// En producción, esto debería estar en una base de datos
const transactionsCache = new Map<string, Transaction>();

interface CacheRequestBody {
  reference: string;
  data: Transaction;
}

/**
 * GET /api/transaction/:reference
 * Obtiene la información de una transacción por su referencia
 */
router.get('/:reference', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      res.status(400).json({
        success: false,
        error: 'Referencia de transacción requerida'
      });
      return;
    }
    
    console.log('Consultando transacción:', reference);
    
    // Intentar obtener de caché primero
    if (transactionsCache.has(reference)) {
      console.log('Transacción encontrada en caché');
      res.json({
        success: true,
        data: transactionsCache.get(reference),
        source: 'cache'
      });
      return;
    }
    
    // Si no está en caché, consultar a ePayco
    try {
      const transaction = await getTransactionByReference(reference);
      
      // Guardar en caché
      transactionsCache.set(reference, transaction);
      
      console.log('Transacción obtenida de ePayco:', transaction);
      
      res.json({
        success: true,
        data: transaction,
        source: 'epayco'
      });
      return;
    } catch (epaycoError) {
      // Si ePayco no tiene la transacción, podría estar pendiente
      console.log('Transacción no encontrada en ePayco:', (epaycoError as Error).message);
      
      res.status(404).json({
        success: false,
        error: 'Transacción no encontrada',
        reference,
        message: 'La transacción puede estar pendiente de procesamiento'
      });
      return;
    }
  } catch (error) {
    console.error('Error al obtener transacción:', error);
    next(error);
  }
});

/**
 * GET /api/transaction/ref/:ref
 * Alias para obtener transacción (compatible con diferentes formatos de URL)
 */
router.get('/ref/:reference', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Redirigir a la ruta principal
  const { reference } = req.params;
  req.url = `/${reference}`;
  req.params = { reference };
  
  // Ejecutar el handler de la ruta /:reference
  const handlers = router.stack.find(layer => layer.route?.path === '/:reference');
  if (handlers && handlers.route) {
    try {
      await handlers.route.stack[0].handle(req, res, next);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(404).json({ success: false, error: 'Route not found' });
  }
});

/**
 * POST /api/transaction/cache
 * Guarda una transacción en caché (útil para testing)
 */
router.post('/cache', (req: Request<{}, {}, CacheRequestBody>, res: Response): void => {
  try {
    const { reference, data } = req.body;
    
    if (!reference || !data) {
      res.status(400).json({
        success: false,
        error: 'Se requiere reference y data'
      });
      return;
    }
    
    transactionsCache.set(reference, data);
    
    res.json({
      success: true,
      message: 'Transacción guardada en caché',
      reference
    });
  } catch (error) {
    console.error('Error al guardar en caché:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * GET /api/transaction/cache/list
 * Lista todas las transacciones en caché
 */
router.get('/cache/list', (_req: Request, res: Response): void => {
  const transactions = Array.from(transactionsCache.entries()).map(([reference, data]) => ({
    reference,
    data
  }));
  
  res.json({
    success: true,
    count: transactions.length,
    transactions
  });
});

export default router;
