/**
 * Interfaz para los datos de una sesión de checkout
 */
export interface SessionData {
  name: string;
  description: string;
  currency: string;
  amount: string;
  test: string;
  ip: string;
  country?: string;
  response: string;
  confirmation: string;
}

/**
 * Interfaz para la respuesta de autenticación de ePayco
 */
export interface EpaycoAuthResponse {
  token: string;
}

/**
 * Interfaz para la respuesta de creación de sesión de ePayco
 * Basada en la respuesta real del API de ePayco
 */
export interface EpaycoSessionResponse {
  success: boolean;
  titleResponse?: string;
  textResponse?: string;
  lastAction?: string;
  data?: {
    sessionId?: string;
    token?: string;
    totalErrors?: number;
    errors?: Array<{
      codError: number;
      errorMessage: string;
    }>;
  };
}

/**
 * Interfaz para errores de ePayco
 */
export interface EpaycoError extends Error {
  status?: number;
  epaycoResponse?: EpaycoSessionResponse; // Respuesta completa del API
  epaycoErrors?: any;
  isValidationError?: boolean;
}

/**
 * Interfaz para los datos de una transacción
 */
export interface Transaction {
  reference: string;
  // Agregar más campos según la respuesta de ePayco
  [key: string]: any;
}
