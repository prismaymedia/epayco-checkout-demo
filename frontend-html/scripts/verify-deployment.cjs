#!/usr/bin/env node

/**
 * Script de verificación para el frontend
 * Verifica la configuración antes de desplegar
 */

console.log('\n🔍 Verificando configuración del frontend...\n');

const fs = require('fs');
const path = require('path');

let hasErrors = false;
let hasWarnings = false;

// 1. Verificar archivos requeridos
console.log('📁 Verificando archivos requeridos:');
const requiredFiles = [
  'index.html',
  'onepage.html',
  'component.html',
  'standard.html',
  'transaction-result.html',
  'assets/js/config.js',
  'assets/js/app.js',
  'assets/css/styles.css',
  'vercel.json'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) hasErrors = true;
});

// 2. Verificar configuración de backend URL
console.log('\n🔗 Verificando configuración del backend:');
const configPath = path.join(__dirname, '..', 'assets', 'js', 'config.js');

if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('your-backend.vercel.app')) {
    console.log('  ⚠️  URL del backend aún no configurada');
    console.log('  📝 Edita assets/js/config.js y actualiza la URL del backend');
    hasWarnings = true;
  } else if (configContent.includes('localhost:3001')) {
    console.log('  ⚠️  Usando localhost - OK para desarrollo');
    hasWarnings = true;
  } else {
    console.log('  ✅ URL del backend configurada');
  }
} else {
  console.log('  ❌ config.js no encontrado');
  hasErrors = true;
}

// 3. Verificar que config.js esté incluido en los HTML
console.log('\n📄 Verificando scripts en archivos HTML:');
const htmlFiles = ['index.html', 'onepage.html', 'component.html', 'standard.html', 'transaction-result.html'];

htmlFiles.forEach(file => {
  const htmlPath = path.join(__dirname, '..', file);
  if (fs.existsSync(htmlPath)) {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const hasConfig = content.includes('config.js');
    const hasApp = content.includes('app.js');
    console.log(`  ${hasConfig && hasApp ? '✅' : '❌'} ${file} - config.js: ${hasConfig}, app.js: ${hasApp}`);
    if (!hasConfig || !hasApp) hasErrors = true;
  }
});

// 4. Verificar vercel.json
console.log('\n⚙️  Verificando vercel.json:');
const vercelPath = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(vercelPath)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    console.log('  ✅ vercel.json válido');
    if (vercelConfig.public) {
      console.log('  ✅ Configurado como sitio público');
    }
  } catch (error) {
    console.log('  ❌ vercel.json inválido:', error.message);
    hasErrors = true;
  }
} else {
  console.log('  ❌ vercel.json no encontrado');
  hasErrors = true;
}

// Resultado final
console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('❌ Errores encontrados. Por favor corrígelos antes de desplegar.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Advertencias encontradas:');
  console.log('  • Asegúrate de actualizar la URL del backend en config.js');
  console.log('  • Para desarrollo local, esto está OK');
  console.log('\n✅ Puedes continuar, pero revisa las advertencias.');
  console.log('\nPróximos pasos:');
  console.log('  1. Actualiza assets/js/config.js con tu URL de backend');
  console.log('  2. Prueba localmente: npm run dev');
  console.log('  3. Despliega: npm run deploy');
  process.exit(0);
} else {
  console.log('✅ Todo listo para desplegar!');
  console.log('\nPróximos pasos:');
  console.log('  1. Prueba localmente: npm run dev');
  console.log('  2. Despliega: npm run deploy');
  console.log('  3. Actualiza RESPONSE_URL en el backend con tu URL de frontend');
  process.exit(0);
}
console.log('='.repeat(60) + '\n');
