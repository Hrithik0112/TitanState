/**
 * Content script that injects into the page
 * This script runs in the page context and communicates with the app
 */

// Inject script into page context
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injected.js');
script.onload = function() {
  (this as HTMLScriptElement).remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the page
window.addEventListener('message', (event: MessageEvent) => {
  // Only accept messages from the same window
  if (event.source !== window) {
    return;
  }

  // Forward messages from TitanState app to extension
  if (event.data && event.data.source === 'titanstate-devtools') {
    chrome.runtime.sendMessage(event.data).catch(() => {
      // Extension might not be ready
    });
  }
});

// Listen for messages from extension
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Forward to page
  window.postMessage(message, '*');
  sendResponse({ success: true });
  return true;
});

