/**
 * Schema versioning and migration system
 */

import type { Migration, MigrationFunction } from './types';
import type { Driver } from '@titanstate/persist';

/**
 * Migration manager
 */
export class MigrationManager {
  private migrations: Migration[] = [];
  private currentVersion: number;
  private driver: Driver;
  
  constructor(driver: Driver, currentVersion: number = 1) {
    this.driver = driver;
    this.currentVersion = currentVersion;
  }
  
  /**
   * Register a migration
   */
  register(migration: Migration): void {
    this.migrations.push(migration);
    
    // Sort by version
    this.migrations.sort((a, b) => a.version - b.version);
  }
  
  /**
   * Get stored version for a key
   */
  async getStoredVersion(key: string): Promise<number> {
    const versionKey = `${key}:version`;
    const version = await this.driver.get(versionKey);
    return version ? (version as number) : 1;
  }
  
  /**
   * Set stored version for a key
   */
  async setStoredVersion(key: string, version: number): Promise<void> {
    const versionKey = `${key}:version`;
    await this.driver.put(versionKey, version);
  }
  
  /**
   * Migrate data for a key
   */
  async migrate(key: string, data: unknown): Promise<unknown> {
    const storedVersion = await this.getStoredVersion(key);
    
    if (storedVersion >= this.currentVersion) {
      return data; // Already up to date
    }
    
    // Find migrations to apply
    const migrationsToApply = this.migrations.filter(
      m => m.version > storedVersion && m.version <= this.currentVersion
    );
    
    let migratedData = data;
    
    // Apply migrations in order
    for (const migration of migrationsToApply) {
      try {
        migratedData = migration.migrate(migratedData);
      } catch (error) {
        throw new Error(
          `Migration to version ${migration.version} failed for key ${key}: ${error}`
        );
      }
    }
    
    // Update stored version
    await this.setStoredVersion(key, this.currentVersion);
    
    return migratedData;
  }
  
  /**
   * Check if migration is needed
   */
  async needsMigration(key: string): Promise<boolean> {
    const storedVersion = await this.getStoredVersion(key);
    return storedVersion < this.currentVersion;
  }
  
  /**
   * Get all migrations
   */
  getMigrations(): Migration[] {
    return [...this.migrations];
  }
  
  /**
   * Set current version
   */
  setCurrentVersion(version: number): void {
    this.currentVersion = version;
  }
}

/**
 * Create a migration
 */
export function createMigration(
  version: number,
  migrate: MigrationFunction,
  description?: string
): Migration {
  return {
    version,
    migrate,
    description,
  };
}

