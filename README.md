# ePayco Checkout Backend

Backend API para integración con ePayco Smart Checkout. Proporciona endpoints para autenticación, creación de sesiones de checkout, procesamiento de confirmaciones y consulta de transacciones.

## 🚀 Inicio Rápido

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

### 3. Ejecutar el Servidor

```bash
# Modo desarrollo (con hot reload)
yarn dev

# Modo producción
yarn build
yarn start
```

## 📖 Documentación

- **API Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health

## 🛠️ Scripts Disponibles

```bash
yarn dev             # Inicia servidor en modo desarrollo
yarn build           # Compila el proyecto TypeScript
yarn start           # Inicia servidor en modo producción
yarn test            # Ejecuta las pruebas
yarn test:coverage   # Ejecuta pruebas con cobertura
yarn setup           # Configuración inicial del proyecto
```

## 📁 Estructura del Proyecto

```
examples/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── routes/         # Rutas de la API
│   │   ├── services/       # Servicios (ePayco integration)
│   │   ├── types.ts        # Tipos TypeScript
│   │   ├── openapi.ts      # Documentación OpenAPI
│   │   └── index.ts        # Servidor principal
│   ├── tests/              # Pruebas automatizadas
│   ├── coverage/           # Reportes de cobertura
│   └── dist/               # Código compilado
├── scripts/                # Scripts de utilidad
└── package.json            # Configuración del workspace
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