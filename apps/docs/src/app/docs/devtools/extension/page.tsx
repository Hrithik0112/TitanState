import { CodeBlock } from '@/components/CodeBlock';

export default function DevToolsExtension() {
  return (
    <>
      <h1>DevTools Browser Extension</h1>
      
      <p>
        The TitanState DevTools browser extension provides a visual interface for debugging
        your TitanState applications.
      </p>

      <h2>Installation</h2>

      <h3>Chrome/Edge</h3>
      <ol>
        <li>Build the extension: <code>cd apps/devtools-extension && pnpm build</code></li>
        <li>Open <code>chrome://extensions/</code></li>
        <li>Enable "Developer mode"</li>
        <li>Click "Load unpacked"</li>
        <li>Select the <code>dist</code> directory</li>
      </ol>

      <h3>Firefox</h3>
      <ol>
        <li>Build the extension</li>
        <li>Open <code>about:debugging</code></li>
        <li>Click "This Firefox"</li>
        <li>Click "Load Temporary Add-on"</li>
        <li>Select the manifest file</li>
      </ol>

      <h2>Using the Extension</h2>

      <ol>
        <li>Open DevTools in your browser (F12)</li>
        <li>Look for the "TitanState" tab</li>
        <li>The extension automatically connects to TitanState apps</li>
      </ol>

      <h2>Features</h2>

      <h3>Event Inspector</h3>
      <p>
        View all events in real-time. Filter by event type, search by atom key, and
        inspect event details.
      </p>

      <h3>State Inspector</h3>
      <p>
        View current values of all atoms. Search and filter atoms, and see their metadata.
      </p>

      <h3>Time-Travel</h3>
      <p>
        Jump to any point in the event history. See the state at that point in time.
      </p>

      <h3>Atom Graph</h3>
      <p>
        Visualize atom dependencies and relationships (coming soon).
      </p>

      <h2>Communication</h2>

      <p>
        The extension communicates with your app via <code>postMessage</code>. Your app
        must have DevTools enabled:
      </p>

      <CodeBlock language="typescript">
{`import { DevToolsBridge } from '@titanstate/devtools';

const devtools = new DevToolsBridge({
  enabled: true, // Must be enabled
});

const store = createStore({
  devtoolsBridge: devtools,
});`}
      </CodeBlock>

      <h2>Troubleshooting</h2>

      <h3>Extension Not Connecting</h3>
      <ul>
        <li>Ensure DevTools is enabled in your app</li>
        <li>Check browser console for errors</li>
        <li>Verify extension is loaded</li>
      </ul>

      <h3>No Events Showing</h3>
      <ul>
        <li>Ensure you're making state changes</li>
        <li>Check that DevTools bridge is initialized</li>
        <li>Verify event logging is enabled</li>
      </ul>
    </>
  );
}

