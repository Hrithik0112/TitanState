import { CodeBlock } from '@/components/CodeBlock';

export default function Store() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Store</h1>
      
      <p>
        The store is the central hub of TitanState. It manages all atoms, handles subscriptions,
        and coordinates updates.
      </p>

      <h2>Creating a Store</h2>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';

// Basic store
const store = createStore();

// Store with configuration
const store = createStore({
  persistenceDriver: driver,
  devtoolsBridge: devtools,
  workerBridge: workerBridge,
});`}
      </CodeBlock>

      <h2>Store Configuration</h2>

      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>persistenceDriver</code></td>
            <td><code>Driver</code></td>
            <td>Storage driver for automatic persistence</td>
          </tr>
          <tr>
            <td><code>devtoolsBridge</code></td>
            <td><code>DevToolsBridge</code></td>
            <td>DevTools bridge for event logging</td>
          </tr>
          <tr>
            <td><code>workerBridge</code></td>
            <td><code>WorkerBridge</code></td>
            <td>Worker bridge for heavy computations</td>
          </tr>
        </tbody>
      </table>

      <h2>Store Methods</h2>

      <h3>createAtom</h3>
      <CodeBlock language="typescript">
{`createAtom<T>(key: AtomKey, initial: T, options?: AtomOptions<T>): Atom<T>`}
      </CodeBlock>
      <p>Creates a new atom in the store.</p>

      <h3>get / getAsync</h3>
      <CodeBlock language="typescript">
{`// Synchronous read
get<T>(atom: Atom<T>): T | undefined

// Asynchronous read (handles lazy loading)
getAsync<T>(atom: Atom<T>): Promise<T>`}
      </CodeBlock>

      <h3>set / setAsync</h3>
      <CodeBlock language="typescript">
{`// Synchronous write
set<T>(atom: Atom<T>, value: T): void

// Asynchronous write (handles persistence)
setAsync<T>(atom: Atom<T>, value: T): Promise<void>`}
      </CodeBlock>

      <h3>subscribe</h3>
      <CodeBlock language="typescript">
{`subscribe<T>(atom: Atom<T>, listener: Listener<T>): Unsubscribe`}
      </CodeBlock>
      <p>Subscribe to atom changes. Returns an unsubscribe function.</p>

      <h3>transaction</h3>
      <CodeBlock language="typescript">
{`transaction(callback: TransactionCallback): Promise<void>`}
      </CodeBlock>
      <p>Execute multiple updates in a single transaction.</p>

      <h2>Store Lifecycle</h2>

      <p>
        The store manages the lifecycle of all atoms. When you create an atom, it's registered
        with the store. The store handles:
      </p>

      <ul>
        <li>Atom creation and registration</li>
        <li>Value updates and notifications</li>
        <li>Subscription management</li>
        <li>Automatic persistence (if configured)</li>
        <li>DevTools event logging (if configured)</li>
      </ul>

      <h2>Best Practices</h2>

      <ul>
        <li>Create one store per application</li>
        <li>Configure persistence and DevTools at store creation</li>
        <li>Use transactions for multiple related updates</li>
        <li>Clean up subscriptions when components unmount</li>
      </ul>
    </div>
  );
}

