import { describe, expect, test, jest, beforeAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';

// Mocks de los servicios
const mockGetEpaycoToken = jest.fn<any>();
const mockCreateCheckoutSession = jest.fn<any>();

jest.unstable_mockModule('../src/services/epayco.js', () => ({
  getEpaycoToken: mockGetEpaycoToken,
  createCheckoutSession: mockCreateCheckoutSession
}));

// Importar routers después de los mocks
const authRouter = (await import('../src/routes/auth.js')).default;
const checkoutRouter = (await import('../src/routes/checkout.js')).default;

describe('Rutas de Autenticación - /api/auth', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    test('debe retornar token correctamente', async () => {
      const mockAuthResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test_token'
      };

      mockGetEpaycoToken.mockResolvedValueOnce(mockAuthResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockAuthResponse);
      expect(response.body.token).toBe(mockAuthResponse.token);
      expect(mockGetEpaycoToken).toHaveBeenCalled();
    });

    test('debe manejar errores de autenticación', async () => {
      mockGetEpaycoToken.mockRejectedValueOnce(new Error('Credenciales inválidas'));

      await request(app)
        .post('/api/auth/login')
        .expect(500);
    });
  });
});

describe('Rutas de Checkout - /api/checkout', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/checkout', checkoutRouter);
    
    // Configurar variables de entorno para tests
    process.env.BACKEND_URL = 'http://localhost:3001';
    process.env.RESPONSE_URL = 'http://localhost:3002/transaction-result.html';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/checkout/create-session', () => {
    test('debe crear sesión exitosamente', async () => {
      const mockAuthResponse = {
        token: 'Bearer test_token_123'
      };

      const mockSessionResponse = {
        success: true,
        titleResponse: 'Session created successfully',
        textResponse: 'Session created successfully',
        lastAction: 'create session',
        data: {
          sessionId: '68eefbc11d65f1d39c0f6da7',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session_token'
        }
      };

      mockGetEpaycoToken.mockResolvedValueOnce(mockAuthResponse);
      mockCreateCheckoutSession.mockResolvedValueOnce(mockSessionResponse);

      const requestBody = {
        name: 'Producto de Prueba',
        description: 'Descripción del producto',
        amount: 10000,
        currency: 'COP',
        ip: '192.168.1.1'
      };

      const response = await request(app)
        .post('/api/checkout/create-session')
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockSessionResponse);
      expect(response.body.success).toBe(true);
      expect(response.body.data?.sessionId).toBe('68eefbc11d65f1d39c0f6da7');
      expect(mockGetEpaycoToken).toHaveBeenCalled();
      expect(mockCreateCheckoutSession).toHaveBeenCalled();
    });

    test('debe retornar error de validación de ePayco API', async () => {
      const mockAuthResponse = {
        token: 'Bearer test_token_123'
      };

      const mockErrorResponse = {
        success: false,
        titleResponse: 'Error',
        textResponse: 'Some fields are required, please correct the errors and try again',
        lastAction: 'validation data',
        data: {
          totalErrors: 1,
          errors: [
            {
              codError: 500,
              errorMessage: 'field ip is required'
            }
          ]
        }
      };

      mockGetEpaycoToken.mockResolvedValueOnce(mockAuthResponse);

      const error: any = new Error('ePayco API returned error');
      error.epaycoResponse = mockErrorResponse;
      error.isValidationError = true;

      mockCreateCheckoutSession.mockRejectedValueOnce(error);

      const requestBody = {
        name: 'Producto de Prueba',
        description: 'Descripción del producto',
        amount: 10000,
        currency: 'COP',
        ip: '192.168.1.1'
      };

      const response = await request(app)
        .post('/api/checkout/create-session')
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual(mockErrorResponse);
      expect(response.body.success).toBe(false);
      expect(response.body.data?.totalErrors).toBe(1);
    });
  });

  describe('POST /api/checkout/confirmation', () => {
    test('debe procesar confirmación de pago correctamente', async () => {
      const confirmationData = {
        x_ref_payco: 'REF123456',
        x_transaction_id: 'TRX789',
        x_amount: '10000',
        x_currency_code: 'COP',
        x_transaction_state: 'Aceptada',
        x_approval_code: 'APPR123',
        x_response: 'Aceptada',
        x_signature: 'test_signature'
      };

      const response = await request(app)
        .post('/api/checkout/confirmation')
        .send(confirmationData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });
  });
});
