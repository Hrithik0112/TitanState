import { CodeBlock } from '@/components/CodeBlock';

export default function ReactAPI() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>React API Reference</h1>
      
      <h2>StoreProvider</h2>
      
      <CodeBlock language="tsx">
{`<StoreProvider store={store}>
  <App />
</StoreProvider>`}
      </CodeBlock>
      <p>Provides store context to child components.</p>

      <h2>useAtom</h2>
      <CodeBlock language="typescript">
{`function useAtom<T>(atom: Atom<T>): [T, (value: T) => void]`}
      </CodeBlock>
      <p>Read and write atom value. Returns [value, setter].</p>

      <h2>useAtomValue</h2>
      <CodeBlock language="typescript">
{`function useAtomValue<T>(atom: Atom<T>): T`}
      </CodeBlock>
      <p>Read-only atom access.</p>

      <h2>useSetAtom</h2>
      <CodeBlock language="typescript">
{`function useSetAtom<T>(atom: Atom<T>): (value: T) => void`}
      </CodeBlock>
      <p>Write-only atom access.</p>

      <h2>useSelector</h2>
      <CodeBlock language="typescript">
{`function useSelector<T>(
  atoms: Atom<unknown>[],
  selector: (values: unknown[]) => T,
  equalityFn?: EqualityFn<T>
): T`}
      </CodeBlock>
      <p>Select derived value from atoms.</p>

      <h2>useDispatch</h2>
      <CodeBlock language="typescript">
{`function useDispatch(): (action: Action) => void`}
      </CodeBlock>
      <p>Get dispatch function for actions.</p>
    </div>
  );
}

