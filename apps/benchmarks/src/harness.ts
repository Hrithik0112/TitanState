/**
 * Benchmark harness
 */

import { benchmarkMicroUpdates } from './scenarios/micro-updates.js';
import { benchmarkLargeTable } from './scenarios/large-table.js';
import { benchmarkHydration } from './scenarios/hydration.js';
import { benchmarkWorkerThroughput } from './scenarios/worker-throughput.js';
import { benchmarkTimeTravel } from './scenarios/time-travel.js';

/**
 * Benchmark result
 */
export interface BenchmarkResult {
  name: string;
  metrics: Record<string, number>;
  timestamp: number;
}

/**
 * Run all benchmarks
 */
export async function runAllBenchmarks(): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = [];
  
  console.log('Running TitanState Benchmarks...\n');
  
  // Micro updates
  console.log('1. Micro Updates (1M atom updates)...');
  const microUpdates = await benchmarkMicroUpdates(1_000_000);
  results.push({
    name: 'micro-updates',
    metrics: {
      updatesPerSecond: microUpdates.updatesPerSecond,
      totalTimeMs: microUpdates.totalTime,
      averageTimeMs: microUpdates.averageTime,
    },
    timestamp: Date.now(),
  });
  console.log(`   ✓ ${Math.round(microUpdates.updatesPerSecond).toLocaleString()} updates/sec\n`);
  
  // Large table
  console.log('2. Large Table (10k items CRUD)...');
  const largeTable = await benchmarkLargeTable(10_000);
  results.push({
    name: 'large-table',
    metrics: {
      createTimeMs: largeTable.createTime,
      readTimeMs: largeTable.readTime,
      updateTimeMs: largeTable.updateTime,
      deleteTimeMs: largeTable.deleteTime,
      hydrationTimeMs: largeTable.hydrationTime,
    },
    timestamp: Date.now(),
  });
  console.log(`   ✓ Create: ${largeTable.createTime.toFixed(2)}ms`);
  console.log(`   ✓ Hydration: ${largeTable.hydrationTime.toFixed(2)}ms\n`);
  
  // Hydration
  console.log('3. Large Dataset Hydration (100MB)...');
  const hydration = await benchmarkHydration(100);
  results.push({
    name: 'hydration',
    metrics: {
      serializationTimeMs: hydration.serializationTime,
      persistenceTimeMs: hydration.persistenceTime,
      hydrationTimeMs: hydration.hydrationTime,
      queryTimeMs: hydration.queryTime,
      dataSizeMB: hydration.dataSize / (1024 * 1024),
    },
    timestamp: Date.now(),
  });
  console.log(`   ✓ Hydration: ${hydration.hydrationTime.toFixed(2)}ms`);
  console.log(`   ✓ Data Size: ${(hydration.dataSize / (1024 * 1024)).toFixed(2)}MB\n`);
  
  // Worker throughput
  console.log('4. Worker Throughput (10k operations)...');
  const worker = await benchmarkWorkerThroughput(10_000);
  results.push({
    name: 'worker-throughput',
    metrics: {
      operationsPerSecond: worker.operationsPerSecond,
      totalTimeMs: worker.totalTime,
      averageTimeMs: worker.averageTime,
    },
    timestamp: Date.now(),
  });
  console.log(`   ✓ ${Math.round(worker.operationsPerSecond).toLocaleString()} ops/sec\n`);
  
  // Time travel
  console.log('5. Time-Travel Reconstruction (10k events)...');
  const timeTravel = await benchmarkTimeTravel(10_000, 100);
  results.push({
    name: 'time-travel',
    metrics: {
      eventLogTimeMs: timeTravel.eventLogTime,
      averageReconstructionTimeMs: timeTravel.averageReconstructionTime,
      maxReconstructionTimeMs: timeTravel.maxReconstructionTime,
      minReconstructionTimeMs: timeTravel.minReconstructionTime,
    },
    timestamp: Date.now(),
  });
  console.log(`   ✓ Avg Reconstruction: ${timeTravel.averageReconstructionTime.toFixed(2)}ms\n`);
  
  return results;
}

/**
 * Format results as JSON
 */
export function formatResultsAsJSON(results: BenchmarkResult[]): string {
  return JSON.stringify(results, null, 2);
}

/**
 * Format results as table
 */
export function formatResultsAsTable(results: BenchmarkResult[]): string {
  let output = '\nBenchmark Results:\n';
  output += '='.repeat(80) + '\n\n';
  
  for (const result of results) {
    output += `${result.name}:\n`;
    for (const [key, value] of Object.entries(result.metrics)) {
      output += `  ${key}: ${typeof value === 'number' ? value.toFixed(2) : value}\n`;
    }
    output += '\n';
  }
  
  return output;
}

