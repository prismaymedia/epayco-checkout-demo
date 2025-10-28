/**
 * Interfaz para los datos de una sesión de checkout
 * Basada en la documentación de ePayco API
 */
export interface SessionData {
  // Requeridos
  checkout_version: string; // "2"
  name: string; // Nombre del comercio
  description: string; // Descripción del producto/servicio
  currency: string; // "COP", "USD", etc.
  amount: number; // Monto (ej: 20000.00)
  country: string; // "CO"
  lang: string; // "ES" | "EN"
  ip: string; // IP del cliente
  test: boolean | string; // true | false
  response: string; // URL de respuesta después del pago
  confirmation: string; // URL de webhook de confirmación
  
  // Opcionales pero comunes
  taxBase?: number; // Base tributaria
  tax?: number; // Impuesto
  taxIco?: number; // IVA ICO
  
  // Configuración de comportamiento
  methodsDisable?: string[];
  autoClick?: boolean;
  method?: string; // "POST"
  dues?: number; // Número de cuotas
  noRedirectOnClose?: boolean;
  forceResponse?: boolean;
  uniqueTransactionPerBill?: boolean;
  config?: Record<string, any>;
  
  // Split payment
  splitPayment?: {
    type: string;
    receivers: Array<{
      merchantId: number;
      amount: number;
      taxBase: number;
      tax: number;
      fee: number;
    }>;
  };
  
  // Campos adicionales
  extras?: Record<string, string>;
  extrasEpayco?: Record<string, string>;
  
  // Información de facturación
  billing?: {
    email: string;
    name: string;
    address: string;
    typeDoc: string;
    numberDoc: string;
    callingCode: string;
    mobilePhone: string;
  };
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
