import express, { Request, Response, NextFunction } from 'express';
import { getEpaycoToken, createCheckoutSession } from '../services/epayco.js';
import type { SessionData } from '../types.js';

const router = express.Router();

interface CreateSessionRequestBody {
  name: string;
  description: string;
  currency: string;
  amount: number;
  lang?: string;
  ip: string;
  country?: string;
  test?: boolean;
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
 * Body esperado:
 * {
 *   name: string,
 *   description: string,
 *   currency: string,
 *   amount: number,
 *   ip: string,
 *   country?: string (opcional),
 *   lang?: string (opcional)
 * }
 * 
 * Nota: El parámetro test siempre se establece en "true" desde el backend
 */
router.post('/create-session', async (req: Request<{}, {}, CreateSessionRequestBody>, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      description,
      amount,
      currency,
      ip,
      country
    } = req.body;
    
    console.log('Creando sesión de checkout para:', { name, amount, currency });
    
    // 1. Obtener token de autenticación
    const authResponse = await getEpaycoToken();
    const token = authResponse.token;
    
    // 2. Usar IP proporcionada o detectar IP del cliente
    const clientIp = ip || req.ip || req.socket.remoteAddress || '127.0.0.1';
    
    // 3. Construir URLs dinámicas basadas en variables de entorno
    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;
    const responseUrl = process.env.RESPONSE_URL || 'http://localhost:3002/transaction-result.html';
    const confirmationUrl = `${backendUrl}/api/checkout/confirmation`;
    
    // 4. Preparar datos de la sesión (test siempre en true desde backend)
    const sessionData: SessionData = {
      name,
      description,
      currency: currency.toUpperCase(),
      amount: amount.toString(),
      test: "true", // Siempre en modo prueba desde el backend
      ip: clientIp.replace('::ffff:', ''), // Limpiar formato IPv6
      ...(country && { country: country.toUpperCase() }), // Agregar country solo si se proporciona
      // URL de respuesta después del pago
      response: responseUrl,
      // URL de confirmación (webhook)
      confirmation: confirmationUrl
    };
    
    console.log('Datos de sesión:', sessionData);
    
    // 5. Crear sesión en ePayco (validación realizada por ePayco API)
    const session = await createCheckoutSession(token, sessionData);
    
    console.log('Sesión creada exitosamente:', session);
    
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
    
    // Aquí puedes procesar la confirmación
    // Actualizar base de datos, enviar emails, etc.
    
    const {
      x_ref_payco,
      x_transaction_id,
      x_amount,
      x_currency_code,
      x_transaction_state,
      x_approval_code,
      x_response_reason_text
    } = req.body;
    
    // Guardar en memoria o procesar según necesites
    console.log('Transacción procesada:', {
      reference: x_ref_payco,
      transactionId: x_transaction_id,
      amount: x_amount,
      currency: x_currency_code,
      state: x_transaction_state,
      approvalCode: x_approval_code,
      reason: x_response_reason_text
    });
    
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
