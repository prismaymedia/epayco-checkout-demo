const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function setupBackendEnv() {
  const envPath = path.join(__dirname, '../backend/.env');
  const envExamplePath = path.join(__dirname, '../backend/.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('✓ Archivo .env creado en backend/', 'green');
      log('  Por favor, edita backend/.env con tus credenciales de ePayco', 'yellow');
    } else {
      log('⚠️  No se encontró .env.example en backend/', 'yellow');
    }
  } else {
    log('✓ Archivo .env ya existe en backend/', 'green');
  }
}

function main() {
  log('\n========================================', 'cyan');
  log('  ePayco Checkout Backend - Configuración', 'cyan');
  log('========================================\n', 'cyan');
  
  setupBackendEnv();
  
  log('\n📝 Próximos pasos:', 'cyan');
  log('  1. Edita backend/.env con tus credenciales de ePayco', 'cyan');
  log('  2. Ejecuta "yarn install" para instalar dependencias', 'cyan');
  log('  3. Ejecuta "yarn dev" para iniciar el backend', 'cyan');
  log('  4. Visita http://localhost:3001/api/docs para ver la documentación\n', 'cyan');
}

main();
