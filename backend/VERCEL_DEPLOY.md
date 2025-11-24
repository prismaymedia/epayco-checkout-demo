# Despliegue en Vercel - Backend ePayco Checkout

## Configuración para Vercel

### 1. Instalar Vercel CLI (opcional)
```bash
npm install -g vercel
```

### 2. Variables de entorno en Vercel

Configura las siguientes variables de entorno en tu proyecto de Vercel:

- `EPAYCO_PUBLIC_KEY`: Tu llave pública de ePayco
- `EPAYCO_PRIVATE_KEY`: Tu llave privada de ePayco
- `EPAYCO_AUTH_URL`: `https://apify.epayco.co/login`
- `EPAYCO_SESSION_URL`: `https://apify.epayco.co/payment/session/create`
- `RESPONSE_URL`: URL de tu frontend donde redirigir después del pago (ej: `https://tu-frontend.vercel.app/transaction-result.html`)
- `CONFIRMATION_URL`: URL de tu backend en Vercel para webhooks (ej: `https://tu-backend.vercel.app/api/checkout/confirmation`)
- `NODE_ENV`: `production`

### 3. Desplegar

#### Opción A: Desde el dashboard de Vercel
1. Conecta tu repositorio de GitHub/GitLab/Bitbucket
2. Selecciona el directorio `backend`
3. Configura las variables de entorno
4. Despliega

#### Opción B: Desde CLI
```bash
cd backend
vercel
```

### 4. Endpoints disponibles

Una vez desplegado, tu API estará disponible en:
- `GET /health` - Estado del servidor
- `GET /api/docs` - Documentación API
- `POST /api/auth/login` - Autenticación
- `POST /api/checkout/create-session` - Crear sesión de pago
- `POST /api/checkout/confirmation` - Webhook de confirmación
- `GET /api/checkout/webhooks` - Ver webhooks recibidos
- `GET /api/transaction/:reference` - Consultar transacción

### 5. Notas importantes

- El servidor no usa `app.listen()` en Vercel, se exporta directamente la app
- Localtunnel no se inicia en producción
- Las funciones de Vercel son serverless, por lo que los webhooks en memoria no persisten entre invocaciones
- Considera usar una base de datos (MongoDB, PostgreSQL, etc.) para producción

### 6. Build settings en Vercel

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: (dejar vacío, usa serverless functions)
- **Install Command**: `npm install`
- **Root Directory**: `backend` (si tu proyecto está en un monorepo)

### 7. Desarrollo local

Para desarrollo local, sigue usando:
```bash
npm run dev
```

El servidor local seguirá funcionando con localtunnel en `http://localhost:3001`
