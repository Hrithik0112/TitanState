import { CodeBlock } from '@/components/CodeBlock';

export default function CoreAPI() {
  return (
    <>
      <h1>Core API Reference</h1>
      
      <h2>createStore</h2>
      
      <p>Creates a new TitanState store instance.</p>

      <CodeBlock language="typescript">
{`function createStore(config?: StoreConfig): Store`}
      </CodeBlock>

      <h3>Parameters</h3>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>config</code></td>
            <td><code>StoreConfig</code></td>
            <td>Optional store configuration</td>
          </tr>
        </tbody>
      </table>

      <h3>Returns</h3>
      <p>A <code>Store</code> instance.</p>

      <h3>Example</h3>
      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';

const store = createStore({
  persistenceDriver: driver,
  devtoolsBridge: devtools,
});`}
      </CodeBlock>

      <h2>Store Methods</h2>

      <h3>createAtom</h3>
      <CodeBlock language="typescript">
{`createAtom<T>(key: AtomKey, initial: T, options?: AtomOptions<T>): Atom<T>`}
      </CodeBlock>
      <p>Creates a new atom with the given key, initial value, and options.</p>

      <h3>get</h3>
      <CodeBlock language="typescript">
{`get<T>(atom: Atom<T>): T | undefined`}
      </CodeBlock>
      <p>Gets the current value of an atom (synchronous).</p>

      <h3>getAsync</h3>
      <CodeBlock language="typescript">
{`getAsync<T>(atom: Atom<T>): Promise<T>`}
      </CodeBlock>
      <p>Gets the current value of an atom (asynchronous, handles lazy loading).</p>

      <h3>set</h3>
      <CodeBlock language="typescript">
{`set<T>(atom: Atom<T>, value: T): void`}
      </CodeBlock>
      <p>Sets the value of an atom (synchronous).</p>

      <h3>setAsync</h3>
      <CodeBlock language="typescript">
{`setAsync<T>(atom: Atom<T>, value: T): Promise<void>`}
      </CodeBlock>
      <p>Sets the value of an atom (asynchronous, handles persistence).</p>

      <h3>subscribe</h3>
      <CodeBlock language="typescript">
{`subscribe<T>(atom: Atom<T>, listener: Listener<T>): Unsubscribe`}
      </CodeBlock>
      <p>Subscribes to changes in an atom. Returns an unsubscribe function.</p>

      <h3>transaction</h3>
      <CodeBlock language="typescript">
{`transaction(callback: TransactionCallback): Promise<void>`}
      </CodeBlock>
      <p>Executes multiple updates in a single transaction.</p>
    </>
  );
}

