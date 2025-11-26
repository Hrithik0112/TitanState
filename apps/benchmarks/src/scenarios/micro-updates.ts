/**
 * Benchmark: 1M small atom updates per second
 */

import { createStore } from '@titanstate/core';

export async function benchmarkMicroUpdates(iterations: number = 1_000_000): Promise<{
  updatesPerSecond: number;
  totalTime: number;
  averageTime: number;
}> {
  const store = createStore();
  const atom = store.createAtom('counter', 0);
  
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    store.set(atom, i);
  }
  
  const end = performance.now();
  const totalTime = end - start;
  const updatesPerSecond = (iterations / totalTime) * 1000;
  const averageTime = totalTime / iterations;
  
  return {
    updatesPerSecond,
    totalTime,
    averageTime,
  };
}

