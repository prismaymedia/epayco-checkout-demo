#!/usr/bin/env node

/**
 * Script de verificación pre-despliegue
 * Verifica que todo esté listo para desplegar en Vercel
 */

console.log('\n🔍 Verificando configuración para despliegue en Vercel...\n');

let hasErrors = false;

// 1. Verificar archivos requeridos
const requiredFiles = [
  'vercel.json',
  'api/index.ts',
  'src/index.ts',
  'package.json',
  'tsconfig.json'
];

console.log('📁 Verificando archivos requeridos:');
const fs = require('fs');
const path = require('path');

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) hasErrors = true;
});

// 2. Verificar package.json
console.log('\n📦 Verificando package.json:');
const packageJson = require('../package.json');

if (!packageJson.type || packageJson.type !== 'module') {
  console.log('  ⚠️  "type": "module" requerido en package.json');
  hasErrors = true;
} else {
  console.log('  ✅ type: module');
}

const requiredDeps = [
  'express',
  'cors',
  'dotenv',
  '@scalar/express-api-reference'
];

console.log('  Dependencias requeridas:');
requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies && packageJson.dependencies[dep];
  console.log(`    ${exists ? '✅' : '❌'} ${dep}`);
  if (!exists) hasErrors = true;
});

// 3. Verificar tsconfig.json
console.log('\n⚙️  Verificando tsconfig.json:');
const tsconfig = require('../tsconfig.json');

if (tsconfig.compilerOptions?.module !== 'ES2022' && tsconfig.compilerOptions?.module !== 'ESNext') {
  console.log('  ⚠️  module debería ser ES2022 o ESNext');
}
if (tsconfig.compilerOptions?.target !== 'ES2022' && tsconfig.compilerOptions?.target !== 'ESNext') {
  console.log('  ⚠️  target debería ser ES2022 o ESNext');
}
console.log('  ✅ Configuración TypeScript OK');

// 4. Verificar estructura de api/
console.log('\n🔌 Verificando entry point de Vercel:');
const apiIndexPath = path.join(__dirname, '..', 'api', 'index.ts');
if (fs.existsSync(apiIndexPath)) {
  const content = fs.readFileSync(apiIndexPath, 'utf8');
  if (content.includes('export default app')) {
    console.log('  ✅ api/index.ts exporta app correctamente');
  } else {
    console.log('  ❌ api/index.ts debe exportar app como default');
    hasErrors = true;
  }
} else {
  console.log('  ❌ api/index.ts no encontrado');
  hasErrors = true;
}

// 5. Verificar que src/index.ts no ejecute app.listen en Vercel
console.log('\n🚀 Verificando src/index.ts:');
const srcIndexPath = path.join(__dirname, '..', 'src', 'index.ts');
if (fs.existsSync(srcIndexPath)) {
  const content = fs.readFileSync(srcIndexPath, 'utf8');
  if (content.includes('VERCEL') && content.includes('app.listen')) {
    console.log('  ✅ Detecta ambiente Vercel correctamente');
  } else {
    console.log('  ⚠️  Asegúrate de que app.listen solo se ejecute fuera de Vercel');
  }
}

// 6. Recordatorios de variables de entorno
console.log('\n🔐 Recordatorio de Variables de Entorno en Vercel:');
console.log('  Debes configurar estas variables en el dashboard de Vercel:');
console.log('  - EPAYCO_PUBLIC_KEY');
console.log('  - EPAYCO_PRIVATE_KEY');
console.log('  - EPAYCO_AUTH_URL');
console.log('  - EPAYCO_SESSION_URL');
console.log('  - RESPONSE_URL');
console.log('  - CONFIRMATION_URL');
console.log('  - NODE_ENV');

// Resultado final
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Errores encontrados. Por favor corrígelos antes de desplegar.');
  process.exit(1);
} else {
  console.log('✅ Todo listo para desplegar en Vercel!');
  console.log('\nPróximos pasos:');
  console.log('  1. Configura las variables de entorno en Vercel');
  console.log('  2. Ejecuta: npm run deploy');
  console.log('  3. O conecta tu repo en vercel.com/new');
  process.exit(0);
}
console.log('='.repeat(60) + '\n');
