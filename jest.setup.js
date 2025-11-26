// Jest setup file

// Mock Web Crypto API for Node.js tests
if (typeof globalThis.crypto === 'undefined') {
  const { webcrypto } = require('crypto');
  globalThis.crypto = webcrypto;
}

// Mock BroadcastChannel for Node.js tests
if (typeof globalThis.BroadcastChannel === 'undefined') {
  globalThis.BroadcastChannel = class BroadcastChannel {
    constructor(name) {
      this.name = name;
      this.listeners = [];
    }
    postMessage(message) {
      // Mock implementation
    }
    addEventListener(type, listener) {
      this.listeners.push(listener);
    }
    removeEventListener(type, listener) {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
    close() {
      this.listeners = [];
    }
  };
}

