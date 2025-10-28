import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import type { SessionData, EpaycoAuthResponse, EpaycoSessionResponse } from '../src/types.js';

// Variables globales para los mocks
let mockFetchResponse: any;
let mockFetchError: Error | null = null;

// Mock de node-fetch antes de importar el servicio
jest.unstable_mockModule('node-fetch', () => ({
  default: jest.fn(async () => {
    if (mockFetchError) {
      throw mockFetchError;
    }
    return mockFetchResponse;
  })
}));

// Importar después del mock
const { getEpaycoToken, createCheckoutSession } = await import('../src/services/epayco.js');

describe('Servicio ePayco', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchError = null;
    mockFetchResponse = null;
    // Configurar variables de entorno de prueba
    process.env.EPAYCO_PUBLIC_KEY = 'test_public_key';
    process.env.EPAYCO_PRIVATE_KEY = 'test_private_key';
  });

  afterEach(() => {
    mockFetchError = null;
    mockFetchResponse = null;
  });

  describe('getEpaycoToken', () => {
    test('debe obtener el token correctamente', async () => {
      const mockResponse: EpaycoAuthResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
      };

      mockFetchResponse = {
        ok: true,
        json: async () => mockResponse,
        headers: new Map()
      };

      const result = await getEpaycoToken();

      expect(result).toEqual(mockResponse);
      expect(result.token).toBe(mockResponse.token);
    });

    test('debe lanzar error si no hay credenciales configuradas', async () => {
      delete process.env.EPAYCO_PUBLIC_KEY;
      delete process.env.EPAYCO_PRIVATE_KEY;

      await expect(getEpaycoToken()).rejects.toThrow('Credenciales de ePayco no configuradas');
    });

    test('debe lanzar error si la respuesta no es OK', async () => {
      mockFetchResponse = {
        ok: false,
        status: 401,
        text: async () => 'Unauthorized'
      };

      await expect(getEpaycoToken()).rejects.toThrow('Error al autenticar con ePayco');
    });

    test('debe lanzar error si no se recibe token', async () => {
      mockFetchResponse = {
        ok: true,
        json: async () => ({})
      };

      await expect(getEpaycoToken()).rejects.toThrow('No se recibió token de ePayco');
    });
  });

  describe('createCheckoutSession', () => {
    const mockToken = 'Bearer test_token_123';
    const mockSessionData: SessionData = {
      name: 'Test Product',
      description: 'Producto de prueba',
      currency: 'COP',
      amount: '10000',
      test: 'true',
      ip: '192.168.1.1',
      response: 'http://localhost:3002/result',
      confirmation: 'http://localhost:3001/api/checkout/confirmation'
    };

    test('debe crear sesión correctamente cuando success=true', async () => {
      const mockResponse: EpaycoSessionResponse = {
        success: true,
        titleResponse: 'Session created successfully',
        textResponse: 'Session created successfully',
        lastAction: 'create session',
        data: {
          sessionId: '68eefbc11d65f1d39c0f6da7',
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.session_token'
        }
      };

      mockFetchResponse = {
        ok: true,
        json: async () => mockResponse
      };

      const result = await createCheckoutSession(mockToken, mockSessionData);

      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.data?.sessionId).toBe('68eefbc11d65f1d39c0f6da7');
    });

    test('debe lanzar error con respuesta completa cuando success=false', async () => {
      const mockErrorResponse: EpaycoSessionResponse = {
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

      mockFetchResponse = {
        ok: true,
        json: async () => mockErrorResponse
      };

      try {
        await createCheckoutSession(mockToken, mockSessionData);
        // Si llega aquí, el test debe fallar
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toBe('ePayco API returned error');
        expect(error.epaycoResponse).toEqual(mockErrorResponse);
        expect(error.isValidationError).toBe(true);
      }
    });

    test('debe manejar errores de red correctamente', async () => {
      mockFetchError = new Error('Network error');

      await expect(createCheckoutSession(mockToken, mockSessionData))
        .rejects.toThrow('Network error');
    });
  });
});
