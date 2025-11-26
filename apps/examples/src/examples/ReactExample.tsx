import { createStore } from '@titanstate/core';
import type { Atom } from '@titanstate/types';
import { StoreProvider, useAtom, useAtomValue, useSetAtom, useSelector } from '@titanstate/react';

// Create a store instance
const store = createStore();

// Create atoms
const themeAtom = store.createAtom('theme', 'light');
const userAtom = store.createAtom('user', { name: 'Guest', email: '' });
const notificationsAtom = store.createAtom('notifications', [] as string[]);

// Component using useAtom hook
function Counter() {
  const counterAtom = store.createAtom('counter', 0);
  const [count, setCount] = useAtom(counterAtom);

  return (
    <div className="example-section">
      <h3>Counter with useAtom</h3>
      <p>Count: <code>{count}</code></p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

// Component using useAtomValue (read-only)
function ThemeDisplay() {
  const theme = useAtomValue(themeAtom);

  return (
    <div className="example-section">
      <h3>Theme Display (Read-only)</h3>
      <p>Current theme: <code>{theme}</code></p>
    </div>
  );
}

// Component using useSetAtom (write-only)
function ThemeToggle() {
  const setTheme = useSetAtom(themeAtom);
  const theme = useAtomValue(themeAtom);

  const toggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="example-section">
      <h3>Theme Toggle (Write-only)</h3>
      <button onClick={toggle}>Toggle Theme</button>
    </div>
  );
}

// Component using useSelector
function UserProfile() {
  const [user, setUser] = useAtom(userAtom);
  // Example of using useSelector with type casting
  const name = useSelector([userAtom as Atom<unknown>], (values) => (values[0] as { name: string; email: string }).name);

  return (
    <div className="example-section">
      <h3>User Profile</h3>
      <p>Name: <code>{name}</code></p>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Enter name"
      />
      <input
        type="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Enter email"
      />
    </div>
  );
}

// Component with notifications
function Notifications() {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  const addNotification = () => {
    const text = prompt('Enter notification:');
    if (text) {
      setNotifications([...notifications, text]);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="example-section">
      <h3>Notifications</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map((notif, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#fff', borderRadius: '4px' }}>
            {notif}
          </li>
        ))}
      </ul>
      <button onClick={addNotification}>Add Notification</button>
      <button onClick={clearNotifications}>Clear All</button>
    </div>
  );
}

export default function ReactExample() {
  return (
    <StoreProvider store={store}>
      <div className="example-container">
        <h2>React Integration</h2>
        <p>
          This example demonstrates React hooks for TitanState:
          <code>useAtom</code>, <code>useAtomValue</code>, <code>useSetAtom</code>, and <code>useSelector</code>.
        </p>

        <Counter />
        <ThemeDisplay />
        <ThemeToggle />
        <UserProfile />
        <Notifications />

        <div className="example-section">
          <h3>Code Example</h3>
          <pre>
            <code>{`import { StoreProvider, useAtom, useAtomValue } from '@titanstate/react';

// Wrap your app
<StoreProvider store={store}>
  <App />
</StoreProvider>

// Use hooks in components
function Counter() {
  const [count, setCount] = useAtom(counterAtom);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Read-only
function Display() {
  const value = useAtomValue(atom);
  return <div>{value}</div>;
}

// Write-only
function Button() {
  const setValue = useSetAtom(atom);
  return <button onClick={() => setValue(42)}>Set</button>;
}`}</code>
          </pre>
        </div>
      </div>
    </StoreProvider>
  );
}

