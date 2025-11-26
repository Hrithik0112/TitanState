# TitanState

The next-generation scalable state management engine.

## Overview

TitanState is a production-ready, high-performance state management platform designed to safely handle very large datasets (100MB–GB range) in browsers and client apps while preserving the developer ergonomics of Redux/RTK.

## Architecture

TitanState is built with a modular architecture:

- **Core Store Engine** (`@titanstate/core`) - Atom-based reactive state management
- **React Bindings** (`@titanstate/react`) - React hooks and provider
- **Worker Engine** (`@titanstate/worker`) - Off-main-thread reducers and transformations
- **Persistence Layer** (`@titanstate/persist`) - IndexedDB, Memory, FS, and Remote drivers
- **Query Client** (`@titanstate/query`) - Server-state caching with eviction policies
- **DevTools** (`@titanstate/devtools`) - Event-based inspector with time-travel
- **Reactivity Engine** (`@titanstate/reactivity`) - Signal/selector system

## Key Features

- **Atom-based Architecture**: Smallest addressable reactive units with structural sharing
- **Lazy Hydration**: Large datasets loaded on-demand from persistent storage
- **Worker Offloading**: Heavy computations run in Web Workers
- **Zero-Copy Patches**: Path-based updates with ArrayBuffer transfers
- **Event Sourcing**: Append-only event log for time-travel debugging
- **Modular Drivers**: Pluggable storage backends (IndexedDB, FileSystem, Remote)

## Getting Started

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run development mode
pnpm dev
```

## Project Structure

```
TitanState/
├── packages/
│   ├── core/          # Core store engine
│   ├── react/         # React bindings
│   ├── worker/        # Worker engine
│   ├── persist/       # Persistence drivers
│   ├── query/         # Query client
│   ├── devtools/      # DevTools bridge
│   ├── reactivity/    # Signal/selector engine
│   └── types/         # Shared TypeScript types
├── apps/
│   ├── examples/      # Example applications
│   ├── benchmarks/    # Performance benchmarks
│   └── devtools-extension/  # Browser extension
└── turbo.json         # Turborepo configuration
```

## Development

This project uses:
- **pnpm** for package management
- **Turborepo** for monorepo task orchestration
- **TypeScript** with strict mode
- **ESM-first** with CJS fallback

## License

[To be determined]
