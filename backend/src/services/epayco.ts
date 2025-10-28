import fetch from 'node-fetch';
import type { SessionData, EpaycoAuthResponse, EpaycoSessionResponse, Transaction } from '../types.js';

/**
 * Obtiene el token de autenticación de ePayco Apify
 * @returns {Promise<EpaycoAuthResponse>} Respuesta completa del API
 */
export async function getEpaycoToken(): Promise<EpaycoAuthResponse> {
  const publicKey = process.env.EPAYCO_PUBLIC_KEY;
  const privateKey = process.env.EPAYCO_PRIVATE_KEY;
  const loginUrl = process.env.EPAYCO_LOGIN_URL || 'https://apify.epayco.co/login';
  
  if (!publicKey || !privateKey) {
    throw new Error('Credenciales de ePayco no configuradas');
  }
  
  // Crear Basic Auth
  const credentials = Buffer.from(`${publicKey}:${privateKey}`).toString('base64');
  
  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al autenticar con ePayco: ${response.status} - ${error}`);
    }
    
    const data = await response.json() as EpaycoAuthResponse;
    
    if (!data.token) {
      throw new Error('No se recibió token de ePayco');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getEpaycoToken:', error);
    throw error;
  }
}

/**
 * Crea una sesión de checkout en ePayco
 * @param {string} token - Token de autenticación
 * @param {SessionData} sessionData - Datos de la sesión
 * @returns {Promise<EpaycoSessionResponse>} Respuesta con sessionId
 */
export async function createCheckoutSession(
  token: string, 
  sessionData: SessionData
): Promise<EpaycoSessionResponse> {
  const sessionUrl = process.env.EPAYCO_SESSION_URL || 'https://apify.epayco.co/payment/session/create';
  
  try {
    // Asegurar que los campos requeridos tengan el formato correcto
    const requestData = {
      checkout_version: "2",
      name: sessionData.name,
      description: sessionData.description,
      currency: sessionData.currency.toUpperCase(),
      amount: sessionData.amount, // Enviar como número
      country: sessionData.country,
      lang: sessionData.lang,
      ip: sessionData.ip,
      test: true, // Siempre true en desarrollo - como booleano
      response: sessionData.response,
      confirmation: sessionData.confirmation,
      
      // Campos opcionales por defecto
      method: sessionData.method || "POST",
      dues: sessionData.dues || 1,
      noRedirectOnClose: sessionData.noRedirectOnClose !== undefined ? sessionData.noRedirectOnClose : true,
      forceResponse: sessionData.forceResponse || false,
      uniqueTransactionPerBill: sessionData.uniqueTransactionPerBill || false,
      autoClick: sessionData.autoClick || false,
      methodsDisable: sessionData.methodsDisable || [],
      config: sessionData.config || {},
      
      // Agregar opcionalmente si vienen en sessionData
      ...(sessionData.taxBase && { taxBase: sessionData.taxBase }),
      ...(sessionData.tax && { tax: sessionData.tax }),
      ...(sessionData.taxIco !== undefined && { taxIco: sessionData.taxIco }),
      ...(sessionData.extras && { extras: sessionData.extras }),
      ...(sessionData.extrasEpayco && { extrasEpayco: sessionData.extrasEpayco }),
      ...(sessionData.billing && { billing: sessionData.billing }),
      ...(sessionData.splitPayment && { splitPayment: sessionData.splitPayment })
    };
    
    const response = await fetch(sessionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    
    // Parsear la respuesta como JSON
    const data = await response.json() as EpaycoSessionResponse;
    
    // Si ePayco retorna success=false, lanzar error con la respuesta completa
    if (!data.success) {
      const error: any = new Error('ePayco API returned error');
      error.epaycoResponse = data; // Guardar la respuesta completa
      error.isValidationError = true;
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error en createCheckoutSession:', error);
    // Si ya tiene epaycoResponse, re-lanzar tal cual
    if (error.epaycoResponse) {
      throw error;
    }
    // Error de red u otro
    throw error;
  }
}

/**
 * Obtiene información de una transacción por referencia
 * @param {string} reference - Referencia de la transacción
 * @returns {Promise<Transaction>} Datos de la transacción
 */
export async function getTransactionByReference(reference: string): Promise<Transaction> {
  const publicKey = process.env.EPAYCO_PUBLIC_KEY;
  const transactionUrl = process.env.EPAYCO_TRANSACTION_URL || 'https://secure.epayco.co/validation/v1/reference';
  
  if (!publicKey) {
    throw new Error('PUBLIC_KEY no configurada');
  }
  
  try {
    const url = `${transactionUrl}/${reference}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicKey}`
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al obtener transacción: ${response.status} - ${error}`);
    }
    
    const data = await response.json() as Transaction;
    return data;
  } catch (error) {
    console.error('Error en getTransactionByReference:', error);
    throw error;
  }
}
