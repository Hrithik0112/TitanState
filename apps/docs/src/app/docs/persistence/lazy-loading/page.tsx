import { CodeBlock } from '@/components/CodeBlock';

export default function LazyLoading() {
  return (
    <>
      <h1>Lazy Loading</h1>
      
      <p>
        Lazy loading allows you to defer loading atom values until they're actually needed.
        This is essential for large datasets that aren't needed immediately.
      </p>

      <h2>Enabling Lazy Loading</h2>

      <CodeBlock language="typescript">
{`const largeDataAtom = store.createAtom('largeData', [], {
  persisted: true,
  lazyLoad: true, // Enable lazy loading
});`}
      </CodeBlock>

      <h2>How It Works</h2>

      <p>
        When <code>lazyLoad: true</code> is set:
      </p>

      <ul>
        <li>The atom is created but not loaded from storage</li>
        <li><code>store.get()</code> returns <code>undefined</code></li>
        <li><code>store.getAsync()</code> triggers loading from storage</li>
        <li>Once loaded, the value is cached in memory</li>
      </ul>

      <h2>Basic Usage</h2>

      <CodeBlock language="typescript">
{`// Create lazy-loaded atom
const notesAtom = store.createAtom('notes', [], {
  persisted: true,
  lazyLoad: true,
});

// Check if loaded
if (!notesAtom.meta.hydrated) {
  // Load when needed
  const notes = await store.getAsync(notesAtom);
  // Now notesAtom.meta.hydrated === true
}`}
      </CodeBlock>

      <h2>React Integration</h2>

      <CodeBlock language="tsx">
{`function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(notesAtom.meta.hydrated);
  
  const loadNotes = async () => {
    setLoading(true);
    try {
      const loadedNotes = await store.getAsync(notesAtom);
      setNotes(loadedNotes);
      setHydrated(true);
    } finally {
      setLoading(false);
    }
  };
  
  if (!hydrated) {
    return (
      <div>
        <p>Notes not loaded</p>
        <button onClick={loadNotes} disabled={loading}>
          {loading ? 'Loading...' : 'Load Notes'}
        </button>
      </>
    );
  }
  
  return <div>{/* Render notes */}</div>;
}`}
      </CodeBlock>

      <h2>When to Use Lazy Loading</h2>

      <ul>
        <li><strong>Large datasets</strong> - Don't load 100MB+ on app start</li>
        <li><strong>Optional features</strong> - Load data when feature is accessed</li>
        <li><strong>Performance</strong> - Reduce initial load time</li>
        <li><strong>Memory</strong> - Keep memory usage low</li>
      </ul>

      <h2>Best Practices</h2>

      <ul>
        <li>Use lazy loading for datasets larger than 1MB</li>
        <li>Show loading states when fetching lazy data</li>
        <li>Cache loaded data in memory (automatic)</li>
        <li>Consider chunking for very large datasets (automatic for 10MB+)</li>
      </ul>

      <h2>Eager vs Lazy</h2>

      <CodeBlock language="typescript">
{`// Eager loading (default) - loads immediately
const settingsAtom = store.createAtom('settings', {}, {
  persisted: true,
  lazyLoad: false, // Loads on store creation
});

// Lazy loading - loads on demand
const largeDataAtom = store.createAtom('largeData', [], {
  persisted: true,
  lazyLoad: true, // Loads when accessed
});`}
      </CodeBlock>
    </>
  );
}

