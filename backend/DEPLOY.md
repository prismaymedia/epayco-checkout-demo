# 🚀 Guía de Despliegue en Vercel

Esta guía te ayudará a desplegar el backend de ePayco Checkout en Vercel.

## 📋 Pre-requisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Llaves de ePayco (pública y privada)
3. Repositorio Git (GitHub, GitLab o Bitbucket)

## 🔧 Configuración

### 1. Variables de Entorno

Configura estas variables en tu proyecto de Vercel (Settings → Environment Variables):

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `EPAYCO_PUBLIC_KEY` | Llave pública de ePayco | `abc123...` |
| `EPAYCO_PRIVATE_KEY` | Llave privada de ePayco | `xyz789...` |
| `EPAYCO_AUTH_URL` | URL de autenticación | `https://apify.epayco.co/login` |
| `EPAYCO_SESSION_URL` | URL para crear sesión | `https://apify.epayco.co/payment/session/create` |
| `RESPONSE_URL` | URL del frontend | `https://tu-frontend.vercel.app/transaction-result.html` |
| `CONFIRMATION_URL` | URL webhook backend | `https://tu-backend.vercel.app/api/checkout/confirmation` |
| `NODE_ENV` | Ambiente | `production` |

### 2. Estructura de Archivos

```
backend/
├── api/
│   └── index.ts          # Entry point para Vercel
├── src/
│   ├── index.ts          # App Express
│   ├── routes/           # Rutas de la API
│   └── services/         # Servicios
├── vercel.json           # Configuración de Vercel
├── tsconfig.json         # TypeScript config
└── package.json
```

## 🌐 Métodos de Despliegue

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio
3. Configura el proyecto:
   - **Framework Preset**: Other
   - **Root Directory**: `backend` (si está en un monorepo)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: (dejar vacío)
4. Agrega las variables de entorno
5. Click en "Deploy"

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Navegar al directorio
cd backend

# Login (primera vez)
vercel login

# Desplegar
vercel

# O desplegar directamente a producción
npm run deploy
```

### Opción 3: GitHub Actions (CI/CD automático)

Vercel detecta automáticamente los commits en tu repositorio y despliega.

## 🔍 Verificación

Después del despliegue, verifica estos endpoints:

```bash
# Health check
curl https://tu-backend.vercel.app/health

# Documentación
https://tu-backend.vercel.app/api/docs
```

## 📝 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |
| GET | `/api/docs` | Documentación interactiva |
| POST | `/api/auth/login` | Autenticación con ePayco |
| POST | `/api/checkout/create-session` | Crear sesión de pago |
| POST | `/api/checkout/confirmation` | Webhook de confirmación |
| GET | `/api/checkout/webhooks` | Ver webhooks recibidos |
| GET | `/api/transaction/:reference` | Consultar transacción |

## ⚙️ Configuración Avanzada

### Custom Domain

En Vercel Dashboard → Settings → Domains, agrega tu dominio personalizado.

### Environment Variables por Branch

Puedes tener diferentes variables para:
- Production
- Preview (PRs)
- Development

### Regiones

Vercel despliega en múltiples regiones automáticamente. Configura la región primaria en Settings → General.

## 🐛 Troubleshooting

### Error: Module not found

Asegúrate de que todas las dependencias estén en `dependencies` (no en `devDependencies`).

```bash
npm install --save <package>
```

### Error: Build failed

Verifica que el build local funcione:

```bash
npm run build
```

### Webhooks no funcionan

1. Verifica que `CONFIRMATION_URL` apunte a tu backend en Vercel
2. Revisa los logs en Vercel Dashboard
3. Usa el endpoint `/api/checkout/webhooks` para ver si llegan

### Variables de entorno no se cargan

Las variables deben configurarse en Vercel Dashboard, **no** usar archivo `.env`.

## 📊 Monitoreo

- **Logs**: Vercel Dashboard → Deployments → [tu deployment] → Logs
- **Analytics**: Habilitado automáticamente en el dashboard
- **Speed Insights**: Disponible en el plan Pro

## 🔄 Actualización

Vercel redespliega automáticamente con cada push a tu rama principal. Para deploys manuales:

```bash
vercel --prod
```

## 💡 Notas Importantes

1. **Serverless**: Las funciones son serverless, no hay estado persistente entre invocaciones
2. **Timeouts**: Por defecto 10s (Hobby) o 60s (Pro)
3. **Cold Starts**: Primera invocación puede ser más lenta
4. **Storage**: Para webhooks persistentes, considera usar una base de datos (MongoDB, Supabase, etc.)

## 🔗 Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## 🆘 Soporte

- [Discord de Vercel](https://vercel.com/discord)
- [GitHub Issues](https://github.com/vercel/vercel/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)
