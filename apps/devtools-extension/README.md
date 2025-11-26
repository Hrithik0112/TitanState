# TitanState DevTools Extension

Browser extension for debugging TitanState applications.

## Development

```bash
# Install dependencies
pnpm install

# Build extension
pnpm build

# Watch mode
pnpm dev
```

## Installation

1. Build the extension: `pnpm build`
2. Open Chrome/Edge: `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` directory

## Features

- **Event Inspector**: View all TitanState events in real-time
- **Time-Travel Debugging**: Jump to any point in the event history
- **Atom Graph**: Visualize atom dependencies (coming soon)
- **State Inspector**: View current atom values (coming soon)
- **Memory Usage**: Monitor memory consumption (coming soon)

## Usage

1. Open DevTools in your browser
2. Look for the "TitanState" tab
3. The extension will automatically connect to TitanState apps on the page

## Communication Protocol

The extension communicates with TitanState apps via `postMessage`:

- **App → Extension**: Events are sent with `source: 'titanstate-devtools'`
- **Extension → App**: Messages are sent with `source: 'titanstate-devtools-extension'`

