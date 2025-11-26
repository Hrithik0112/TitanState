/**
 * Path-based patch generation and application
 */

import type { PatchOp } from '@titanstate/types';

/**
 * JSON Pointer path separator
 */
const PATH_SEPARATOR = '/';

/**
 * Escape special characters in JSON Pointer
 */
function escapePath(path: string): string {
  return path.replace(/~/g, '~0').replace(/\//g, '~1');
}

/**
 * Unescape JSON Pointer
 */
function unescapePath(path: string): string {
  return path.replace(/~1/g, '/').replace(/~0/g, '~');
}

/**
 * Convert array path to JSON Pointer string
 */
export function pathToString(path: (string | number)[]): string {
  if (path.length === 0) {
    return '';
  }
  
  return PATH_SEPARATOR + path
    .map(segment => escapePath(String(segment)))
    .join(PATH_SEPARATOR);
}

/**
 * Convert JSON Pointer string to array path
 */
export function stringToPath(path: string): (string | number)[] {
  if (path === '' || path === PATH_SEPARATOR) {
    return [];
  }
  
  const segments = path.split(PATH_SEPARATOR).slice(1);
  return segments.map(segment => {
    const unescaped = unescapePath(segment);
    // Try to parse as number
    const num = Number(unescaped);
    if (!isNaN(num) && String(num) === unescaped) {
      return num;
    }
    return unescaped;
  });
}

/**
 * Get value at path in object
 */
export function getValueAtPath(obj: unknown, path: (string | number)[]): unknown {
  let current: unknown = obj;
  
  for (const segment of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    if (typeof current === 'object' && !Array.isArray(current)) {
      current = (current as Record<string, unknown>)[String(segment)];
    } else if (Array.isArray(current)) {
      const index = typeof segment === 'number' ? segment : Number(segment);
      if (isNaN(index) || index < 0 || index >= current.length) {
        return undefined;
      }
      current = current[index];
    } else {
      return undefined;
    }
  }
  
  return current;
}

/**
 * Set value at path in object (immutable)
 */
export function setValueAtPath(
  obj: unknown,
  path: (string | number)[],
  value: unknown
): unknown {
  if (path.length === 0) {
    return value;
  }
  
  const [head, ...tail] = path;
  
  if (Array.isArray(obj)) {
    const newArray = [...obj];
    const index = typeof head === 'number' ? head : Number(head);
    
    if (tail.length === 0) {
      if (index >= 0 && index < newArray.length) {
        newArray[index] = value;
      } else if (index === newArray.length) {
        newArray.push(value);
      }
      return newArray;
    } else {
      newArray[index] = setValueAtPath(newArray[index], tail, value);
      return newArray;
    }
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = { ...(obj as Record<string, unknown>) };
    
    if (tail.length === 0) {
      newObj[String(head)] = value;
    } else {
      newObj[String(head)] = setValueAtPath(newObj[String(head)], tail, value);
    }
    
    return newObj;
  } else {
    // Create new object/array structure
    if (typeof head === 'number' || (!isNaN(Number(head)) && tail.length > 0)) {
      const newArray: unknown[] = [];
      const index = typeof head === 'number' ? head : Number(head);
      newArray[index] = setValueAtPath(undefined, tail, value);
      return newArray;
    } else {
      const newObj: Record<string, unknown> = {};
      newObj[String(head)] = setValueAtPath(undefined, tail, value);
      return newObj;
    }
  }
}

/**
 * Delete value at path in object (immutable)
 */
export function deleteValueAtPath(obj: unknown, path: (string | number)[]): unknown {
  if (path.length === 0) {
    return undefined;
  }
  
  const [head, ...tail] = path;
  
  if (Array.isArray(obj)) {
    const newArray = [...obj];
    const index = typeof head === 'number' ? head : Number(head);
    
    if (tail.length === 0) {
      newArray.splice(index, 1);
      return newArray;
    } else {
      newArray[index] = deleteValueAtPath(newArray[index], tail);
      return newArray;
    }
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = { ...(obj as Record<string, unknown>) };
    
    if (tail.length === 0) {
      delete newObj[String(head)];
    } else {
      newObj[String(head)] = deleteValueAtPath(newObj[String(head)], tail);
    }
    
    return newObj;
  }
  
  return obj;
}

/**
 * Apply a patch operation to an object
 */
export function applyPatch(obj: unknown, patch: PatchOp): unknown {
  const path = stringToPath(patch.path);
  
  switch (patch.op) {
    case 'set':
      return setValueAtPath(obj, path, patch.value);
    
    case 'delete':
      return deleteValueAtPath(obj, path);
    
    case 'splice': {
      if (!Array.isArray(obj)) {
        throw new Error('splice operation requires array at path');
      }
      
      const arrayPath = path.slice(0, -1);
      const array = getValueAtPath(obj, arrayPath) as unknown[];
      const index = path[path.length - 1];
      
      if (!Array.isArray(array)) {
        throw new Error('splice operation requires array at path');
      }
      
      const newArray = [...array];
      const idx = typeof index === 'number' ? index : Number(index);
      
      if (patch.items) {
        newArray.splice(idx, patch.deleteCount, ...patch.items);
      } else {
        newArray.splice(idx, patch.deleteCount);
      }
      
      return setValueAtPath(obj, arrayPath, newArray);
    }
    
    case 'binary-chunk': {
      // For binary chunks, we need to handle ArrayBuffer transfers
      // This is a simplified implementation
      const current = getValueAtPath(obj, path);
      
      if (current instanceof ArrayBuffer) {
        const newBuffer = current.slice();
        const view = new Uint8Array(newBuffer);
        const chunk = new Uint8Array(patch.data);
        view.set(chunk, patch.offset);
        return setValueAtPath(obj, path, newBuffer);
      }
      
      throw new Error('binary-chunk operation requires ArrayBuffer at path');
    }
    
    default:
      throw new Error(`Unknown patch operation: ${(patch as PatchOp).op}`);
  }
}

/**
 * Apply multiple patches to an object
 */
export function applyPatches(obj: unknown, patches: PatchOp[]): unknown {
  let result = obj;
  
  for (const patch of patches) {
    result = applyPatch(result, patch);
  }
  
  return result;
}

/**
 * Generate patches by comparing two objects (simplified implementation)
 * This is a basic diff algorithm - can be enhanced for production
 */
export function generatePatches(
  oldObj: unknown,
  newObj: unknown,
  basePath: (string | number)[] = []
): PatchOp[] {
  const patches: PatchOp[] = [];
  
  // Simple equality check
  if (Object.is(oldObj, newObj)) {
    return patches;
  }
  
  // If one is null/undefined and the other isn't
  if ((oldObj === null || oldObj === undefined) !== (newObj === null || newObj === undefined)) {
    patches.push({
      op: 'set',
      path: pathToString(basePath),
      value: newObj,
    });
    return patches;
  }
  
  // If types don't match, replace
  if (typeof oldObj !== typeof newObj) {
    patches.push({
      op: 'set',
      path: pathToString(basePath),
      value: newObj,
    });
    return patches;
  }
  
  // Handle arrays
  if (Array.isArray(oldObj) && Array.isArray(newObj)) {
    const maxLength = Math.max(oldObj.length, newObj.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (i >= oldObj.length) {
        // New items
        patches.push({
          op: 'set',
          path: pathToString([...basePath, i]),
          value: newObj[i],
        });
      } else if (i >= newObj.length) {
        // Deleted items
        patches.push({
          op: 'delete',
          path: pathToString([...basePath, i]),
        });
      } else {
        // Recursively compare
        patches.push(...generatePatches(oldObj[i], newObj[i], [...basePath, i]));
      }
    }
    
    return patches;
  }
  
  // Handle objects
  if (typeof oldObj === 'object' && oldObj !== null && typeof newObj === 'object' && newObj !== null) {
    const oldKeys = new Set(Object.keys(oldObj as Record<string, unknown>));
    const newKeys = new Set(Object.keys(newObj as Record<string, unknown>));
    
    // Check for deleted keys
    for (const key of oldKeys) {
      if (!newKeys.has(key)) {
        patches.push({
          op: 'delete',
          path: pathToString([...basePath, key]),
        });
      }
    }
    
    // Check for added/modified keys
    for (const key of newKeys) {
      const oldValue = (oldObj as Record<string, unknown>)[key];
      const newValue = (newObj as Record<string, unknown>)[key];
      
      if (!oldKeys.has(key)) {
        // New key
        patches.push({
          op: 'set',
          path: pathToString([...basePath, key]),
          value: newValue,
        });
      } else {
        // Recursively compare
        patches.push(...generatePatches(oldValue, newValue, [...basePath, key]));
      }
    }
    
    return patches;
  }
  
  // Primitive values - just set
  patches.push({
    op: 'set',
    path: pathToString(basePath),
    value: newObj,
  });
  
  return patches;
}

