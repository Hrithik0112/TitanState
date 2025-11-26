/**
 * Remote driver - for HTTP/S3 storage
 */

import type { Driver, DriverOptions, PutOptions } from './types';
import { BaseDriver } from './driver';

/**
 * Remote driver configuration
 */
export interface RemoteDriverConfig {
  /**
   * Base URL for API endpoints
   */
  baseUrl: string;
  
  /**
   * Authentication token
   */
  token?: string;
  
  /**
   * Custom headers
   */
  headers?: Record<string, string>;
  
  /**
   * Request timeout in milliseconds
   */
  timeout?: number;
}

/**
 * Remote driver implementation
 */
export class RemoteDriver extends BaseDriver implements Driver {
  private config: Required<Pick<RemoteDriverConfig, 'baseUrl'>> & RemoteDriverConfig;
  
  constructor(config: RemoteDriverConfig) {
    super();
    this.config = {
      baseUrl: config.baseUrl,
      token: config.token,
      headers: config.headers ?? {},
      timeout: config.timeout ?? 30000,
    };
  }
  
  /**
   * Make HTTP request
   */
  private async request(
    method: string,
    path: string,
    body?: unknown,
    options?: { headers?: Record<string, string> }
  ): Promise<Response> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...options?.headers,
    };
    
    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }
  
  async put(key: string, value: unknown, options?: PutOptions): Promise<void> {
    const serialized = this.serialize(value, options);
    const data = typeof serialized === 'string' ? serialized : 
      Array.from(new Uint8Array(serialized)).join(',');
    
    await this.request('PUT', `/storage/${encodeURIComponent(key)}`, {
      value: data,
      metadata: options?.metadata,
      ttl: options?.ttl,
    });
  }
  
  async get(key: string, options?: DriverOptions): Promise<unknown | null> {
    try {
      const response = await this.request('GET', `/storage/${encodeURIComponent(key)}`);
      const data = await response.json();
      
      if (!data.value) {
        return null;
      }
      
      // Deserialize based on type
      const serialized = typeof data.value === 'string' 
        ? data.value 
        : new Uint8Array(data.value.split(',')).buffer;
      
      return this.deserialize(serialized, options);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
  
  async delete(key: string): Promise<void> {
    try {
      await this.request('DELETE', `/storage/${encodeURIComponent(key)}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        // Already deleted, ignore
        return;
      }
      throw error;
    }
  }
  
  async has(key: string): Promise<boolean> {
    try {
      const response = await this.request('HEAD', `/storage/${encodeURIComponent(key)}`);
      return response.ok;
    } catch {
      return false;
    }
  }
  
  async keys(prefix?: string): Promise<string[]> {
    const query = prefix ? `?prefix=${encodeURIComponent(prefix)}` : '';
    const response = await this.request('GET', `/storage/keys${query}`);
    const data = await response.json();
    return data.keys ?? [];
  }
  
  async clear(): Promise<void> {
    await this.request('DELETE', '/storage');
  }
}

