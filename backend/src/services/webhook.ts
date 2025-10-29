import { randomUUID } from 'crypto';

interface WebhookEvent {
  id: string;
  timestamp: string;
  method: string;
  headers: Record<string, any>;
  body: Record<string, any>;
}

// Store webhooks in memory
const webhookEvents: WebhookEvent[] = [];
const MAX_WEBHOOKS = 100;

// Localtunnel URL
let localtunnelUrl: string | null = null;

/**
 * Guarda un evento de webhook recibido
 */
export function addWebhookEvent(body: Record<string, any>, headers: Record<string, any>, method: string = 'POST'): WebhookEvent {
  const event: WebhookEvent = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    method,
    headers,
    body
  };

  // Mantener solo los últimos MAX_WEBHOOKS eventos
  webhookEvents.unshift(event);
  if (webhookEvents.length > MAX_WEBHOOKS) {
    webhookEvents.pop();
  }

  console.log('\n================================');
  console.log('🎉 WEBHOOK RECIBIDO');
  console.log('================================');
  console.log(`Hora: ${event.timestamp}`);
  console.log(`ID: ${event.id}`);
  console.log(`Método: ${event.method}`);
  console.log('\n📊 DATOS RECIBIDOS:');
  console.log(JSON.stringify(body, null, 2));
  console.log('================================\n');

  return event;
}

/**
 * Obtiene todos los webhooks recibidos
 */
export function getAllWebhooks(): WebhookEvent[] {
  return webhookEvents;
}

/**
 * Obtiene un webhook específico por ID
 */
export function getWebhookById(id: string): WebhookEvent | undefined {
  return webhookEvents.find(w => w.id === id);
}

/**
 * Limpia los webhooks almacenados
 */
export function clearWebhooks(): void {
  webhookEvents.length = 0;
  console.log('🧹 Webhooks limpiados');
}

/**
 * Obtiene estadísticas de webhooks
 */
export function getWebhookStats() {
  return {
    total: webhookEvents.length,
    lastWebhook: webhookEvents[0],
    allWebhooks: webhookEvents
  };
}

/**
 * Configura la URL de localtunnel
 */
export function setLocaltunnelUrl(url: string): void {
  localtunnelUrl = url;
}

/**
 * Obtiene la URL de localtunnel
 */
export function getLocaltunnelUrl(): string | null {
  return localtunnelUrl;
}

/**
 * Obtiene la URL de confirmación
 */
export function getConfirmationUrl(): string {
  if (localtunnelUrl) {
    return `${localtunnelUrl}/api/checkout/confirmation`;
  }
  // Fallback a localhost
  return `http://localhost:${process.env.PORT || 3001}/api/checkout/confirmation`;
}


