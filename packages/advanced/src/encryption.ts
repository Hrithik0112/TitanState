/**
 * Web Crypto API integration for sensitive data encryption
 */

import type { EncryptionOptions, EncryptionAlgorithm } from './types';

/**
 * Default encryption algorithm
 */
const DEFAULT_ALGORITHM: EncryptionAlgorithm = 'AES-GCM';

/**
 * Default key length
 */
const DEFAULT_KEY_LENGTH = 256;

/**
 * Generate encryption key
 */
export async function generateEncryptionKey(
  options: EncryptionOptions = {}
): Promise<CryptoKey> {
  const algorithm = options.algorithm ?? DEFAULT_ALGORITHM;
  const keyLength = options.keyLength ?? DEFAULT_KEY_LENGTH;
  
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available');
  }
  
  const algorithmParams: AesKeyGenParams = {
    name: algorithm,
    length: keyLength,
  };
  
  return crypto.subtle.generateKey(
    algorithmParams,
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Derive key from password
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  options: EncryptionOptions = {}
): Promise<CryptoKey> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available');
  }
  
  const algorithm = options.algorithm ?? DEFAULT_ALGORITHM;
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Ensure salt is a proper BufferSource (not SharedArrayBuffer-backed)
  // Create a new Uint8Array to ensure it's backed by ArrayBuffer
  const saltBuffer = new Uint8Array(salt);
  
  // Derive key using PBKDF2
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: algorithm,
      length: options.keyLength ?? DEFAULT_KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
  
  return derivedKey;
}

/**
 * Encrypt data
 */
export async function encrypt(
  data: string | ArrayBuffer,
  key: CryptoKey,
  options: EncryptionOptions = {}
): Promise<ArrayBuffer> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available');
  }
  
  const algorithm = options.algorithm ?? DEFAULT_ALGORITHM;
  const dataBuffer = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : data;
  
  // Generate IV
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits for GCM
  
  const algorithmParams: AesGcmParams | AesCbcParams = algorithm === 'AES-GCM'
    ? {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      }
    : {
        name: 'AES-CBC',
        iv: iv,
      };
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    algorithmParams,
    key,
    dataBuffer
  );
  
  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  
  return result.buffer;
}

/**
 * Decrypt data
 */
export async function decrypt(
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  options: EncryptionOptions = {}
): Promise<ArrayBuffer> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    throw new Error('Web Crypto API is not available');
  }
  
  const algorithm = options.algorithm ?? DEFAULT_ALGORITHM;
  const dataView = new Uint8Array(encryptedData);
  
  // Extract IV
  const ivLength = 12; // 96 bits for GCM
  const iv = dataView.slice(0, ivLength);
  const encrypted = dataView.slice(ivLength);
  
  const algorithmParams: AesGcmParams | AesCbcParams = algorithm === 'AES-GCM'
    ? {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      }
    : {
        name: 'AES-CBC',
        iv: iv,
      };
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    algorithmParams,
    key,
    encrypted
  );
  
  return decrypted;
}

/**
 * Encrypt string and return base64
 */
export async function encryptString(
  data: string,
  key: CryptoKey,
  options: EncryptionOptions = {}
): Promise<string> {
  const encrypted = await encrypt(data, key, options);
  const bytes = new Uint8Array(encrypted);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Decrypt base64 string
 */
export async function decryptString(
  encryptedData: string,
  key: CryptoKey,
  options: EncryptionOptions = {}
): Promise<string> {
  const bytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  const decrypted = await decrypt(bytes.buffer, key, options);
  return new TextDecoder().decode(decrypted);
}

