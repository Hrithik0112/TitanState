/**
 * Benchmark: 10k-item table CRUD with lazy hydration
 */

import { createStore } from '@titanstate/core';
import { MemoryDriver } from '@titanstate/persist';
import { persistAtom, hydrateAtom } from '@titanstate/persist';

interface TableItem {
  id: number;
  name: string;
  value: number;
}

export async function benchmarkLargeTable(itemCount: number = 10_000): Promise<{
  createTime: number;
  readTime: number;
  updateTime: number;
  deleteTime: number;
  hydrationTime: number;
}> {
  const store = createStore();
  const driver = new MemoryDriver();
  
  // Create table atom
  const tableAtom = store.createAtom<TableItem[]>('table', [], {
    persisted: true,
    lazyLoad: true,
  });
  
  // Create items
  const createStart = performance.now();
  const items: TableItem[] = [];
  for (let i = 0; i < itemCount; i++) {
    items.push({
      id: i,
      name: `Item ${i}`,
      value: Math.random() * 1000,
    });
  }
  store.set(tableAtom, items);
  await persistAtom(tableAtom, driver);
  const createEnd = performance.now();
  
  // Hydrate (lazy load)
  const hydrateStart = performance.now();
  await hydrateAtom(tableAtom, driver);
  const hydrateEnd = performance.now();
  
  // Read
  const readStart = performance.now();
  const data = store.get(tableAtom);
  const readEnd = performance.now();
  
  // Update
  const updateStart = performance.now();
  if (data) {
    const updated = [...data];
    updated[0] = { ...updated[0], value: 9999 } as TableItem;
    store.set(tableAtom, updated);
  }
  const updateEnd = performance.now();
  
  // Delete
  const deleteStart = performance.now();
  if (data) {
    const filtered = data.filter(item => item.id !== 0);
    store.set(tableAtom, filtered);
  }
  const deleteEnd = performance.now();
  
  return {
    createTime: createEnd - createStart,
    readTime: readEnd - readStart,
    updateTime: updateEnd - updateStart,
    deleteTime: deleteEnd - deleteStart,
    hydrationTime: hydrateEnd - hydrateStart,
  };
}

