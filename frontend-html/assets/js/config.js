// Configuración dinámica basada en el ambiente
const CONFIG = {
  // Detectar automáticamente la URL del backend
  API_BASE_URL: (() => {
    // Si estamos en producción (Vercel), usar variable de entorno o URL de producción
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Intentar obtener de meta tag
      const apiUrlMeta = document.querySelector('meta[name="api-base-url"]');
      if (apiUrlMeta) {
        return apiUrlMeta.getAttribute('content');
      }
      // URL por defecto de producción (cambiar por tu URL de Vercel)
      return 'https://your-backend.vercel.app';
    }
    // En desarrollo local
    return 'http://localhost:3001';
  })(),
  
  EPAYCO_SCRIPT_URL: 'https://checkout.epayco.co/checkout-green-v2.js',
  DEBUG: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
