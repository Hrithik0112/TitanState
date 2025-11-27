import { CodeBlock } from '@/components/CodeBlock';

export default function PersistenceAPI() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Persistence API Reference</h1>
      
      <h2>Drivers</h2>

      <h3>MemoryDriver</h3>
      <CodeBlock language="typescript">
{`new MemoryDriver()`}
      </CodeBlock>

      <h3>IndexedDBDriver</h3>
      <CodeBlock language="typescript">
{`new IndexedDBDriver(config: IndexedDBDriverConfig)`}
      </CodeBlock>

      <h3>FileSystemDriver</h3>
      <CodeBlock language="typescript">
{`new FileSystemDriver(config: FileSystemDriverConfig)`}
      </CodeBlock>

      <h3>RemoteDriver</h3>
      <CodeBlock language="typescript">
{`new RemoteDriver(config: RemoteDriverConfig)`}
      </CodeBlock>

      <h2>Hydration</h2>

      <h3>hydrateAtom</h3>
      <CodeBlock language="typescript">
{`function hydrateAtom<T>(
  atom: Atom<T>,
  driver: Driver,
  options?: HydrationOptions
): Promise<T>`}
      </CodeBlock>

      <h3>persistAtom</h3>
      <CodeBlock language="typescript">
{`function persistAtom<T>(
  atom: Atom<T>,
  driver: Driver,
  options?: HydrationOptions
): Promise<void>`}
      </CodeBlock>

      <h2>Compression</h2>

      <h3>compress</h3>
      <CodeBlock language="typescript">
{`function compress(
  data: ArrayBuffer,
  options?: CompressionOptions
): Promise<ArrayBuffer>`}
      </CodeBlock>

      <h3>decompress</h3>
      <CodeBlock language="typescript">
{`function decompress(
  data: ArrayBuffer,
  options?: CompressionOptions
): Promise<ArrayBuffer>`}
      </CodeBlock>
    </div>
  );
}

