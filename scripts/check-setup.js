const fs = require('fs');
const path = require('path');
const net = require('net');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

async function checkEnvFile() {
  const envPath = path.join(__dirname, '../backend/.env');
  const envExamplePath = path.join(__dirname, '../backend/.env.example');
  
  if (!fs.existsSync(envPath)) {
    log('\n⚠️  ADVERTENCIA: Archivo .env no encontrado en backend/', 'yellow');
    log('\nPor favor, crea un archivo .env en la carpeta backend/ basado en .env.example', 'yellow');
    log(`\nPuedes ejecutar: cp backend/.env.example backend/.env`, 'cyan');
    log('Y luego editar el archivo con tus credenciales de ePayco\n', 'cyan');
    return false;
  }
  
  // Verificar que las variables requeridas estén presentes
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredVars = ['EPAYCO_PUBLIC_KEY', 'EPAYCO_PRIVATE_KEY', 'RESPONSE_URL'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your_`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    log('\n⚠️  ADVERTENCIA: Variables de entorno no configuradas en backend/.env:', 'yellow');
    missingVars.forEach(v => log(`   - ${v}`, 'yellow'));
    log('\nPor favor, edita backend/.env con tus credenciales de ePayco\n', 'yellow');
    return false;
  }
  
  log('✓ Archivo .env configurado correctamente', 'green');
  return true;
}

async function checkPorts() {
  const ports = [
    { port: 3001, name: 'Backend API' }
  ];
  
  log('\n🔍 Verificando disponibilidad de puertos...\n', 'cyan');
  
  let hasIssues = false;
  
  for (const { port, name } of ports) {
    const available = await checkPortAvailable(port);
    if (!available) {
      log(`⚠️  Puerto ${port} (${name}) ya está en uso`, 'yellow');
      hasIssues = true;
    } else {
      log(`✓ Puerto ${port} (${name}) disponible`, 'green');
    }
  }
  
  if (hasIssues) {
    log('\n⚠️  El puerto está en uso. Por favor, cierra la aplicación que lo esté usando', 'yellow');
    log('   o espera a que se libere antes de continuar.\n', 'yellow');
    log('💡 Consejo: Puedes usar "lsof -ti:3001 | xargs kill" para liberar el puerto\n', 'cyan');
  }
  
  return !hasIssues;
}

async function main() {
  log('\n========================================', 'blue');
  log('  ePayco Checkout Backend - Verificación', 'blue');
  log('========================================\n', 'blue');
  
  const envOk = await checkEnvFile();
  const portsOk = await checkPorts();
  
  if (!envOk || !portsOk) {
    log('\n⚠️  Por favor, resuelve los problemas anteriores antes de continuar\n', 'red');
    process.exit(1);
  }
  
  log('\n✅ Todo listo! Puedes iniciar el backend con "yarn dev"\n', 'green');
  log('📖 Documentación disponible en: http://localhost:3001/api/docs\n', 'cyan');
}

main();
