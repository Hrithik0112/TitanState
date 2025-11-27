import { CodeBlock } from '@/components/CodeBlock';

export default function Drivers() {
  return (
    <>
      <h1>Storage Drivers</h1>
      
      <p>
        TitanState supports multiple storage drivers for persistence. Choose the driver
        that best fits your use case.
      </p>

      <h2>Memory Driver</h2>

      <p>
        In-memory storage. Data is lost when the page reloads. Useful for testing or
        temporary data.
      </p>

      <CodeBlock language="typescript">
{`import { MemoryDriver } from '@titanstate/persist';

const driver = new MemoryDriver();

const store = createStore({
  persistenceDriver: driver,
});`}
      </CodeBlock>

      <h2>IndexedDB Driver</h2>

      <p>
        Browser IndexedDB storage. Persistent across page reloads. Best for most web
        applications.
      </p>

      <CodeBlock language="typescript">
{`import { IndexedDBDriver } from '@titanstate/persist';

const driver = new IndexedDBDriver({
  dbName: 'myapp',
  version: 1,
});

const store = createStore({
  persistenceDriver: driver,
});`}
      </CodeBlock>

      <h3>IndexedDBDriver Options</h3>
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
            <td><code>dbName</code></td>
            <td><code>string</code></td>
            <td>Database name</td>
          </tr>
          <tr>
            <td><code>version</code></td>
            <td><code>number</code></td>
            <td>Database version</td>
          </tr>
        </tbody>
      </table>

      <h2>FileSystem Driver</h2>

      <p>
        File System Access API. Allows users to save/load files directly. Only available
        in supported browsers.
      </p>

      <CodeBlock language="typescript">
{`import { FileSystemDriver } from '@titanstate/persist';

// Request file handle from user
const handle = await window.showDirectoryPicker();

const driver = new FileSystemDriver({
  directory: handle,
});

const store = createStore({
  persistenceDriver: driver,
});`}
      </CodeBlock>

      <h2>Remote Driver</h2>

      <p>
        HTTP/S3 remote storage. Sync data with a server or cloud storage.
      </p>

      <CodeBlock language="typescript">
{`import { RemoteDriver } from '@titanstate/persist';

const driver = new RemoteDriver({
  baseUrl: 'https://api.example.com/storage',
  headers: {
    'Authorization': 'Bearer token',
  },
});

const store = createStore({
  persistenceDriver: driver,
});`}
      </CodeBlock>

      <h3>RemoteDriver Options</h3>
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
            <td><code>baseUrl</code></td>
            <td><code>string</code></td>
            <td>Base URL for API</td>
          </tr>
          <tr>
            <td><code>headers</code></td>
            <td><code>Record&lt;string, string&gt;</code></td>
            <td>HTTP headers</td>
          </tr>
          <tr>
            <td><code>getUrl</code></td>
            <td><code>(key: string) => string</code></td>
            <td>Custom URL builder</td>
          </tr>
        </tbody>
      </table>

      <h2>Custom Driver</h2>

      <p>
        Implement the <code>Driver</code> interface to create custom storage drivers.
      </p>

      <CodeBlock language="typescript">
{`import type { Driver } from '@titanstate/persist';

class CustomDriver implements Driver {
  async put(key: string, value: unknown): Promise<void> {
    // Store value
  }
  
  async get(key: string): Promise<unknown | null> {
    // Retrieve value
  }
  
  async delete(key: string): Promise<void> {
    // Delete value
  }
  
  async has(key: string): Promise<boolean> {
    // Check if key exists
  }
  
  async keys(prefix?: string): Promise<string[]> {
    // List keys
  }
  
  async clear(): Promise<void> {
    // Clear all data
  }
}`}
      </CodeBlock>

      <h2>Choosing a Driver</h2>

      <ul>
        <li><strong>MemoryDriver</strong> - Testing, temporary data</li>
        <li><strong>IndexedDBDriver</strong> - Most web applications</li>
        <li><strong>FileSystemDriver</strong> - User-controlled file storage</li>
        <li><strong>RemoteDriver</strong> - Server sync, cloud storage</li>
      </ul>
    </>
  );
}

