# 🎨 Frontend HTML - Smart Checkout Demo

Una demostración completa de los tres tipos de checkout de ePayco implementados con HTML, CSS y JavaScript vanilla.

## 🌐 Despliegue

### Desarrollo Local
```bash
npm run dev
```
Disponible en `http://localhost:3002`

### Producción en Vercel
Lee la guía completa: **[DEPLOY.md](./DEPLOY.md)**

Quick start:
```bash
npm run deploy
```

## 📋 Descripción

Este proyecto demuestra la integración de los tres tipos de checkout de ePayco:

- **OnePage**: Checkout en popup overlay
- **Standard**: Checkout en nueva ventana/pestaña
- **Component**: Checkout embebido como componente

## 🚀 Características

- ✅ **Vanilla JavaScript**: Sin frameworks, código puro
- ✅ **Responsive Design**: Funciona en móvil y desktop
- ✅ **Tipo de Checkout Dinámico**: Cambia entre onepage, standard y component
- ✅ **Integración Completa**: Conecta con el backend API
- ✅ **Manejo de Errores**: Validación y feedback visual
- ✅ **UI/UX Moderna**: Diseño inspirado en ePayco

## 📁 Estructura

```
frontend-html/
├── index.html              # Página principal (ecommerce)
├── onepage.html            # Demo OnePage Checkout
├── standard.html           # Demo Standard Checkout  
├── component.html          # Demo Component Checkout
├── transaction-result.html # Página de resultados de transacción
├── package.json           # Configuración del proyecto
├── assets/
│   ├── css/
│   │   └── styles.css     # Estilos globales
│   └── js/
│       └── app.js         # Lógica de la aplicación
└── README.md              # Esta documentación
```

## 🛠️ Instalación

### Prerrequisitos

- Node.js 18+ (para servidor local)
- Backend API corriendo en puerto 3001

### Opción 1: Servidor Node.js

```bash
cd examples/frontend-html
npm install
npm start
```

La aplicación estará disponible en: http://localhost:3002

### Opción 2: Servidor Python

```bash
cd examples/frontend-html
python3 -m http.server 3002
```

### Opción 3: Servidor PHP

```bash
cd examples/frontend-html
php -S localhost:3002
```

### Opción 4: Live Server (VS Code)

1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

## 🎯 Uso

### 1. Página Principal (index.html)

- Muestra catálogo de productos
- Botones para iniciar checkout
- Comparación de tipos de checkout

### 2. OnePage Checkout

- Se abre en popup/overlay
- Permanece en la misma página
- Ideal para experiencia fluida

### 3. Standard Checkout

- Se abre en nueva ventana/pestaña
- Redirige después del pago
- Más tradicional

### 4. Component Checkout

- Se embebe directamente en la página
- Máxima personalización
- Control total del flujo

## 🔧 Configuración

### Backend API

Asegúrate de que el backend esté corriendo:

```bash
cd examples/backend
npm start
```

### Variables de Entorno

El frontend se conecta automáticamente a:

- **Backend API**: `http://localhost:3001`
- **ePayco Script**: Se carga dinámicamente

### Productos Demo

Los productos están configurados en `assets/js/app.js`:

```javascript
const ProductManager = {
  products: [
    {
      id: 'basic-plan',
      name: 'Plan Básico',
      amount: 29900, // $299.00 COP
      currency: 'COP'
    },
    // ... más productos
  ]
};
```

## 📱 Funcionalidades

### Gestión de Estados

- **Loading**: Indicador visual durante operaciones
- **Error Handling**: Mensajes de error descriptivos
- **Success**: Confirmaciones de acciones exitosas

### API Integration

- **Health Check**: Verifica disponibilidad del backend
- **Session Creation**: Crea sesiones de checkout
- **Product Validation**: Valida datos del producto

### ePayco Integration

- **Script Loading**: Carga dinámica del script de ePayco
- **Event Handlers**: Manejo de eventos del checkout
- **Type Support**: Soporte para todos los tipos

## 🎨 Personalización

### Estilos

Edita `assets/css/styles.css` para personalizar:

- Colores y gradientes
- Tipografía
- Espaciado y layout
- Animaciones

### Productos

Modifica `ProductManager.products` en `app.js`:

```javascript
{
  id: 'mi-producto',
  name: 'Mi Producto',
  description: 'Descripción del producto',
  amount: 50000, // Precio en centavos
  currency: 'COP',
  icon: '🛍️'
}
```

### Tipos de Checkout

Usa cualquiera de los tres tipos:

```javascript
// OnePage (popup)
initializeCheckout('product-id', 'onepage');

// Standard (nueva ventana)
initializeCheckout('product-id', 'standard');

// Component (embebido)
initializeCheckout('product-id', 'component');
```

## 🐛 Debugging

### Console Logs

El sistema incluye logging detallado:

```javascript
Utils.log('Mensaje de debug', datos);
```

### Network Tab

Monitorea las peticiones al backend:

- `GET /api/health` - Health check
- `POST /api/checkout/session` - Crear sesión

### ePayco Events

Los eventos de ePayco se loggean automáticamente:

- `onCreated`: Checkout creado
- `onErrors`: Errores del checkout
- `onClosed`: Checkout cerrado

## 📚 API Reference

### Funciones Principales

```javascript
// Inicializar checkout
initializeCheckout(productId, checkoutType)

// Gestores de utilidades
Utils.showLoading()
Utils.hideLoading()
Utils.showToast(message, type)

// Gestor de productos
ProductManager.getProduct(id)
ProductManager.getAllProducts()

// Gestor de ePayco
EPaycoManager.loadScript()
EPaycoManager.configure(sessionId, type)
EPaycoManager.open()
```

### Event Handlers

```javascript
// Eventos del checkout
checkout.onCreated(() => {
  console.log('Checkout creado');
});

checkout.onErrors((errors) => {
  console.error('Error:', errors);
});

checkout.onClosed(() => {
  console.log('Checkout cerrado');
});
```

## 🔍 Testing

### Manual Testing

1. **Health Check**: Verifica que el backend responda
2. **Product Loading**: Confirma que los productos se muestren
3. **Checkout Flow**: Prueba cada tipo de checkout
4. **Error Handling**: Simula errores de conexión

### Browser Console

Abre DevTools y busca:

- Mensajes de log del sistema
- Errores de red
- Eventos de ePayco

## 🚨 Troubleshooting

### Backend No Disponible

```
Error: Backend no disponible
```

**Solución**: Asegúrate de que el backend esté corriendo en puerto 3001

### Script de ePayco No Carga

```
Error: No se pudo cargar el script de ePayco
```

**Solución**: Verifica tu conexión a internet

### Component No Se Muestra

**Solución**: Asegúrate de que existe el elemento `#epayco-component`

### CORS Errors

**Solución**: El backend debe estar configurado con CORS habilitado

## 🎉 Demo Live

Para ver el demo en acción:

1. Inicia el backend: `cd examples/backend && npm start`
2. Inicia el frontend: `cd examples/frontend-html && npm start`
3. Visita: http://localhost:3002

## 📄 Licencia

Este proyecto es parte del demo de integración con ePayco y está destinado únicamente para fines educativos y de demostración.

---

**Nota**: Este frontend está diseñado para trabajar con el backend API incluido en el proyecto. Asegúrate de tener ambos servicios corriendo para una experiencia completa.