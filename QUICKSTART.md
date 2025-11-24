# 🚀 Quick Start - Despliegue en Vercel

## ⚡ Resumen Rápido

### 1️⃣ Backend (5 minutos)

```bash
cd backend
npm run verify-vercel
npm run deploy
```

Copia la URL: `https://tu-backend.vercel.app`

### 2️⃣ Actualizar Frontend (1 minuto)

Edita `frontend-html/assets/js/config.js` línea 8:

```javascript
return 'https://tu-backend-real.vercel.app';
```

### 3️⃣ Frontend (3 minutos)

```bash
cd frontend-html
npm run verify
npm run deploy
```

Copia la URL: `https://tu-frontend.vercel.app`

### 4️⃣ Variables de Entorno (2 minutos)

En Vercel Dashboard → Backend → Settings → Environment Variables:

- `RESPONSE_URL` = `https://tu-frontend.vercel.app/transaction-result.html`
- `CONFIRMATION_URL` = `https://tu-backend.vercel.app/api/checkout/confirmation`

## ✅ Verificación

```bash
# Backend
curl https://tu-backend.vercel.app/health

# Frontend
open https://tu-frontend.vercel.app
```

## 📚 Más Información

- [backend/DEPLOY.md](./backend/DEPLOY.md) - Guía detallada backend
- [frontend-html/DEPLOY.md](./frontend-html/DEPLOY.md) - Guía detallada frontend
- [README.md](./README.md) - Documentación completa

## 🆘 Problemas Comunes

### Error: Module not found
```bash
cd backend && npm install
```

### Frontend no conecta con backend
Verifica que `config.js` tenga la URL correcta del backend.

### CORS error
Asegúrate que el backend permita tu dominio frontend en CORS.

## 🎯 URLs de Producción

Después del despliegue:

- **Backend**: https://tu-backend.vercel.app
  - Health: `/health`
  - Docs: `/api/docs`
  - API: `/api/checkout/create-session`

- **Frontend**: https://tu-frontend.vercel.app
  - Home: `/`
  - OnePage: `/onepage.html`
  - Component: `/component.html`
  - Standard: `/standard.html`
