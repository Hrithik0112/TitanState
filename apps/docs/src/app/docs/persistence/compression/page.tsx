import { CodeBlock } from '@/components/CodeBlock';

export default function Compression() {
  return (
    <>
      <h1>Compression</h1>
      
      <p>
        TitanState supports automatic compression for persisted atoms. This reduces storage
        size and improves load times for large datasets.
      </p>

      <h2>Enabling Compression</h2>

      <CodeBlock language="typescript">
{`const dataAtom = store.createAtom('data', largeData, {
  persisted: true,
  compress: true, // Enable compression
});`}
      </CodeBlock>

      <h2>Supported Algorithms</h2>

      <table>
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Browser Support</th>
            <th>Compression Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>gzip</code></td>
            <td>All modern browsers</td>
            <td>Good</td>
          </tr>
          <tr>
            <td><code>deflate</code></td>
            <td>All modern browsers</td>
            <td>Good</td>
          </tr>
          <tr>
            <td><code>brotli</code></td>
            <td>Limited (fallback available)</td>
            <td>Excellent</td>
          </tr>
        </tbody>
      </table>

      <h2>Automatic Compression</h2>

      <p>
        When <code>compress: true</code> is set, data is automatically compressed when
        persisted and decompressed when loaded.
      </p>

      <CodeBlock language="typescript">
{`// Data is compressed when persisted
const compressedAtom = store.createAtom('data', largeData, {
  persisted: true,
  compress: true,
});

// Automatically decompressed when loaded
const data = await store.getAsync(compressedAtom);`}
      </CodeBlock>

      <h2>Compression Options</h2>

      <p>
        You can specify compression options when persisting:
      </p>

      <CodeBlock language="typescript">
{`import { persistAtom } from '@titanstate/persist';

await persistAtom(atom, driver, {
  compression: 'gzip', // or 'deflate', 'brotli'
});`}
      </CodeBlock>

      <h2>When to Use Compression</h2>

      <ul>
        <li><strong>Large datasets</strong> - Reduce storage size</li>
        <li><strong>Text data</strong> - Text compresses well</li>
        <li><strong>JSON data</strong> - JSON compresses very well</li>
        <li><strong>Network transfer</strong> - Reduce bandwidth usage</li>
      </ul>

      <h2>When NOT to Use Compression</h2>

      <ul>
        <li><strong>Already compressed data</strong> - Images, videos, etc.</li>
        <li><strong>Small data</strong> - Overhead may not be worth it</li>
        <li><strong>Frequently accessed</strong> - Decompression adds latency</li>
      </ul>

      <h2>Performance Considerations</h2>

      <p>
        Compression adds CPU overhead during save/load operations. For very large datasets,
        consider:
      </p>

      <ul>
        <li>Using compression for storage but keeping uncompressed in memory</li>
        <li>Chunking large data (automatic for 10MB+)</li>
        <li>Using Web Workers for compression (future feature)</li>
      </ul>

      <h2>Example</h2>

      <CodeBlock language="typescript">
{`// Large JSON dataset
const largeJsonAtom = store.createAtom('largeJson', largeJsonData, {
  persisted: true,
  compress: true, // Compress to save space
});

// Save compresses automatically
await store.setAsync(largeJsonAtom, updatedData);

// Load decompresses automatically
const data = await store.getAsync(largeJsonAtom);`}
      </CodeBlock>
    </>
  );
}

