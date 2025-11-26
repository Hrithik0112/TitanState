import { CodeBlock } from '@/components/CodeBlock';

export default function BestPractices() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Best Practices</h1>
      
      <p>
        Follow these best practices to get the most out of TitanState.
      </p>

      <h2>Atom Design</h2>

      <ul>
        <li>Keep atoms focused - one concept per atom</li>
        <li>Use descriptive keys for debugging</li>
        <li>Normalize data - avoid deep nesting</li>
        <li>Use derived state with selectors when possible</li>
      </ul>

      <h2>Performance</h2>

      <ul>
        <li>Enable lazy loading for large datasets</li>
        <li>Use compression for persisted data</li>
        <li>Batch updates with transactions</li>
        <li>Use custom equality functions to prevent unnecessary updates</li>
        <li>Offload heavy computations to workers</li>
      </ul>

      <h2>React Integration</h2>

      <ul>
        <li>Use the right hook for the job (useAtomValue, useSetAtom, etc.)</li>
        <li>Split components that use different atoms</li>
        <li>Use selectors for derived values</li>
        <li>Clean up subscriptions (automatic with hooks)</li>
      </ul>

      <h2>Persistence</h2>

      <ul>
        <li>Only persist data that needs to survive reloads</li>
        <li>Use lazy loading for large persisted data</li>
        <li>Enable compression for text/JSON data</li>
        <li>Choose the right storage driver for your use case</li>
      </ul>

      <h2>Error Handling</h2>

      <CodeBlock language="typescript">
{`try {
  await store.setAsync(atom, value);
} catch (error) {
  // Handle persistence errors
  console.error('Failed to persist:', error);
}

try {
  const value = await store.getAsync(atom);
} catch (error) {
  // Handle hydration errors
  console.error('Failed to hydrate:', error);
}`}
      </CodeBlock>

      <h2>Testing</h2>

      <ul>
        <li>Create test stores for each test</li>
        <li>Use MemoryDriver for testing persistence</li>
        <li>Mock worker bridge for worker tests</li>
        <li>Test atom updates and subscriptions</li>
      </ul>
    </div>
  );
}

