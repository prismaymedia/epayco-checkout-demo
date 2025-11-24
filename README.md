# 🚀 ePayco Checkout - Demo Completo

Proyecto completo de demostración de integración con ePayco Smart Checkout, incluyendo backend API y frontend HTML con los tres tipos de checkout.

## 📁 Estructura del Proyecto

```
examples/
├── backend/              # API REST con Express + TypeScript
│   ├── src/             # Código fuente
│   ├── api/             # Entry point Vercel
│   ├── DEPLOY.md        # Guía de despliegue en Vercel
│   └── README.md        # Documentación del backend
│
├── frontend-html/       # Frontend HTML estático
│   ├── assets/          # CSS, JS y recursos
│   ├── *.html           # Páginas de checkout
│   ├── DEPLOY.md        # Guía de despliegue en Vercel
│   └── README.md        # Documentación del frontend
│
└── README.md           # Este archivo
```

## 🎯 Características

### Backend
- ✅ API REST con Express + TypeScript
- ✅ Autenticación con ePayco
- ✅ Creación de sesiones de checkout
- ✅ Webhook de confirmación de pagos
- ✅ Consulta de transacciones
- ✅ Documentación interactiva (Scalar)
- ✅ Tests con Jest
- ✅ Listo para Vercel

### Frontend
- ✅ HTML + CSS + JavaScript vanilla
- ✅ Tres tipos de checkout (OnePage, Standard, Component)
- ✅ Diseño responsive
- ✅ Integración completa con backend
- ✅ Página de resultados de transacción
- ✅ Listo para Vercel

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Configuración Inicial

```bash
# Instalar dependencias
yarn install

# Configurar archivo de entorno
yarn setup
```

### 2. Configurar Credenciales

Edita el archivo `backend/.env` con tus credenciales de ePayco:

```env
EPAYCO_PUBLIC_KEY=tu_clave_publica_epayco
EPAYCO_PRIVATE_KEY=tu_clave_privada_epayco
BACKEND_URL=http://localhost:3001
RESPONSE_URL=http://localhost:3002/transaction-result.html
PORT=3001
```

### 3. Ejecutar Backend y Frontend

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Backend disponible en http://localhost:3001

# Terminal 2 - Frontend
cd frontend-html
npm run dev
# Frontend disponible en http://localhost:3002
```

## 🌐 Despliegue en Vercel

### Backend

```bash
cd backend
npm run verify-vercel    # Verificar configuración
npm run deploy           # Desplegar a Vercel
```

📖 **Guía completa**: [backend/DEPLOY.md](./backend/DEPLOY.md)

### Frontend

```bash
# 1. Primero despliega el backend y copia la URL

# 2. Actualiza frontend-html/assets/js/config.js con la URL del backend

# 3. Despliega el frontend
cd frontend-html
npm run verify          # Verificar configuración
npm run deploy          # Desplegar a Vercel
```

📖 **Guía completa**: [frontend-html/DEPLOY.md](./frontend-html/DEPLOY.md)

## 📖 Documentación

### Desarrollo Local
- **API Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health
- **Frontend**: http://localhost:3002

### Producción
- **Backend API**: https://tu-backend.vercel.app/api/docs
- **Frontend**: https://tu-frontend.vercel.app

## 🛠️ Scripts Disponibles

### Workspace (raíz)
```bash
yarn install         # Instalar todas las dependencias
yarn setup          # Configuración inicial
yarn dev            # Iniciar backend en desarrollo
yarn build          # Compilar backend
yarn test           # Ejecutar tests
```

### Backend
```bash
cd backend
npm run dev              # Desarrollo con hot reload
npm run build            # Compilar TypeScript
npm run start            # Producción
npm run test             # Tests
npm run verify-vercel    # Verificar config Vercel
npm run deploy           # Desplegar a Vercel
```

### Frontend
```bash
cd frontend-html
npm run dev              # Servidor local
npm run verify           # Verificar config
npm run deploy           # Desplegar a Vercel
```

## 📁 Estructura Detallada

```
examples/
├── backend/                    # API Backend con Express
│   ├── api/
│   │   └── index.ts           # Entry point Vercel
│   ├── src/
│   │   ├── routes/            # Rutas de la API
│   │   │   ├── auth.ts        # Autenticación ePayco
│   │   │   ├── checkout.ts    # Crear sesión, webhooks
│   │   │   └── transaction.ts # Consultar transacciones
│   │   ├── services/          # Lógica de negocio
│   │   │   ├── epayco.ts      # Integración ePayco
│   │   │   ├── webhook.ts     # Manejo de webhooks
│   │   │   └── tunnel.ts      # Localtunnel para dev
│   │   ├── types.ts           # Tipos TypeScript
│   │   ├── openapi.ts         # Documentación OpenAPI
│   │   └── index.ts           # Servidor Express
│   ├── tests/                 # Tests con Jest
│   ├── scripts/
│   │   └── verify-vercel.cjs  # Verificación pre-deploy
│   ├── vercel.json            # Config Vercel
│   ├── DEPLOY.md              # Guía de despliegue
│   └── README.md              # Documentación
│
├── frontend-html/              # Frontend estático
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css     # Estilos globales
│   │   └── js/
│   │       ├── config.js      # Config dinámica URLs
│   │       └── app.js         # Lógica de checkout
│   ├── index.html             # Página principal
│   ├── onepage.html           # Checkout One Page
│   ├── component.html         # Checkout Component
│   ├── standard.html          # Checkout Standard
│   ├── transaction-result.html # Resultados de pago
│   ├── scripts/
│   │   └── verify-deployment.cjs # Verificación
│   ├── vercel.json            # Config Vercel
│   ├── DEPLOY.md              # Guía de despliegue
│   └── README.md              # Documentación
│
├── scripts/                    # Scripts de utilidad
│   ├── check-setup.js         # Verificar setup
│   └── setup.js               # Configuración inicial
└── package.json               # Workspace config
```

## 🧪 Pruebas

El proyecto incluye pruebas automatizadas completas:

```bash
# Ejecutar pruebas
yarn test

# Ejecutar con cobertura
yarn test:coverage

# Ejecutar en modo watch
yarn workspace backend test:watch
```

**Cobertura actual**: ~49% statements, 12 tests pasando ✅

## 🔌 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servidor |
| POST | `/api/auth/login` | Obtener token de ePayco |
| POST | `/api/checkout/create-session` | Crear sesión de checkout |
| POST | `/api/checkout/confirmation` | Webhook de confirmación |
| GET | `/api/transaction/{reference}` | Consultar transacción |

## 🔧 Desarrollo

### Prerrequisitos
- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Credenciales de ePayco (público y privado)

### Variables de Entorno Requeridas
- `EPAYCO_PUBLIC_KEY`: Clave pública de ePayco
- `EPAYCO_PRIVATE_KEY`: Clave privada de ePayco
- `BACKEND_URL`: URL base del backend
- `RESPONSE_URL`: URL de respuesta después del pago

## 📝 Notas Importantes

- El servidor se ejecuta en modo **test** automáticamente
- Todas las transacciones son de prueba
- El sistema incluye caché en memoria para transacciones
- La documentación interactiva está disponible en `/api/docs`

## 🆘 Solución de Problemas

### Puerto en Uso
```bash
# Ver qué proceso usa el puerto 3001
lsof -ti:3001

# Terminar proceso en el puerto
lsof -ti:3001 | xargs kill
```

### Problemas de Configuración
```bash
# Re-ejecutar configuración
yarn setup

# Verificar configuración
node scripts/check-setup.js
```

## 📚 Documentación Adicional

- [ePayco API Documentation](https://docs.epayco.co/)
- [Backend README](./backend/README.md) - Documentación detallada del API
- [OpenAPI Specification](http://localhost:3001/api/docs) - Documentación interactiva