/**
 * Benchmark: 100MB dataset hydration & query latency
 */

import { createStore } from '@titanstate/core';
import { MemoryDriver } from '@titanstate/persist';
import { persistAtom, hydrateAtom } from '@titanstate/persist';

function generateLargeData(sizeMB: number): string {
  const sizeBytes = sizeMB * 1024 * 1024;
  const chunk = 'x'.repeat(1024); // 1KB chunk
  const chunks = Math.ceil(sizeBytes / chunk.length);
  return chunk.repeat(chunks).substring(0, sizeBytes);
}

export async function benchmarkHydration(dataSizeMB: number = 100): Promise<{
  serializationTime: number;
  persistenceTime: number;
  hydrationTime: number;
  queryTime: number;
  dataSize: number;
}> {
  const store = createStore();
  const driver = new MemoryDriver();
  
  // Generate large data
  const serializationStart = performance.now();
  const largeData = generateLargeData(dataSizeMB);
  const serializationEnd = performance.now();
  
  // Persist
  const persistStart = performance.now();
  const atom = store.createAtom('large-data', largeData, {
    persisted: true,
    lazyLoad: true,
  });
  await persistAtom(atom, driver);
  const persistEnd = performance.now();
  
  // Hydrate
  const hydrateStart = performance.now();
  await hydrateAtom(atom, driver);
  const hydrateEnd = performance.now();
  
  // Query (access data)
  const queryStart = performance.now();
  const data = store.get(atom);
  const dataLength = data ? (data as string).length : 0;
  const queryEnd = performance.now();
  
  return {
    serializationTime: serializationEnd - serializationStart,
    persistenceTime: persistEnd - persistStart,
    hydrationTime: hydrateEnd - hydrateStart,
    queryTime: queryEnd - queryStart,
    dataSize: dataLength,
  };
}

