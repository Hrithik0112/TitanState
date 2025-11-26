import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Example imports
import BasicExample from './examples/BasicExample';
import ReactExample from './examples/ReactExample';
import PersistenceExample from './examples/PersistenceExample';
import QueryExample from './examples/QueryExample';
import WorkerExample from './examples/WorkerExample';

const examples = [
  { id: 'basic', name: 'Basic Atoms', component: BasicExample },
  { id: 'react', name: 'React Integration', component: ReactExample },
  { id: 'persistence', name: 'Persistence', component: PersistenceExample },
  { id: 'query', name: 'Query Client', component: QueryExample },
  { id: 'worker', name: 'Worker Reducers', component: WorkerExample },
];

function App() {
  const [activeExample, setActiveExample] = React.useState<string>('basic');

  const ActiveComponent = examples.find(e => e.id === activeExample)?.component || BasicExample;

  return (
    <div className="app">
      <header className="app-header">
        <h1>TitanState Examples</h1>
        <nav className="example-nav">
          {examples.map(example => (
            <button
              key={example.id}
              className={`nav-button ${activeExample === example.id ? 'active' : ''}`}
              onClick={() => setActiveExample(example.id)}
            >
              {example.name}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <ActiveComponent />
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

