/**
 * Benchmark: Time-travel reconstruction cost
 */

import { EventLog } from '@titanstate/devtools';
import { StateReconstructor } from '@titanstate/devtools';
import { createStore } from '@titanstate/core';

export async function benchmarkTimeTravel(
  eventCount: number = 10_000,
  reconstructionPoints: number = 100
): Promise<{
  eventLogTime: number;
  reconstructionTimes: number[];
  averageReconstructionTime: number;
  maxReconstructionTime: number;
  minReconstructionTime: number;
}> {
  const store = createStore();
  const eventLog = new EventLog();
  const reconstructor = new StateReconstructor(eventLog, store);
  
  // Generate events
  const logStart = performance.now();
  for (let i = 0; i < eventCount; i++) {
    await eventLog.log({
      type: 'atom-update',
      target: `atom:${i % 100}`,
      meta: { newValue: { value: i } },
    });
  }
  const logEnd = performance.now();
  
  // Reconstruct at various points
  const reconstructionTimes: number[] = [];
  const step = Math.floor(eventCount / reconstructionPoints);
  
  for (let seq = step; seq <= eventCount; seq += step) {
    const reconStart = performance.now();
    await reconstructor.reconstruct({
      targetSeq: seq,
      includeState: true,
    });
    const reconEnd = performance.now();
    reconstructionTimes.push(reconEnd - reconStart);
  }
  
  const averageReconstructionTime = reconstructionTimes.reduce((a, b) => a + b, 0) / reconstructionTimes.length;
  const maxReconstructionTime = Math.max(...reconstructionTimes);
  const minReconstructionTime = Math.min(...reconstructionTimes);
  
  return {
    eventLogTime: logEnd - logStart,
    reconstructionTimes,
    averageReconstructionTime,
    maxReconstructionTime,
    minReconstructionTime,
  };
}

