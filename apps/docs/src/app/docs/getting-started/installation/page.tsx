import { CodeBlock } from '@/components/CodeBlock';

export default function Installation() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Installation</h1>
      
      <p>
        TitanState is available as a collection of packages. Install only what you need,
        or install everything for full functionality.
      </p>

      <h2>Package Manager</h2>

      <h3>npm</h3>
      <CodeBlock language="bash">
{`npm install @titanstate/core @titanstate/react`}
      </CodeBlock>

      <h3>pnpm</h3>
      <CodeBlock language="bash">
{`pnpm add @titanstate/core @titanstate/react`}
      </CodeBlock>

      <h3>yarn</h3>
      <CodeBlock language="bash">
{`yarn add @titanstate/core @titanstate/react`}
      </CodeBlock>

      <h2>Available Packages</h2>

      <table>
        <thead>
          <tr>
            <th>Package</th>
            <th>Description</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@titanstate/core</code></td>
            <td>Core store engine</td>
            <td>✓ Yes</td>
          </tr>
          <tr>
            <td><code>@titanstate/react</code></td>
            <td>React bindings and hooks</td>
            <td>If using React</td>
          </tr>
          <tr>
            <td><code>@titanstate/persist</code></td>
            <td>Persistence layer with drivers</td>
            <td>For persistence</td>
          </tr>
          <tr>
            <td><code>@titanstate/query</code></td>
            <td>Query client for server-state</td>
            <td>For server-state</td>
          </tr>
          <tr>
            <td><code>@titanstate/worker</code></td>
            <td>Web Worker integration</td>
            <td>For workers</td>
          </tr>
          <tr>
            <td><code>@titanstate/devtools</code></td>
            <td>DevTools integration</td>
            <td>For debugging</td>
          </tr>
          <tr>
            <td><code>@titanstate/types</code></td>
            <td>Shared TypeScript types</td>
            <td>Auto-installed</td>
          </tr>
        </tbody>
      </table>

      <h2>TypeScript</h2>

      <p>
        TitanState is written in TypeScript and includes type definitions. No additional
        <code>@types</code> packages are needed.
      </p>

      <h2>Browser Support</h2>

      <p>TitanState supports all modern browsers:</p>
      <ul>
        <li>Chrome/Edge 90+</li>
        <li>Firefox 88+</li>
        <li>Safari 14+</li>
      </ul>

      <h2>Next Steps</h2>
      <ul>
        <li><a href="/docs/getting-started/quick-start">Quick Start Guide</a></li>
        <li><a href="/docs/core-concepts/atoms">Learn about Atoms</a></li>
      </ul>
    </div>
  );
}

