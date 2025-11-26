/**
 * Worker pool management
 */

/**
 * Worker pool configuration
 */
export interface WorkerPoolConfig {
  /**
   * Number of workers in the pool
   * If not specified, uses navigator.hardwareConcurrency or defaults to 2
   */
  poolSize?: number;
  
  /**
   * Worker script URL
   */
  scriptUrl?: string;
  
  /**
   * Worker options (for SharedWorker, etc.)
   */
  workerOptions?: WorkerOptions;
}

/**
 * Worker pool for managing multiple web workers
 */
export class WorkerPool {
  private workers: Worker[] = [];
  private availableWorkers: Worker[] = [];
  private pendingTasks: Array<{
    worker: Worker | null;
    resolve: (worker: Worker) => void;
    reject: (error: Error) => void;
  }> = [];
  private config: Required<Pick<WorkerPoolConfig, 'poolSize'>> & WorkerPoolConfig;
  
  constructor(config: WorkerPoolConfig = {}) {
    const poolSize = config.poolSize ?? 
      (typeof navigator !== 'undefined' && navigator.hardwareConcurrency 
        ? Math.max(1, navigator.hardwareConcurrency - 1) 
        : 2);
    
    this.config = {
      ...config,
      poolSize,
    };
    
    this.initializeWorkers();
  }
  
  /**
   * Initialize worker pool
   */
  private initializeWorkers(): void {
    if (typeof Worker === 'undefined') {
      console.warn('Web Workers are not supported in this environment');
      return;
    }
    
    if (!this.config.scriptUrl) {
      console.warn('Worker script URL not provided');
      return;
    }
    
    for (let i = 0; i < this.config.poolSize; i++) {
      try {
        const worker = new Worker(this.config.scriptUrl, this.config.workerOptions);
        this.workers.push(worker);
        this.availableWorkers.push(worker);
      } catch (error) {
        console.error(`Failed to create worker ${i}:`, error);
      }
    }
  }
  
  /**
   * Get an available worker from the pool
   */
  async acquire(): Promise<Worker> {
    // If there's an available worker, return it immediately
    if (this.availableWorkers.length > 0) {
      const worker = this.availableWorkers.pop()!;
      return worker;
    }
    
    // Otherwise, wait for a worker to become available
    return new Promise((resolve, reject) => {
      this.pendingTasks.push({
        worker: null,
        resolve,
        reject,
      });
    });
  }
  
  /**
   * Release a worker back to the pool
   */
  release(worker: Worker): void {
    // Check if there are pending tasks
    const pendingTask = this.pendingTasks.shift();
    
    if (pendingTask) {
      pendingTask.resolve(worker);
    } else {
      this.availableWorkers.push(worker);
    }
  }
  
  /**
   * Execute a task with a worker from the pool
   */
  async execute<T>(task: (worker: Worker) => Promise<T>): Promise<T> {
    const worker = await this.acquire();
    
    try {
      return await task(worker);
    } finally {
      this.release(worker);
    }
  }
  
  /**
   * Get all workers (for setting up message handlers)
   */
  getWorkers(): Worker[] {
    return [...this.workers];
  }
  
  /**
   * Get pool statistics
   */
  getStats() {
    return {
      total: this.workers.length,
      available: this.availableWorkers.length,
      busy: this.workers.length - this.availableWorkers.length,
      pending: this.pendingTasks.length,
    };
  }
  
  /**
   * Terminate all workers
   */
  terminate(): void {
    for (const worker of this.workers) {
      worker.terminate();
    }
    
    this.workers = [];
    this.availableWorkers = [];
    
    // Reject all pending tasks
    for (const task of this.pendingTasks) {
      task.reject(new Error('Worker pool terminated'));
    }
    this.pendingTasks = [];
  }
}

