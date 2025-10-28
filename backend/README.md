# ePayco Checkout Backend API

API backend para integración con ePayco Smart Checkout. Permite autenticación, creación de sesiones de checkout, procesamiento de confirmaciones y consulta de transacciones.

## 🚀 Endpoints Disponibles

### Health Check
- **GET** `/health` - Verifica el estado del servidor y configuración

### Autenticación
- **POST** `/api/auth/login` - Obtiene token de autenticación de ePayco

### Checkout
- **POST** `/api/checkout/create-session` - Crea sesión de checkout
- **POST** `/api/checkout/confirmation` - Webhook para confirmaciones de pago

### Transacciones
- **GET** `/api/transaction/{reference}` - Consulta transacción por referencia

## 📖 Documentación Interactiva

Accede a la documentación completa de la API en:
- **URL**: http://localhost:3001/api/docs
- **Formato**: Interfaz interactiva con Scalar

## 🧪 Ejemplos de Uso

### 1. Obtener Token de Autenticación

```bash
curl --location --request POST 'http://localhost:3001/api/auth/login' \
--data ''
```

**Respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Crear Sesión de Checkout

```bash
curl --location --request POST 'http://localhost:3001/api/checkout/create-session' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Producto de Prueba",
    "description": "Descripción del producto de prueba",
    "amount": 10000,
    "currency": "COP",
    "country": "CO",
    "ip": "190.85.30.100"
}'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "titleResponse": "Session created successfully",
  "textResponse": "Session created successfully",
  "lastAction": "create session",
  "data": {
    "sessionId": "69000901be39d0eb1d172be5",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Respuesta de error de validación:**
```json
{
  "success": false,
  "titleResponse": "Error",
  "textResponse": "Some fields are required, please correct the errors and try again",
  "lastAction": "validation data",
  "data": {
    "totalErrors": 2,
    "errors": [
      {
        "codError": 500,
        "errorMessage": "field country is required"
      },
      {
        "codError": 500,
        "errorMessage": "field ip with invalid type"
      }
    ]
  }
}
```

### 3. Consultar Transacción

```bash
curl --location --request GET 'http://localhost:3001/api/transaction/REF123456789'
```

**Respuesta exitosa (desde caché):**
```json
{
  "success": true,
  "data": {
    "ref_payco": "REF123456789",
    "factura": "FACT001",
    "descripcion": "Producto de prueba",
    "valor": "10000",
    "moneda": "COP",
    "estado": "Aceptada",
    "respuesta": "Transacción aprobada",
    "fecha": "2025-10-27"
  },
  "source": "cache"
}
```

### 4. Webhook de Confirmación

```bash
curl --location --request POST 'http://localhost:3001/api/checkout/confirmation' \
--header 'Content-Type: application/json' \
--data '{
    "x_ref_payco": "REF123456789",
    "x_transaction_id": "TRX987654321",
    "x_amount": "10000",
    "x_currency_code": "COP",
    "x_transaction_state": "Aceptada",
    "x_approval_code": "APPR123",
    "x_response": "Aceptada",
    "x_signature": "test_signature_12345"
}'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Confirmación recibida"
}
```

## 📋 Campos Requeridos

### Create Session
- `name` (string): Nombre del producto
- `amount` (number): Monto en centavos
- `currency` (string): Código de moneda (COP, USD)
- `country` (string): Código de país ISO (ej: CO)

### Campos Opcionales
- `description` (string): Descripción del producto
- `ip` (string): IP del cliente (se detecta automáticamente si no se proporciona)

## ⚠️ Validaciones Importantes

1. **IP Format**: Debe ser una IP válida (formato IPv4). Ejemplo: `190.85.30.100`
2. **Country Code**: Debe ser código ISO de 2 letras en mayúsculas. Ejemplo: `CO`
3. **Currency**: Solo se soportan `COP` y `USD`
4. **Amount**: Debe ser un número mayor a 0

## 🔧 Configuración

Asegúrate de tener configuradas las siguientes variables de entorno:

```env
EPAYCO_PUBLIC_KEY=tu_clave_publica
EPAYCO_PRIVATE_KEY=tu_clave_privada
BACKEND_URL=http://localhost:3001
RESPONSE_URL=http://localhost:3002/transaction-result.html
PORT=3001
```

## 🧪 Testing

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

**Cobertura actual**: ~49% statements, ~44% branches, 12 tests pasando ✅

## 🚦 Estados de Respuesta

- `200`: Operación exitosa
- `400`: Error de validación (campos faltantes o inválidos)
- `404`: Recurso no encontrado (transacción)
- `500`: Error interno del servidor

## 📝 Notas Técnicas

- Todas las sesiones se crean en modo `test: true` automáticamente
- El sistema usa caché en memoria para transacciones (útil para testing)
- Las URLs de respuesta y confirmación se configuran automáticamente
- El token de autenticación se obtiene automáticamente al crear sesiones