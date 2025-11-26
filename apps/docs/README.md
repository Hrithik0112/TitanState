# TitanState Documentation

Professional documentation site built with Next.js and Tailwind CSS, similar to Next.js and Tailwind CSS documentation sites.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Structure

```
apps/docs/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── docs/         # Documentation pages
│   │   └── layout.tsx    # Root layout
│   └── components/       # Reusable components
│       ├── Header.tsx    # Site header
│       ├── Sidebar.tsx   # Navigation sidebar
│       └── CodeBlock.tsx # Syntax highlighting
├── tailwind.config.js    # Tailwind configuration
└── next.config.js        # Next.js configuration
```

## Features

- **Modern Design** - Clean, professional design inspired by Next.js and Tailwind docs
- **Syntax Highlighting** - Code examples with syntax highlighting
- **Responsive Layout** - Mobile-friendly with collapsible sidebar
- **Search** - Full-text search (coming soon)
- **Dark Mode** - Dark mode support (coming soon)
- **TypeScript** - Fully typed with TypeScript

## Documentation Sections

- **Getting Started** - Installation and quick start
- **Core Concepts** - Atoms, Store, Subscriptions
- **React Integration** - Hooks and best practices
- **Persistence** - Storage drivers and lazy loading
- **Query Client** - Server-state management
- **Workers** - Web Worker integration
- **DevTools** - Debugging and time-travel
- **Guides** - Performance, migration, best practices
- **API Reference** - Complete API documentation

