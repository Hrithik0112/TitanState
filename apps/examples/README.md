# TitanState Examples

This directory contains example applications demonstrating various features of TitanState.

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm --filter @titanstate/examples dev
```

The examples will be available at `http://localhost:3000`.

## Examples

### 1. Basic Atoms

Demonstrates fundamental atom operations:
- Creating atoms
- Reading and writing values
- Subscribing to changes
- Working with different data types (primitives, objects, arrays)

**Key Concepts:**
- `createStore()` - Create a store instance
- `store.createAtom()` - Create an atom
- `store.get()` - Read atom value
- `store.set()` - Write atom value
- `store.subscribe()` - Subscribe to changes

### 2. React Integration

Shows how to use TitanState with React:
- `useAtom` - Read and write atom values
- `useAtomValue` - Read-only atom access
- `useSetAtom` - Write-only atom access
- `useSelector` - Select derived values
- `StoreProvider` - Provide store context

**Key Concepts:**
- React hooks for seamless integration
- Automatic re-renders on atom changes
- Optimized subscriptions

### 3. Persistence & Lazy Loading

Demonstrates automatic persistence and lazy loading:
- Eager loading (load immediately)
- Lazy loading (load on demand)
- Automatic persistence on updates
- Integration with storage drivers

**Key Concepts:**
- `persisted: true` - Enable persistence
- `lazyLoad: true` - Enable lazy loading
- `store.getAsync()` - Async read with auto-hydration
- Storage drivers (Memory, IndexedDB, FileSystem, Remote)

### 4. Query Client

Shows server-state management:
- `useQuery` - Fetch and cache server data
- `useMutation` - Update server data
- Cache invalidation
- Automatic refetching

**Key Concepts:**
- Query caching
- Stale time and cache time
- Automatic refetching
- Mutation handling

### 5. Worker Reducers

Demonstrates offloading heavy computations to Web Workers:
- Worker bridge setup
- Dispatching actions to workers
- Processing large datasets
- Keeping main thread responsive

**Key Concepts:**
- `WorkerBridge` - Communication with workers
- `dispatchToWorker()` - Send actions to workers
- Worker reducer registration
- Zero-copy data transfers

## Architecture

Each example is self-contained and demonstrates a specific aspect of TitanState:

```
apps/examples/
├── src/
│   ├── index.tsx          # Main entry point with routing
│   ├── index.css          # Global styles
│   └── examples/
│       ├── BasicExample.tsx
│       ├── ReactExample.tsx
│       ├── PersistenceExample.tsx
│       ├── QueryExample.tsx
│       └── WorkerExample.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## Running Examples

### Development Mode

```bash
pnpm --filter @titanstate/examples dev
```

### Production Build

```bash
pnpm --filter @titanstate/examples build
pnpm --filter @titanstate/examples preview
```

## Next Steps

After exploring these examples, you can:

1. **Combine Features**: Mix and match features from different examples
2. **Add Persistence**: Integrate IndexedDB or other storage drivers
3. **Enable DevTools**: Add DevTools bridge for debugging
4. **Optimize Performance**: Use workers for heavy computations
5. **Build Your App**: Use these patterns in your own applications

## Learn More

- [Core API Documentation](../../packages/core/README.md)
- [React Bindings](../../packages/react/README.md)
- [Persistence Layer](../../packages/persist/README.md)
- [Query Client](../../packages/query/README.md)
- [Worker Engine](../../packages/worker/README.md)

