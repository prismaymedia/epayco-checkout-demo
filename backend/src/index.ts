import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiReference } from '@scalar/express-api-reference';
import authRoutes from './routes/auth.js';
import checkoutRoutes from './routes/checkout.js';
import transactionRoutes from './routes/transaction.js';
import { openApiSpec } from './openapi.js';
import { getWebhookStats, getLocaltunnelUrl } from './services/webhook.js';
import { startLocaltunnel } from './services/tunnel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    tunnelUrl: getLocaltunnelUrl(),
    webhookStats: getWebhookStats(),
    env: {
      publicKeyConfigured: !!process.env.EPAYCO_PUBLIC_KEY && !process.env.EPAYCO_PUBLIC_KEY.includes('your_'),
      privateKeyConfigured: !!process.env.EPAYCO_PRIVATE_KEY && !process.env.EPAYCO_PRIVATE_KEY.includes('your_'),
      responseUrlConfigured: !!process.env.RESPONSE_URL
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/transaction', transactionRoutes);

// API Documentation with Scalar
app.use(
  '/api/docs',
  apiReference({
    spec: {
      content: openApiSpec
    },
    theme: 'purple',
    layout: 'modern'
  })
);

// Error handling
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

app.use(errorHandler);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

app.listen(PORT, async () => {
  console.log('\n════════════════════════════════════════════════════');
  console.log('🚀 BACKEND EPAYCO CHECKOUT');
  console.log('════════════════════════════════════════════════════');
  console.log(`📍 Servidor local: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📚 ENDPOINTS DISPONIBLES:');
  console.log(`  • GET  /health                       ✅ Estado del servidor`);
  console.log(`  • GET  /api/docs                     � Documentación API`);
  console.log(`  • GET  /api/webhooks                 📊 Ver webhooks recibidos`);
  console.log(`  • POST /api/auth/login`);
  console.log(`  • POST /api/checkout/create-session`);
  console.log(`  • POST /api/checkout/confirmation    🎉 Recibe pagos de ePayco`);
  console.log(`  • GET  /api/transaction/:reference`);
  console.log('════════════════════════════════════════════════════\n');
  
  // Inicializar localtunnel para exponer a internet
  try {
    await startLocaltunnel(PORT);
  } catch (error) {
    console.warn('\n⚠️  NO SE PUDO INICIAR LOCALTUNNEL');
    console.warn('═══════════════════════════════════════════════════');
    console.warn('Usando URL local: http://localhost:' + PORT);
    console.warn('\nPara exponer a internet, instala localtunnel:');
    console.warn('  npm install -g localtunnel');
    console.warn('  O ejecuta en otra terminal:');
    console.warn('  npx localtunnel --port ' + PORT);
    console.warn('═══════════════════════════════════════════════════\n');
  }
  
  // Verificar configuración de ePayco
  const missingConfig = [];
  if (!process.env.EPAYCO_PUBLIC_KEY || process.env.EPAYCO_PUBLIC_KEY.includes('your_')) {
    missingConfig.push('EPAYCO_PUBLIC_KEY');
  }
  if (!process.env.EPAYCO_PRIVATE_KEY || process.env.EPAYCO_PRIVATE_KEY.includes('your_')) {
    missingConfig.push('EPAYCO_PRIVATE_KEY');
  }
  
  if (missingConfig.length > 0) {
    console.warn('⚠️  VARIABLES DE ENTORNO NO CONFIGURADAS');
    console.warn('═══════════════════════════════════════════════════');
    missingConfig.forEach(key => {
      console.warn(`  • ${key}`);
    });
    console.warn('═══════════════════════════════════════════════════\n');
  }
});

export default app;
