import { CodeBlock } from '@/components/CodeBlock';

export default function DevToolsOverview() {
  return (
    <>
      <h1>DevTools Overview</h1>
      
      <p>
        TitanState DevTools provides powerful debugging capabilities including event logging,
        time-travel debugging, and state inspection.
      </p>

      <h2>Features</h2>

      <ul>
        <li><strong>Event Logging</strong> - Track all state changes</li>
        <li><strong>Time-Travel</strong> - Jump to any point in history</li>
        <li><strong>State Inspection</strong> - View current atom values</li>
        <li><strong>Atom Graph</strong> - Visualize atom dependencies</li>
        <li><strong>Performance</strong> - Monitor update performance</li>
      </ul>

      <h2>Basic Setup</h2>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';
import { DevToolsBridge } from '@titanstate/devtools';

// Create DevTools bridge
const devtools = new DevToolsBridge({
  enabled: true,
  eventLog: {
    maxInMemoryEvents: 10000,
    persist: false,
  },
});

// Create store with DevTools
const store = createStore({
  devtoolsBridge: devtools,
});`}
      </CodeBlock>

      <h2>Event Logging</h2>

      <p>
        DevTools automatically logs all atom updates, transactions, and other events.
        Events are stored in memory and optionally persisted.
      </p>

      <CodeBlock language="typescript">
{`// Events are automatically logged
store.set(countAtom, 1); // Logged as 'atom-update'
await store.transaction(async () => {
  // Logged as 'transaction-start' and 'transaction-end'
});`}
      </CodeBlock>

      <h2>Event Types</h2>

      <table>
        <thead>
          <tr>
            <th>Event Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>atom-update</code></td>
            <td>Atom value changed</td>
          </tr>
          <tr>
            <td><code>transaction-start</code></td>
            <td>Transaction started</td>
          </tr>
          <tr>
            <td><code>transaction-end</code></td>
            <td>Transaction completed</td>
          </tr>
          <tr>
            <td><code>hydration</code></td>
            <td>Atom hydrated from storage</td>
          </tr>
          <tr>
            <td><code>dispatch</code></td>
            <td>Action dispatched</td>
          </tr>
        </tbody>
      </table>

      <h2>Browser Extension</h2>

      <p>
        Install the TitanState DevTools browser extension for a visual debugging interface.
      </p>

      <ul>
        <li>View event log in real-time</li>
        <li>Inspect atom values</li>
        <li>Time-travel through state history</li>
        <li>Visualize atom graph</li>
      </ul>

      <h2>Configuration</h2>

      <CodeBlock language="typescript">
{`const devtools = new DevToolsBridge({
  enabled: process.env.NODE_ENV === 'development',
  eventLog: {
    maxInMemoryEvents: 10000, // Max events in memory
    persist: true, // Persist to storage
    snapshotInterval: 1000, // Create snapshot every N events
  },
  driver: storageDriver, // For persistence
});`}
      </CodeBlock>

      <h2>Next Steps</h2>

      <ul>
        <li><a href="/docs/devtools/extension">Browser Extension</a></li>
        <li><a href="/docs/devtools/time-travel">Time-Travel Debugging</a></li>
      </ul>
    </>
  );
}

