/**
 * Background service worker for TitanState DevTools extension
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('TitanState DevTools extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.source === 'titanstate-devtools') {
    // Forward to devtools panel if open
    chrome.runtime.sendMessage(message).catch(() => {
      // DevTools panel might not be open
    });
  }
  return true;
});

