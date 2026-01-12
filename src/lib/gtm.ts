/**
 * Google Tag Manager initialization
 * Injects GTM scripts into the document
 */

export const initGTM = (gtmId: string) => {
  if (!gtmId || gtmId === 'GTM-XXXXXXX') {
    console.warn('GTM ID not configured. Skipping GTM initialization.');
    return;
  }

  // Prevent duplicate initialization
  if (window.dataLayer) {
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  // Create and inject the GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.insertBefore(script, document.head.firstChild);
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

