/**
 * DevTools panel UI
 */

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { DevToolsEvent, DevToolsMessage } from '@titanstate/devtools';

interface AppState {
  events: DevToolsEvent[];
  selectedEvent: DevToolsEvent | null;
  timeTravelSeq: number | null;
}

function DevToolsPanel() {
  const [state, setState] = useState<AppState>({
    events: [],
    selectedEvent: null,
    timeTravelSeq: null,
  });

  useEffect(() => {
    // Listen for messages from content script
    const handleMessage = (message: DevToolsMessage) => {
      if (message.type === 'event' && message.payload) {
        const event = message.payload as DevToolsEvent;
        setState(prev => ({
          ...prev,
          events: [...prev.events, event],
        }));
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Request initial state
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'get-state',
          source: 'titanstate-devtools-extension',
        });
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const handleTimeTravel = (seq: number) => {
    setState(prev => ({ ...prev, timeTravelSeq: seq }));
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'time-travel',
          payload: { seq },
          source: 'titanstate-devtools-extension',
        });
      }
    });
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui' }}>
      <h1>TitanState DevTools</h1>
      
      <div style={{ display: 'flex', gap: '1rem', height: '600px' }}>
        {/* Events List */}
        <div style={{ flex: 1, border: '1px solid #ccc', overflow: 'auto' }}>
          <h2>Events ({state.events.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {state.events.map((event) => (
              <div
                key={event.seq}
                onClick={() => setState(prev => ({ ...prev, selectedEvent: event }))}
                style={{
                  padding: '0.5rem',
                  background: state.selectedEvent?.seq === event.seq ? '#e3f2fd' : '#f5f5f5',
                  cursor: 'pointer',
                  border: '1px solid #ddd',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{event.type}</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  Seq: {event.seq} | {new Date(event.ts).toLocaleTimeString()}
                </div>
                {event.target && (
                  <div style={{ fontSize: '0.8em', color: '#666' }}>
                    Target: {String(event.target)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Event Details */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', overflow: 'auto' }}>
          <h2>Event Details</h2>
          {state.selectedEvent ? (
            <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
              {JSON.stringify(state.selectedEvent, null, 2)}
            </pre>
          ) : (
            <p>Select an event to view details</p>
          )}
        </div>
      </div>

      {/* Time Travel Controls */}
      <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Time Travel</h3>
        <input
          type="number"
          value={state.timeTravelSeq ?? ''}
          onChange={(e) => setState(prev => ({ ...prev, timeTravelSeq: Number.parseInt(e.target.value, 10) || null }))}
          placeholder="Sequence number"
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <button
          onClick={() => state.timeTravelSeq !== null && handleTimeTravel(state.timeTravelSeq)}
          disabled={state.timeTravelSeq === null}
        >
          Travel to Event
        </button>
      </div>
    </div>
  );
}

// Initialize DevTools panel
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DevToolsPanel />);
}

