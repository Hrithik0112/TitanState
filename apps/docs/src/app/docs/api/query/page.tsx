import { CodeBlock } from '@/components/CodeBlock';

export default function QueryAPI() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Query API Reference</h1>
      
      <h2>QueryClient</h2>
      <CodeBlock language="typescript">
{`new QueryClient(config?: QueryClientConfig)`}
      </CodeBlock>

      <h3>Methods</h3>
      <ul>
        <li><code>fetchQuery</code> - Fetch and cache query</li>
        <li><code>prefetchQuery</code> - Prefetch query</li>
        <li><code>invalidateQuery</code> - Invalidate query</li>
        <li><code>removeQuery</code> - Remove from cache</li>
        <li><code>getQueryData</code> - Get cached data</li>
        <li><code>setQueryData</code> - Set cached data</li>
      </ul>

      <h2>useQuery</h2>
      <CodeBlock language="typescript">
{`function useQuery<TData>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TData>,
  options?: QueryOptions<TData>
): QueryResult<TData>`}
      </CodeBlock>

      <h2>useMutation</h2>
      <CodeBlock language="typescript">
{`function useMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: MutationOptions<TData, TVariables>
): MutationResult<TData, TVariables>`}
      </CodeBlock>

      <h2>useQueryClient</h2>
      <CodeBlock language="typescript">
{`function useQueryClient(): QueryClient`}
      </CodeBlock>
    </div>
  );
}

