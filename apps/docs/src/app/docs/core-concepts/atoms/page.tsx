import { CodeBlock } from '@/components/CodeBlock';

export default function Atoms() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Atoms</h1>
      
      <p>
        Atoms are the fundamental unit of state in TitanState. An atom represents a single piece
        of state that can be read, written, and subscribed to.
      </p>

      <h2>Creating Atoms</h2>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';

const store = createStore();

// Create a simple atom
const countAtom = store.createAtom('count', 0);

// Create an atom with options
const userAtom = store.createAtom('user', { name: 'Guest' }, {
  persisted: true,
  lazyLoad: false,
  compress: true,
});`}
      </CodeBlock>

      <h2>Atom Options</h2>

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
            <td><code>persisted</code></td>
            <td><code>boolean</code></td>
            <td>Whether the atom should be persisted to storage</td>
          </tr>
          <tr>
            <td><code>lazyLoad</code></td>
            <td><code>boolean</code></td>
            <td>Load atom value only when accessed (for large data)</td>
          </tr>
          <tr>
            <td><code>compress</code></td>
            <td><code>boolean</code></td>
            <td>Compress atom value when persisted</td>
          </tr>
          <tr>
            <td><code>equals</code></td>
            <td><code>(a: T, b: T) => boolean</code></td>
            <td>Custom equality function for change detection</td>
          </tr>
        </tbody>
      </table>

      <h2>Reading and Writing</h2>

      <CodeBlock language="typescript">
{`// Read value (synchronous)
const count = store.get(countAtom);

// Read value (asynchronous, handles lazy loading)
const user = await store.getAsync(userAtom);

// Write value (synchronous)
store.set(countAtom, 10);

// Write value (asynchronous, handles persistence)
await store.setAsync(userAtom, { name: 'John' });`}
      </CodeBlock>

      <h2>Subscriptions</h2>

      <CodeBlock language="typescript">
{`// Subscribe to changes
const unsubscribe = store.subscribe(countAtom, (newValue, previousValue) => {
  console.log('Count changed from', previousValue, 'to', newValue);
});

// Unsubscribe when done
unsubscribe();`}
      </CodeBlock>

      <h2>Best Practices</h2>

      <ul>
        <li>Use descriptive atom keys for debugging</li>
        <li>Enable <code>persisted</code> for data that should survive page reloads</li>
        <li>Use <code>lazyLoad</code> for large datasets that aren't needed immediately</li>
        <li>Provide custom <code>equals</code> functions for complex objects to avoid unnecessary updates</li>
      </ul>
    </div>
  );
}

