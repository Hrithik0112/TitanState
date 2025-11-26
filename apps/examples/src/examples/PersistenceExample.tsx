import  { useEffect, useState } from 'react';
import { createStore } from '@titanstate/core';
import { MemoryDriver } from '@titanstate/persist';
import { DevToolsBridge } from '@titanstate/devtools';

// Create persistence driver
const memoryDriver = new MemoryDriver();
// Note: IndexedDBDriver requires browser environment
// const indexedDBDriver = new IndexedDBDriver({ dbName: 'titanstate-example' });

// Create DevTools bridge
const devtoolsBridge = new DevToolsBridge({
  enabled: true,
  eventLog: {
    maxInMemoryEvents: 1000,
    persist: false,
  },
});

// Create store with persistence and DevTools
const store = createStore({
  persistenceDriver: memoryDriver,
  devtoolsBridge: devtoolsBridge,
});

// Create persisted atoms
const settingsAtom = store.createAtom('settings', {
  theme: 'light',
  language: 'en',
  notifications: true,
}, {
  persisted: true,
  lazyLoad: false,
});

const notesAtom = store.createAtom('notes', [] as Array<{ id: number; text: string; timestamp: number }>, {
  persisted: true,
  lazyLoad: true, // Lazy load - won't load until accessed
});

export default function PersistenceExample() {
  const [settings, setSettings] = useState(store.get(settingsAtom) ?? { theme: 'light', language: 'en', notifications: true });
  const [notes, setNotes] = useState(store.get(notesAtom) ?? []);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(!notesAtom.options.lazyLoad || notesAtom.meta.hydrated);

  useEffect(() => {
    const unsubscribeSettings = store.subscribe(settingsAtom, (value) => {
      setSettings(value);
    });

    const unsubscribeNotes = store.subscribe(notesAtom, (value) => {
      setNotes(value);
      setHydrated(true);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeNotes();
    };
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      // This will trigger lazy hydration
      const loadedNotes = await store.getAsync(notesAtom);
      setNotes(loadedNotes);
      setHydrated(true);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = () => {
    const text = prompt('Enter note:');
    if (text) {
      const currentNotes = store.get(notesAtom) ?? [];
      const newNote = {
        id: Date.now(),
        text,
        timestamp: Date.now(),
      };
      store.set(notesAtom, [...currentNotes, newNote]);
    }
  };

  const deleteNote = (id: number) => {
    const currentNotes = store.get(notesAtom) ?? [];
    store.set(notesAtom, currentNotes.filter((note: { id: number }) => note.id !== id));
  };

  const updateSettings = (key: string, value: unknown) => {
    store.set(settingsAtom, { ...settings, [key]: value });
  };

  return (
    <div className="example-container">
      <h2>Persistence & Lazy Loading</h2>
      <p>
        This example demonstrates automatic persistence and lazy loading.
        Settings are persisted immediately, while notes are lazy-loaded on demand.
      </p>

      <div className="example-section">
        <h3>Settings (Eagerly Loaded)</h3>
        <p>These settings are automatically persisted and loaded on initialization.</p>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Theme:
            <select
              value={settings.theme}
              onChange={(e) => updateSettings('theme', e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Language:
            <select
              value={settings.language}
              onChange={(e) => updateSettings('language', e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSettings('notifications', e.target.checked)}
            />
            Enable Notifications
          </label>
        </div>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Current settings: <code>{JSON.stringify(settings)}</code>
        </p>
      </div>

      <div className="example-section">
        <h3>Notes (Lazy Loaded)</h3>
        <p>
          Notes are lazy-loaded - they won't be loaded from storage until you click "Load Notes".
          This is useful for large datasets that aren't needed immediately.
        </p>
        {!hydrated && (
          <div>
            <p style={{ color: '#666', fontStyle: 'italic' }}>Notes not loaded yet. Click below to load.</p>
            <button onClick={loadNotes} disabled={loading}>
              {loading ? 'Loading...' : 'Load Notes'}
            </button>
          </div>
        )}
        {hydrated && (
          <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {notes.map((note: { id: number; text: string; timestamp: number }) => (
                <li key={note.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#fff', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{note.text}</span>
                  <button onClick={() => deleteNote(note.id)} style={{ background: '#dc3545' }}>Delete</button>
                </li>
              ))}
            </ul>
            <button onClick={addNote}>Add Note</button>
          </div>
        )}
      </div>

      <div className="example-section">
        <h3>Code Example</h3>
        <pre>
          <code>{`import { createStore } from '@titanstate/core';
import { IndexedDBDriver } from '@titanstate/persist';
import { DevToolsBridge } from '@titanstate/devtools';

// Create drivers
const driver = new IndexedDBDriver({ dbName: 'myapp' });
const devtools = new DevToolsBridge({ enabled: true });

// Create store with integrations
const store = createStore({
  persistenceDriver: driver,
  devtoolsBridge: devtools,
});

// Create persisted atom (eager load)
const settingsAtom = store.createAtom('settings', {}, {
  persisted: true,
  lazyLoad: false, // Load immediately
});

// Create lazy-loaded atom
const largeDataAtom = store.createAtom('largeData', [], {
  persisted: true,
  lazyLoad: true, // Load only when accessed
});

// Auto-persists on set()
store.set(settingsAtom, { theme: 'dark' });

// Auto-hydrates on getAsync() if lazy
const data = await store.getAsync(largeDataAtom);`}</code>
        </pre>
      </div>
    </div>
  );
}

