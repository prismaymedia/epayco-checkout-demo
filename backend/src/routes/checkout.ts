import express, { Request, Response, NextFunction } from 'express';
import { getEpaycoToken, createCheckoutSession } from '../services/epayco.js';
import type { SessionData } from '../types.js';

const router = express.Router();

interface CreateSessionRequestBody {
  name: string;
  amount: number | string; // Puede venir como string del frontend
  currency: string;
  description: string;
}

interface ConfirmationRequestBody {
  x_ref_payco?: string;
  x_transaction_id?: string;
  x_amount?: string;
  x_currency_code?: string;
  x_transaction_state?: string;
  x_approval_code?: string;
  x_response_reason_text?: string;
}

/**
 * POST /api/checkout/create-session
 * Crea una nueva sesión de checkout
 * 
 * Body esperado desde frontend:
 * {
 *   name: string,
 *   amount: number,
 *   currency: string,
 *   description: string
 * }
 * 
 * El backend añade automáticamente:
 * - checkout_version: "2"
 * - lang: "ES"
 * - country: "CO"
 * - test: "true"
 * - ip: detectada del cliente
 * - response y confirmation URLs
 */
router.post('/create-session', async (req: Request<{}, {}, CreateSessionRequestBody>, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      amount,
      currency,
      description
    } = req.body;
    
    // Convertir amount a número si es string
    const amountNumber = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({
        success: false,
        error: 'El monto debe ser un número válido mayor a 0'
      });
    }
    
    // 1. Obtener token de autenticación
    const authResponse = await getEpaycoToken();
    const token = authResponse.token;
    
    // 2. Detectar IP del cliente
    const clientIp = req.ip || req.socket.remoteAddress || '201.245.254.45';
    
    // 3. Construir URLs dinámicas basadas en variables de entorno
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
    const responseUrl = process.env.RESPONSE_URL || 'http://localhost:3002/transaction-result.html';
    const confirmationUrl = `${backendUrl}/api/checkout/confirmation`;
    
    // 4. Preparar datos de la sesión con todos los campos requeridos por ePayco
    const sessionData: SessionData = {
      // Campos requeridos
      checkout_version: "2",
      name: name, // Usar el nombre enviado desde el frontend
      description: description,
      currency: currency.toUpperCase(),
      amount: amountNumber, // Usar el amount convertido a número
      country: "CO",
      lang: "ES",
      ip: clientIp.replace('::ffff:', ''), // Limpiar formato IPv6
      test: true, // Booleano
      response: responseUrl,
      confirmation: confirmationUrl,
      
      // Configuración por defecto
      method: "POST",
      dues: 1,
      noRedirectOnClose: true,
      forceResponse: false,
      uniqueTransactionPerBill: false,
      autoClick: false,
      methodsDisable: [],
      config: {}
    };
    
    // 5. Crear sesión en ePayco (validación realizada por ePayco API)
    const session = await createCheckoutSession(token, sessionData);
    
    // Retornar la respuesta exacta del API de ePayco
    res.json(session);
  } catch (error: any) {
    console.error('Error al crear sesión:', error);
    
    // Si el error tiene la respuesta de ePayco, retornarla tal cual
    if (error.epaycoResponse) {
      return res.status(400).json(error.epaycoResponse);
    }
    
    // Otros errores (red, etc.)
    return next(error);
  }
});

/**
 * POST /api/checkout/confirmation
 * Webhook de confirmación de ePayco
 * Este endpoint recibe la confirmación de pago desde ePayco
 */
router.post('/confirmation', async (req: Request<{}, {}, ConfirmationRequestBody>, res: Response) => {
  try {
    console.log('Confirmación recibida de ePayco:', req.body);
    
    // Responder a ePayco
    res.json({
      success: true,
      message: 'Confirmación recibida'
    });
  } catch (error) {
    console.error('Error en confirmación:', error);
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

export default router;
