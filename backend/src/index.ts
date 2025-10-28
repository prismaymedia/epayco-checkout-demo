import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiReference } from '@scalar/express-api-reference';
import authRoutes from './routes/auth.js';
import checkoutRoutes from './routes/checkout.js';
import transactionRoutes from './routes/transaction.js';
import { openApiSpec } from './openapi.js';

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

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Backend ePayco Checkout');
  console.log('========================================');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nEndpoints disponibles:');
  console.log(`  - GET  /health`);
  console.log(`  - GET  /api/docs                      📚 API Documentation`);
  console.log(`  - POST /api/auth/login`);
  console.log(`  - POST /api/checkout/create-session`);
  console.log(`  - GET  /api/transaction/:reference`);
  console.log('========================================\n');
  
  // Verificar configuración
  if (!process.env.EPAYCO_PUBLIC_KEY || process.env.EPAYCO_PUBLIC_KEY.includes('your_')) {
    console.warn('⚠️  ADVERTENCIA: EPAYCO_PUBLIC_KEY no configurada en .env');
  }
  if (!process.env.EPAYCO_PRIVATE_KEY || process.env.EPAYCO_PRIVATE_KEY.includes('your_')) {
    console.warn('⚠️  ADVERTENCIA: EPAYCO_PRIVATE_KEY no configurada en .env');
  }
  if (!process.env.RESPONSE_URL) {
    console.warn('⚠️  ADVERTENCIA: RESPONSE_URL no configurada en .env');
  }
});

export default app;
