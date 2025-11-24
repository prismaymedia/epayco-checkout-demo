# 🚀 Despliegue del Frontend en Vercel

Esta guía te ayudará a desplegar el frontend HTML estático en Vercel.

## 📋 Pre-requisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Backend ya desplegado en Vercel
3. Repositorio Git (GitHub, GitLab o Bitbucket)

## 🔧 Configuración

### 1. Configurar URL del Backend

Antes de desplegar, actualiza la URL del backend en `assets/js/config.js`:

```javascript
// Cambiar esta línea:
return 'https://your-backend.vercel.app';

// Por tu URL real de backend:
return 'https://tu-backend-real.vercel.app';
```

### 2. Estructura de Archivos

```
frontend-html/
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── config.js       # Configuración de URLs
│       └── app.js          # Lógica de la aplicación
├── index.html              # Página principal
├── onepage.html            # Checkout One Page
├── component.html          # Checkout Component
├── standard.html           # Checkout Standard
├── transaction-result.html # Página de resultados
├── vercel.json             # Configuración de Vercel
└── package.json
```

## 🌐 Métodos de Despliegue

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio
3. Configura el proyecto:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend-html` (si está en un monorepo)
   - **Build Command**: (dejar vacío, es HTML estático)
   - **Output Directory**: (dejar vacío)
4. Click en "Deploy"

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# Navegar al directorio
cd frontend-html

# Login (primera vez)
vercel login

# Desplegar en preview
npm run preview

# O desplegar directamente a producción
npm run deploy
```

### Opción 3: GitHub Actions (CI/CD automático)

Vercel detecta automáticamente los commits en tu repositorio y despliega.

## 🔍 Verificación

Después del despliegue, verifica:

```bash
# Página principal
https://tu-frontend.vercel.app/

# Tipos de checkout
https://tu-frontend.vercel.app/onepage.html
https://tu-frontend.vercel.app/component.html
https://tu-frontend.vercel.app/standard.html
```

## 📝 Páginas Disponibles

| Página | URL | Descripción |
|--------|-----|-------------|
| Principal | `/` o `/index.html` | Catálogo de productos y navegación |
| One Page | `/onepage.html` | Checkout integrado en la página |
| Component | `/component.html` | Checkout como componente embebido |
| Standard | `/standard.html` | Checkout con redirección a ePayco |
| Resultado | `/transaction-result.html` | Página de resultados del pago |

## 🔗 Conectar Frontend con Backend

### Método 1: Actualizar config.js (Recomendado)

Edita `assets/js/config.js`:

```javascript
return 'https://tu-backend-real.vercel.app';
```

### Método 2: Meta Tag (Opcional)

Agrega un meta tag en cada HTML:

```html
<head>
  <meta name="api-base-url" content="https://tu-backend.vercel.app">
</head>
```

El `config.js` detectará automáticamente este meta tag.

## ⚙️ Configuración Avanzada

### Custom Domain

En Vercel Dashboard → Settings → Domains, agrega tu dominio personalizado.

### CORS

Asegúrate de que tu backend permita requests desde tu dominio de frontend:

```javascript
// En el backend
app.use(cors({
  origin: ['https://tu-frontend.vercel.app', 'http://localhost:3002']
}));
```

### Environment Variables

Para URLs dinámicas, puedes usar variables de entorno en Vercel:

1. Dashboard → Settings → Environment Variables
2. Agregar `VITE_API_URL` o similar
3. Acceder desde JavaScript (requiere build step)

## 🐛 Troubleshooting

### Error: Backend no responde

1. Verifica que el backend esté desplegado y funcionando
2. Revisa la URL en `config.js`
3. Verifica CORS en el backend
4. Abre la consola del navegador para ver errores

### Error: checkout.epayco.co bloqueado

Si estás en HTTPS, asegúrate de que todos los recursos sean HTTPS.

### Página en blanco

1. Abre la consola del navegador (F12)
2. Verifica que `config.js` y `app.js` se carguen
3. Revisa errores de JavaScript

## 📊 Testing Local

Antes de desplegar, prueba localmente:

```bash
# Iniciar servidor local
npm run dev

# Abrir en navegador
http://localhost:3002
```

Asegúrate de que:
1. El backend esté corriendo en `http://localhost:3001`
2. Todos los botones funcionen
3. El checkout se abra correctamente

## 🔄 Actualización

Vercel redespliega automáticamente con cada push. Para deploys manuales:

```bash
npm run deploy
```

## 💡 Notas Importantes

1. **Sin Build Step**: Este es un sitio estático, no requiere compilación
2. **HTTPS**: Vercel proporciona HTTPS automáticamente
3. **CDN Global**: Tu sitio se distribuye globalmente
4. **Caché**: Los assets estáticos se cachean automáticamente

## 🔗 URLs de Producción

Después del despliegue, necesitarás actualizar estas URLs en tu backend:

**Backend `.env`:**
```env
RESPONSE_URL=https://tu-frontend.vercel.app/transaction-result.html
```

**ePayco Dashboard:**
- URL de Respuesta: `https://tu-frontend.vercel.app/transaction-result.html`
- URL de Confirmación: `https://tu-backend.vercel.app/api/checkout/confirmation`

## 🆘 Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Static Sites](https://vercel.com/docs/concepts/deployments/overview)

## ✅ Checklist Pre-Despliegue

- [ ] Backend desplegado y funcionando
- [ ] URL del backend actualizada en `config.js`
- [ ] Probado localmente
- [ ] CORS configurado en el backend
- [ ] Variables de entorno configuradas
- [ ] Dominio personalizado configurado (opcional)
