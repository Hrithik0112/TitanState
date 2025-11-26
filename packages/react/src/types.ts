/**
 * React-specific types
 */

import type { Store } from '@titanstate/core';
import type { Atom, AtomValue, Action } from '@titanstate/types';

export type { Store, Atom, AtomValue, Action };

/**
 * Selector function that derives a value from atom values
 */
export type Selector<T = AtomValue> = (values: unknown[]) => T;

/**
 * Equality function for selectors
 */
export type EqualityFn<T> = (a: T, b: T) => boolean;

