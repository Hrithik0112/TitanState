import { CodeBlock } from '@/components/CodeBlock';

export default function MigrationRTK() {
  return (
    <>
      <h1>Migration from Redux Toolkit</h1>
      
      <p>
        TitanState is designed to be familiar to Redux Toolkit users while providing
        better performance and scalability. This guide helps you migrate your RTK code.
      </p>

      <h2>Key Differences</h2>

      <table>
        <thead>
          <tr>
            <th>Redux Toolkit</th>
            <th>TitanState</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>createSlice</code></td>
            <td><code>createAtom</code> or <code>createSlice</code></td>
          </tr>
          <tr>
            <td><code>useSelector</code></td>
            <td><code>useAtom</code> or <code>useSelector</code></td>
          </tr>
          <tr>
            <td><code>useDispatch</code></td>
            <td><code>useSetAtom</code> or <code>useDispatch</code></td>
          </tr>
          <tr>
            <td>Store configuration</td>
            <td>Store with optional persistence/workers</td>
          </tr>
        </tbody>
      </table>

      <h2>Basic Migration</h2>

      <h3>Redux Toolkit</h3>

      <CodeBlock language="typescript">
{`// Redux Toolkit
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});`}
      </CodeBlock>

      <h3>TitanState</h3>

      <CodeBlock language="typescript">
{`// TitanState
import { createStore } from '@titanstate/core';

const store = createStore();

const counterAtom = store.createAtom('counter', 0);

// Or use slice for RTK compatibility
import { createSlice } from '@titanstate/core';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});`}
      </CodeBlock>

      <h2>React Integration</h2>

      <h3>Redux Toolkit</h3>

      <CodeBlock language="tsx">
{`// Redux Toolkit
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(counterSlice.actions.increment())}>
        Increment
      </button>
    </>
  );
}`}
      </CodeBlock>

      <h3>TitanState</h3>

      <CodeBlock language="tsx">
{`// TitanState
import { useAtom } from '@titanstate/react';

function Counter() {
  const [count, setCount] = useAtom(counterAtom);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  );
}`}
      </CodeBlock>

      <h2>Benefits of Migration</h2>

      <ul>
        <li>Better performance with large datasets</li>
        <li>Automatic persistence and lazy loading</li>
        <li>Web Worker support for heavy computations</li>
        <li>Time-travel debugging</li>
        <li>Smaller bundle size for simple use cases</li>
      </ul>
    </>
  );
}

