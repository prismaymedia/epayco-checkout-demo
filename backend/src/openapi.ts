export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'ePayco Checkout API',
    version: '1.0.0',
    description: 'API para integración con ePayco Smart Checkout. Esta API permite autenticarse con ePayco, crear sesiones de checkout, procesar confirmaciones de pago y consultar transacciones.',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Health',
      description: 'Health check endpoint'
    },
    {
      name: 'Auth',
      description: 'Authentication with ePayco'
    },
    {
      name: 'Checkout',
      description: 'Checkout session management'
    },
    {
      name: 'Transaction',
      description: 'Transaction queries'
    }
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Verifica el estado del servidor y la configuración de las credenciales de ePayco',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { 
                      type: 'string', 
                      example: 'ok',
                      description: 'Estado del servidor'
                    },
                    timestamp: { 
                      type: 'string', 
                      format: 'date-time',
                      example: '2025-10-27T23:45:30.123Z'
                    },
                    env: {
                      type: 'object',
                      description: 'Estado de la configuración del entorno',
                      properties: {
                        publicKeyConfigured: { 
                          type: 'boolean',
                          description: 'Si la clave pública de ePayco está configurada'
                        },
                        privateKeyConfigured: { 
                          type: 'boolean',
                          description: 'Si la clave privada de ePayco está configurada'
                        },
                        responseUrlConfigured: { 
                          type: 'boolean',
                          description: 'Si la URL de respuesta está configurada'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Get ePayco authentication token',
        description: 'Obtiene un token de autenticación JWT de ePayco usando las credenciales configuradas. No requiere parámetros en el body.',
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Body vacío - no se requieren parámetros'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Token obtained successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { 
                      type: 'string',
                      description: 'Token JWT de ePayco',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGlmeWVQY...'
                    }
                  },
                  required: ['token']
                }
              }
            }
          },
          '500': {
            description: 'Error al obtener token - credenciales inválidas o error de conexión',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/checkout/create-session': {
      post: {
        tags: ['Checkout'],
        summary: 'Create checkout session',
        description: 'Crea una nueva sesión de checkout en ePayco. El servidor automáticamente obtiene el token de autenticación y configura las URLs de respuesta y confirmación.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'amount', 'currency', 'country'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Nombre del producto',
                    example: 'Producto de Prueba'
                  },
                  description: {
                    type: 'string',
                    description: 'Descripción del producto',
                    example: 'Descripción del producto de prueba'
                  },
                  amount: {
                    type: 'number',
                    description: 'Monto a cobrar en centavos (para COP)',
                    example: 10000,
                    minimum: 1
                  },
                  currency: {
                    type: 'string',
                    description: 'Código de moneda (ISO 4217)',
                    example: 'COP',
                    enum: ['COP', 'USD']
                  },
                  country: {
                    type: 'string',
                    description: 'Código de país (ISO 3166-1 alpha-2) - REQUERIDO por ePayco',
                    example: 'CO',
                    pattern: '^[A-Z]{2}$'
                  },
                  ip: {
                    type: 'string',
                    description: 'IP del cliente. Si no se proporciona, se detecta automáticamente. Debe ser una IP válida.',
                    example: '190.85.30.100',
                    pattern: '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Session created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { 
                      type: 'boolean', 
                      example: true,
                      description: 'Indica si la sesión se creó exitosamente'
                    },
                    titleResponse: { 
                      type: 'string', 
                      example: 'Session created successfully',
                      description: 'Título de la respuesta de ePayco'
                    },
                    textResponse: { 
                      type: 'string', 
                      example: 'Session created successfully',
                      description: 'Descripción de la respuesta de ePayco'
                    },
                    lastAction: { 
                      type: 'string', 
                      example: 'create session',
                      description: 'Última acción realizada'
                    },
                    data: {
                      type: 'object',
                      description: 'Datos de la sesión creada',
                      properties: {
                        sessionId: { 
                          type: 'string', 
                          example: '69000901be39d0eb1d172be5',
                          description: 'ID único de la sesión'
                        },
                        token: { 
                          type: 'string', 
                          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                          description: 'Token de la sesión para el checkout'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error - Errores de validación desde ePayco API',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { 
                      type: 'boolean', 
                      example: false,
                      description: 'Indica que hubo un error de validación'
                    },
                    titleResponse: { 
                      type: 'string', 
                      example: 'Error',
                      description: 'Título del error'
                    },
                    textResponse: { 
                      type: 'string', 
                      example: 'Some fields are required, please correct the errors and try again',
                      description: 'Descripción del error'
                    },
                    lastAction: { 
                      type: 'string', 
                      example: 'validation data',
                      description: 'Acción donde ocurrió el error'
                    },
                    data: {
                      type: 'object',
                      description: 'Detalles de los errores de validación',
                      properties: {
                        totalErrors: { 
                          type: 'number', 
                          example: 2,
                          description: 'Número total de errores'
                        },
                        errors: {
                          type: 'array',
                          description: 'Lista de errores específicos',
                          items: {
                            type: 'object',
                            properties: {
                              codError: { 
                                type: 'number', 
                                example: 500 
                              },
                              errorMessage: { 
                                type: 'string', 
                                example: 'field country is required' 
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/checkout/confirmation': {
      post: {
        tags: ['Checkout'],
        summary: 'Webhook confirmation',
        description: 'Endpoint webhook que recibe confirmaciones de pago desde ePayco. Este endpoint es llamado automáticamente por ePayco cuando se completa una transacción.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                description: 'Datos de confirmación enviados por ePayco',
                properties: {
                  x_ref_payco: { 
                    type: 'string',
                    description: 'Referencia de ePayco',
                    example: 'REF123456789'
                  },
                  x_transaction_id: { 
                    type: 'string',
                    description: 'ID de la transacción',
                    example: 'TRX987654321'
                  },
                  x_amount: { 
                    type: 'string',
                    description: 'Monto de la transacción',
                    example: '10000'
                  },
                  x_currency_code: { 
                    type: 'string',
                    description: 'Código de moneda',
                    example: 'COP'
                  },
                  x_transaction_state: { 
                    type: 'string',
                    description: 'Estado de la transacción',
                    example: 'Aceptada',
                    enum: ['Aceptada', 'Rechazada', 'Pendiente', 'Fallida']
                  },
                  x_approval_code: { 
                    type: 'string',
                    description: 'Código de aprobación',
                    example: 'APPR123'
                  },
                  x_response: { 
                    type: 'string',
                    description: 'Respuesta de la transacción',
                    example: 'Aceptada'
                  },
                  x_signature: { 
                    type: 'string',
                    description: 'Firma de seguridad',
                    example: 'test_signature_12345'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Confirmation received and processed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { 
                      type: 'boolean', 
                      example: true,
                      description: 'Indica que la confirmación fue procesada'
                    },
                    message: { 
                      type: 'string', 
                      example: 'Confirmación recibida',
                      description: 'Mensaje de confirmación'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/transaction/{reference}': {
      get: {
        tags: ['Transaction'],
        summary: 'Get transaction by reference',
        description: 'Obtiene información de una transacción por su referencia. Primero busca en caché local, luego consulta la API de ePayco si no se encuentra.',
        parameters: [
          {
            name: 'reference',
            in: 'path',
            required: true,
            description: 'Referencia de la transacción a consultar',
            schema: {
              type: 'string',
              example: 'REF123456789'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Transaction found (from cache or ePayco API)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { 
                      type: 'boolean', 
                      example: true,
                      description: 'Indica que la transacción fue encontrada'
                    },
                    data: {
                      type: 'object',
                      description: 'Datos de la transacción',
                      properties: {
                        ref_payco: { 
                          type: 'string',
                          example: 'REF123456789',
                          description: 'Referencia de ePayco'
                        },
                        factura: { 
                          type: 'string',
                          example: 'FACT001',
                          description: 'Número de factura'
                        },
                        descripcion: { 
                          type: 'string',
                          example: 'Producto de prueba',
                          description: 'Descripción de la transacción'
                        },
                        valor: { 
                          type: 'string',
                          example: '10000',
                          description: 'Valor de la transacción'
                        },
                        moneda: { 
                          type: 'string',
                          example: 'COP',
                          description: 'Moneda de la transacción'
                        },
                        estado: { 
                          type: 'string',
                          example: 'Aceptada',
                          description: 'Estado de la transacción'
                        },
                        respuesta: { 
                          type: 'string',
                          example: 'Transacción aprobada',
                          description: 'Respuesta de la transacción'
                        },
                        fecha: { 
                          type: 'string',
                          example: '2025-10-27',
                          description: 'Fecha de la transacción'
                        }
                      }
                    },
                    source: {
                      type: 'string',
                      enum: ['cache', 'epayco'],
                      example: 'cache',
                      description: 'Fuente de los datos (caché local o API de ePayco)'
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Transaction not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { 
                      type: 'boolean', 
                      example: false,
                      description: 'Indica que la transacción no fue encontrada'
                    },
                    error: { 
                      type: 'string', 
                      example: 'Transacción no encontrada',
                      description: 'Mensaje de error'
                    },
                    reference: { 
                      type: 'string',
                      example: 'REF123456789',
                      description: 'Referencia consultada'
                    },
                    message: { 
                      type: 'string',
                      example: 'La transacción puede estar pendiente de procesamiento',
                      description: 'Mensaje adicional'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        description: 'Estructura de error estándar del servidor',
        properties: {
          success: { 
            type: 'boolean', 
            example: false,
            description: 'Siempre false para errores'
          },
          error: { 
            type: 'string',
            description: 'Mensaje de error legible',
            example: 'Error interno del servidor'
          },
          stack: { 
            type: 'string', 
            description: 'Stack trace (solo en modo desarrollo)',
            example: 'Error: Something went wrong\n    at ...'
          }
        },
        required: ['success', 'error']
      },
      EpaycoValidationError: {
        type: 'object',
        description: 'Error de validación devuelto por ePayco API',
        properties: {
          success: { 
            type: 'boolean', 
            example: false 
          },
          titleResponse: { 
            type: 'string', 
            example: 'Error' 
          },
          textResponse: { 
            type: 'string', 
            example: 'Some fields are required, please correct the errors and try again' 
          },
          lastAction: { 
            type: 'string', 
            example: 'validation data' 
          },
          data: {
            type: 'object',
            properties: {
              totalErrors: { type: 'number' },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    codError: { type: 'number' },
                    errorMessage: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
