/**
 * @titanstate/worker - Web Worker integration for TitanState
 * 
 * Main entry point for worker functionality
 */

// Bridge
export { WorkerBridge } from './bridge';
export type { WorkerBridgeConfig, MessageHandler } from './bridge';

// Pool
export { WorkerPool } from './pool';
export type { WorkerPoolConfig } from './pool';

// Reducer
export {
  registerWorkerReducer,
  dispatchToWorker,
  setWorkerBridge,
} from './reducer';

// Patch
export {
  pathToString,
  stringToPath,
  getValueAtPath,
  setValueAtPath,
  deleteValueAtPath,
  applyPatch,
  applyPatches,
  generatePatches,
} from './patch';

// Types
export type {
  WorkerMessage,
  WorkerMessageType,
  DispatchMessage,
  PatchMessage,
  ResultMessage,
  ErrorMessage,
  RegisterReducerMessage,
  WorkerReducer,
  WorkerReducerHandle,
  Action,
  PatchOp,
} from './types';

