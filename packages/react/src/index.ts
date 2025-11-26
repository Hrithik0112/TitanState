/**
 * @titanstate/react - React bindings for TitanState
 * 
 * Main entry point for React integration
 */

// Provider
export { StoreProvider, useStore } from './context';
export type { StoreProviderProps } from './context';

// Hooks
export {
  useAtom,
  useAtomValue,
  useSetAtom,
  useSelector,
  useDispatch,
} from './hooks';

// Types
export type {
  Store,
  Atom,
  AtomValue,
  Action,
  Selector,
  EqualityFn,
} from './types';

