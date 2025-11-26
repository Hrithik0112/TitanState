import React, { useEffect, useState } from 'react';
import { createStore } from '@titanstate/core';

// Create a store instance
const store = createStore();

// Create atoms
const counterAtom = store.createAtom('counter', 0);
const nameAtom = store.createAtom('name', 'World');
const todosAtom = store.createAtom('todos', [
  { id: 1, text: 'Learn TitanState', completed: false },
  { id: 2, text: 'Build amazing apps', completed: false },
]);

export default function BasicExample() {
  const [counter, setCounter] = useState(store.get(counterAtom) ?? 0);
  const [name, setName] = useState(store.get(nameAtom) ?? 'World');
  const [todos, setTodos] = useState(store.get(todosAtom) ?? []);

  useEffect(() => {
    // Subscribe to atom changes
    const unsubscribeCounter = store.subscribe(counterAtom, (value) => {
      setCounter(value);
    });

    const unsubscribeName = store.subscribe(nameAtom, (value) => {
      setName(value);
    });

    const unsubscribeTodos = store.subscribe(todosAtom, (value) => {
      setTodos(value);
    });

    return () => {
      unsubscribeCounter();
      unsubscribeName();
      unsubscribeTodos();
    };
  }, []);

  const increment = () => {
    const current = store.get(counterAtom) ?? 0;
    store.set(counterAtom, current + 1);
  };

  const decrement = () => {
    const current = store.get(counterAtom) ?? 0;
    store.set(counterAtom, current - 1);
  };

  const updateName = (newName: string) => {
    store.set(nameAtom, newName);
  };

  const toggleTodo = (id: number) => {
    const currentTodos = store.get(todosAtom) ?? [];
    const updated = currentTodos.map((todo: { id: number; text: string; completed: boolean }) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    store.set(todosAtom, updated);
  };

  const addTodo = () => {
    const text = prompt('Enter todo text:');
    if (text) {
      const currentTodos = store.get(todosAtom) ?? [];
      const newId = Math.max(...currentTodos.map((t: { id: number }) => t.id), 0) + 1;
      store.set(todosAtom, [...currentTodos, { id: newId, text, completed: false }]);
    }
  };

  return (
    <div className="example-container">
      <h2>Basic Atom Usage</h2>
      <p>
        This example demonstrates basic atom creation, reading, and writing.
        Atoms are the fundamental unit of state in TitanState.
      </p>

      <div className="example-section">
        <h3>Counter Atom</h3>
        <p>Current value: <code>{counter}</code></p>
        <button onClick={decrement}>-</button>
        <button onClick={increment}>+</button>
      </div>

      <div className="example-section">
        <h3>Name Atom</h3>
        <p>Hello, <code>{name}</code>!</p>
        <input
          type="text"
          value={name}
          onChange={(e) => updateName(e.target.value)}
          placeholder="Enter name"
        />
      </div>

      <div className="example-section">
        <h3>Todos Atom</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo: { id: number; text: string; completed: boolean }) => (
            <li key={todo.id} style={{ marginBottom: '0.5rem' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <div className="example-section">
        <h3>Code Example</h3>
        <pre>
          <code>{`// Create a store
const store = createStore();

// Create atoms
const counterAtom = store.createAtom('counter', 0);
const nameAtom = store.createAtom('name', 'World');

// Read value
const value = store.get(counterAtom);

// Write value
store.set(counterAtom, value + 1);

// Subscribe to changes
const unsubscribe = store.subscribe(counterAtom, (newValue) => {
  console.log('Counter changed:', newValue);
});`}</code>
        </pre>
      </div>
    </div>
  );
}

