import { spawn } from 'child_process';
import { setLocaltunnelUrl } from './webhook.js';

/**
 * Inicia localtunnel para exponer el servidor local a internet
 * @param port Puerto local
 * @returns URL pública del tunnel
 */
export async function startLocaltunnel(port: number | string = 3001): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('\n🔄 Iniciando localtunnel...');

    const tunnel = spawn('npx', ['localtunnel', '--port', String(port)], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';
    let urlResolved = false;

    tunnel.stdout?.on('data', (data) => {
      const text = data.toString();
      output += text;

      // Buscar la URL en el output
      const urlMatch = text.match(/https:\/\/[a-z0-9\-\.]+\.loca\.lt/);
      if (urlMatch && !urlResolved) {
        const url = urlMatch[0];
        urlResolved = true;
        
        console.log('\n✅ LOCALTUNNEL ACTIVO');
        console.log('═══════════════════════════════════════');
        console.log('🌐 URL Pública:', url);
        console.log('� Endpoint de confirmación:');
        console.log('   ' + url + '/api/checkout/confirmation');
        console.log('═══════════════════════════════════════\n');
        
        setLocaltunnelUrl(url);
        resolve(url);
      }
    });

    tunnel.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    tunnel.on('error', (error) => {
      console.error('❌ Error iniciando localtunnel:', error.message);
      reject(error);
    });

    tunnel.on('close', (code) => {
      if (code !== 0 && !output.includes('loca.lt')) {
        console.error('❌ Localtunnel cerrado con código:', code);
        if (errorOutput) {
          console.error('Error:', errorOutput);
        }
      }
    });

    // Timeout de 10 segundos si no se conecta
    setTimeout(() => {
      if (!output.includes('loca.lt')) {
        reject(new Error('Timeout iniciando localtunnel'));
      }
    }, 10000);
  });
}

/**
 * Verifica si localtunnel está instalado
 */
export async function isLocaltunnelAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const check = spawn('npx', ['localtunnel', '--version'], {
      stdio: 'pipe'
    });

    check.on('close', (code) => {
      resolve(code === 0);
    });

    setTimeout(() => resolve(false), 5000);
  });
}
