/**
 * Injected script that runs in the page context
 * This script can access the page's window object and TitanState instances
 */

(function() {
  // This script runs in the page context, so it can access window
  // It listens for messages from the content script and forwards them to the app
  
  window.addEventListener('message', (event: MessageEvent) => {
    // Only accept messages from the extension
    if (event.source !== window || !event.data || event.data.source !== 'titanstate-devtools-extension') {
      return;
    }

    // Forward to TitanState app (if it's listening)
    // The app's DevToolsBridge will handle these messages
    window.postMessage(event.data, '*');
  });

  // Notify extension that injection is complete
  window.postMessage(
    {
      source: 'titanstate-devtools-injected',
      type: 'ready',
    },
    '*'
  );
})();

