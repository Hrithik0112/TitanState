import { CodeBlock } from '@/components/CodeBlock';

export default function TimeTravel() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>Time-Travel Debugging</h1>
      
      <p>
        Time-travel debugging allows you to jump to any point in your application's state
        history. This is powered by event-based logging and lazy state reconstruction.
      </p>

      <h2>How It Works</h2>

      <p>
        Instead of storing full state snapshots, TitanState stores events. When you time-travel
        to a specific point, the state is reconstructed from events up to that point.
      </p>

      <CodeBlock language="typescript">
{`// Events are logged automatically
store.set(countAtom, 1); // Event 1
store.set(countAtom, 2); // Event 2
store.set(countAtom, 3); // Event 3

// Time-travel to event 2
const stateAtEvent2 = await reconstructor.getStateAt(2);`}
      </CodeBlock>

      <h2>Using Time-Travel</h2>

      <CodeBlock language="typescript">
{`import { StateReconstructor } from '@titanstate/devtools';

const reconstructor = new StateReconstructor(eventLog, store);

// Get state at specific sequence number
const state = await reconstructor.getStateAt(seq);

// Get state with specific atoms
const state = await reconstructor.reconstruct({
  targetSeq: seq,
  atomKeys: [atom1.key, atom2.key],
  includeState: true,
});`}
      </CodeBlock>

      <h2>Browser Extension</h2>

      <p>
        The DevTools extension provides a visual interface for time-travel:
      </p>

      <ul>
        <li>View event timeline</li>
        <li>Click any event to jump to that point</li>
        <li>See state at that moment</li>
        <li>Step forward/backward through events</li>
      </ul>

      <h2>Performance</h2>

      <p>
        State reconstruction is optimized:
      </p>

      <ul>
        <li>Lazy reconstruction - only reconstructs requested atoms</li>
        <li>Caching - reconstructed states are cached</li>
        <li>Snapshots - periodic snapshots speed up reconstruction</li>
      </ul>
    </div>
  );
}

