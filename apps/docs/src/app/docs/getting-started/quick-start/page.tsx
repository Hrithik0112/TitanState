import { CodeBlock } from '@/components/CodeBlock';

export default function QuickStart() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Quick Start</h1>
      
      <p>
        Get up and running with TitanState in minutes. This guide will walk you through
        creating your first store and using it in a React component.
      </p>

      <h2>Step 1: Install</h2>

      <CodeBlock language="bash">
{`npm install @titanstate/core @titanstate/react`}
      </CodeBlock>

      <h2>Step 2: Create a Store</h2>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';

const store = createStore();`}
      </CodeBlock>

      <h2>Step 3: Create Atoms</h2>

      <CodeBlock language="typescript">
{`// Create atoms for your state
const countAtom = store.createAtom('count', 0);
const nameAtom = store.createAtom('name', 'World');`}
      </CodeBlock>

      <h2>Step 4: Use in React</h2>

      <CodeBlock language="tsx">
{`import { StoreProvider, useAtom } from '@titanstate/react';

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

function App() {
  return (
    <StoreProvider store={store}>
      <Counter />
    </StoreProvider>
  );
}`}
      </CodeBlock>

      <h2>Complete Example</h2>

      <CodeBlock language="tsx" filename="App.tsx">
{`import { createStore } from '@titanstate/core';
import { StoreProvider, useAtom } from '@titanstate/react';

// Create store
const store = createStore();

// Create atoms
const todosAtom = store.createAtom('todos', [
  { id: 1, text: 'Learn TitanState', completed: false },
]);

function TodoList() {
  const [todos, setTodos] = useAtom(todosAtom);
  
  const addTodo = () => {
    const text = prompt('Enter todo:');
    if (text) {
      setTodos([...todos, {
        id: Date.now(),
        text,
        completed: false,
      }]);
    }
  };
  
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <div>
      <h2>Todos</h2>
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span style={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}>
                {todo.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider store={store}>
      <TodoList />
    </StoreProvider>
  );
}`}
      </CodeBlock>

      <h2>What's Next?</h2>

      <ul>
        <li><a href="/docs/core-concepts/atoms">Learn more about Atoms</a></li>
        <li><a href="/docs/react/hooks">Explore React Hooks</a></li>
        <li><a href="/docs/persistence/overview">Add Persistence</a></li>
        <li><a href="/docs/examples">View More Examples</a></li>
      </ul>
    </div>
  );
}

