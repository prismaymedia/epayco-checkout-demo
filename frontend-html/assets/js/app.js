// Configuración global
const CONFIG = {
  API_BASE_URL: 'http://localhost:3001',
  EPAYCO_SCRIPT_URL: 'https://checkout.epayco.co/checkout-green-v2.js',
  DEBUG: true
};

// Utilidades
const Utils = {
  // Mostrar/ocultar loading
  showLoading() {
    const loading = document.querySelector('.loading');
    if (loading) loading.classList.add('show');
  },

  hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) loading.classList.remove('show');
  },

  // Mostrar toast notifications
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  },

  // Log para debug
  log(message, data = null) {
    if (CONFIG.DEBUG) {
      console.log(`[ePayco Frontend] ${message}`, data || '');
    }
  },

  // Validar datos del producto
  validateProduct(product) {
    const required = ['name', 'amount', 'currency'];
    for (const field of required) {
      if (!product[field]) {
        throw new Error(`Campo requerido: ${field}`);
      }
    }
    if (product.amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }
  }
};

// API Client
const API = {
  async request(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    Utils.log(`API Request: ${options.method || 'GET'} ${url}`, config.body);

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      Utils.log(`API Response: ${response.status}`, data);
      
      if (!response.ok) {
        throw new Error(data.textResponse || data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      Utils.log(`API Error: ${error.message}`);
      throw error;
    }
  },

  // Crear sesión de checkout
  async createSession(productData) {
    return await this.request('/api/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify({
        name: productData.name,
        amount: productData.amount,
        currency: productData.currency.toUpperCase(),
        description: productData.description || `Compra de ${productData.name}`
        // El backend añadirá: checkout_version, lang, country, ip, etc.
      })
    });
  },

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
};

// Gestor de ePayco
const EPaycoManager = {
  isScriptLoaded: false,
  currentCheckout: null,

  // Cargar script de ePayco dinámicamente
  async loadScript() {
    if (this.isScriptLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CONFIG.EPAYCO_SCRIPT_URL;
      script.onload = () => {
        this.isScriptLoaded = true;
        Utils.log('ePayco script loaded successfully');
        resolve();
      };
      script.onerror = () => {
        Utils.log('Error loading ePayco script');
        reject(new Error('No se pudo cargar el script de ePayco'));
      };
      document.head.appendChild(script);
    });
  },

  // Configurar checkout
  configure(sessionId, type = 'onepage', options = {}) {
    if (!window.ePayco) {
      throw new Error('ePayco script no está cargado');
    }

    const config = {
      sessionId,
      type,
      test: true,
      ...options
    };

    // Para component, agregar container si no se especificó
    if (type === 'component' && !config.container) {
      config.container = '#epayco-component';
    }

    Utils.log('Configuring ePayco checkout', config);

    this.currentCheckout = window.ePayco.checkout.configure(config);
    this.setupEventHandlers();
    
    return this.currentCheckout;
  },

  // Configurar event handlers
  setupEventHandlers() {
    if (!this.currentCheckout) return;

    this.currentCheckout.onCreated(() => {
      Utils.log('ePayco checkout created');
      Utils.showToast('Checkout inicializado correctamente', 'success');
    });

    this.currentCheckout.onErrors((errors) => {
      Utils.log('ePayco checkout errors', errors);
      Utils.showToast('Error en el checkout: ' + (errors.message || 'Error desconocido'), 'error');
    });

    this.currentCheckout.onClosed(() => {
      Utils.log('ePayco checkout closed');
      Utils.hideLoading();
    });
  },

  // Abrir checkout
  open() {
    if (this.currentCheckout) {
      this.currentCheckout.open();
    } else {
      Utils.showToast('Checkout no configurado', 'error');
    }
  },

  // Método específico para component (se carga automáticamente)
  isComponent(type) {
    return type === 'component';
  }
};

// Gestor de productos
const ProductManager = {
  products: [
    {
      id: 'basic-plan',
      name: 'Plan Básico',
      description: 'Perfecto para pequeños negocios',
      amount: 49900, // $49.900 COP
      currency: 'COP',
      icon: '📦'
    },
    {
      id: 'premium-plan',
      name: 'Plan Premium',
      description: 'Para empresas en crecimiento',
      amount: 99, // $99.00 USD
      currency: 'USD',
      icon: '🚀'
    }
  ],

  getProduct(id) {
    return this.products.find(p => p.id === id);
  },

  formatPrice(amount, currency = 'COP') {
    // Solo mostrar el número sin símbolo de moneda, ya que lo agregamos después
    const formatter = new Intl.NumberFormat('es-CO', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount);
  }
};

// Funciones principales de checkout
async function initializeCheckout(productId) {
  try {
    Utils.showLoading();
    
    // Obtener datos del producto
    const product = ProductManager.getProduct(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    Utils.validateProduct(product);
    Utils.log('Starting checkout for product', product);

    // Verificar que el backend esté disponible
    await API.healthCheck();
    Utils.log('Backend health check passed');

    // Cargar script de ePayco si no está cargado
    await EPaycoManager.loadScript();

    // Crear sesión en el backend enviando name, description y currency
    const session = await API.createSession(product);
    
    if (!session.success || !session.data?.sessionId) {
      throw new Error('No se pudo crear la sesión de checkout');
    }

    Utils.log('Session created successfully', session);

    // Configurar checkout de ePayco - Siempre onepage
    EPaycoManager.configure(session.data.sessionId, 'onepage');
    
    Utils.hideLoading();
    Utils.showToast('¡Listo para el checkout!', 'success');
    
    // Abrir checkout inmediatamente
    setTimeout(() => EPaycoManager.open(), 500);

  } catch (error) {
    Utils.hideLoading();
    Utils.log('Checkout initialization error', error);
    Utils.showToast(`Error: ${error.message}`, 'error');
  }
}

// Inicialización de la página
document.addEventListener('DOMContentLoaded', function() {
  Utils.log('Frontend initialized');

  // Renderizar productos en la página principal
  renderProducts();

  // Configurar event listeners para botones de checkout
  setupCheckoutButtons();

  // Verificar estado del backend
  checkBackendStatus();
});

function renderProducts() {
  const productGrid = document.querySelector('.product-grid');
  if (!productGrid) return;

  productGrid.innerHTML = ProductManager.products.map(product => {
    const symbol = product.currency === 'COP' ? '$' : '$';
    return `
    <div class="product-card">
      <div class="product-icon">${product.icon}</div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">${symbol} ${ProductManager.formatPrice(product.amount, product.currency)} ${product.currency}</div>
      <button class="btn btn-primary" onclick="initializeCheckout('${product.id}')">
        Comprar Ahora
      </button>
    </div>
  `;
  }).join('');
}

function setupCheckoutButtons() {
  // Botones para diferentes tipos de checkout
  const checkoutButtons = {
    'onepage-btn': () => initializeCheckout('basic-plan'),
    'standard-btn': () => initializeCheckout('premium-plan'),
    'component-btn': () => initializeCheckout('basic-plan')
  };

  Object.entries(checkoutButtons).forEach(([id, handler]) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener('click', handler);
    }
  });
}

async function checkBackendStatus() {
  try {
    await API.healthCheck();
    Utils.log('Backend is ready');
  } catch (error) {
    Utils.log('Backend not available', error);
    Utils.showToast('Advertencia: Backend no disponible', 'error');
  }
}

// Exportar funciones globales
window.EPaycoFrontend = {
  initializeCheckout,
  Utils,
  API,
  EPaycoManager,
  ProductManager
};