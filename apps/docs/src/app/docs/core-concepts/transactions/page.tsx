import { CodeBlock } from '@/components/CodeBlock';

export default function Transactions() {
  return (
    <div className="prose prose-lg max-w-none">
      <h1>Transactions</h1>
      
      <p>
        Transactions allow you to group multiple atom updates together. All updates within
        a transaction are batched, and subscribers are only notified once after all updates
        complete.
      </p>

      <h2>Basic Transaction</h2>

      <CodeBlock language="typescript">
{`import { createStore } from '@titanstate/core';

const store = createStore();
const firstNameAtom = store.createAtom('firstName', '');
const lastNameAtom = store.createAtom('lastName', '');

// Update multiple atoms in a transaction
await store.transaction(async () => {
  store.set(firstNameAtom, 'John');
  store.set(lastNameAtom, 'Doe');
  // Subscribers are notified once after both updates
});`}
      </CodeBlock>

      <h2>Async Operations</h2>

      <p>
        Transactions support async operations, making them perfect for complex updates that
        involve API calls or other async work.
      </p>

      <CodeBlock language="typescript">
{`await store.transaction(async () => {
  // Fetch data
  const user = await fetchUser();
  
  // Update multiple atoms
  store.set(userAtom, user);
  store.set(loadingAtom, false);
  store.set(errorAtom, null);
  
  // All updates batched together
});`}
      </CodeBlock>

      <h2>Nested Transactions</h2>

      <p>
        Transactions can be nested. Inner transactions are part of the outer transaction.
      </p>

      <CodeBlock language="typescript">
{`await store.transaction(async () => {
  store.set(atom1, value1);
  
  // Nested transaction
  await store.transaction(async () => {
    store.set(atom2, value2);
    store.set(atom3, value3);
  });
  
  store.set(atom4, value4);
  // All updates (atom1-4) are batched together
});`}
      </CodeBlock>

      <h2>Error Handling</h2>

      <p>
        If an error occurs in a transaction, all updates are still applied. Use try-catch
        to handle errors appropriately.
      </p>

      <CodeBlock language="typescript">
{`try {
  await store.transaction(async () => {
    store.set(atom1, value1);
    await someAsyncOperation();
    store.set(atom2, value2);
  });
} catch (error) {
  // Handle error
  // Note: atom1 update is still applied
}`}
      </CodeBlock>

      <h2>When to Use Transactions</h2>

      <ul>
        <li><strong>Multiple related updates</strong> - Update several atoms together</li>
        <li><strong>Complex state changes</strong> - Group related state changes</li>
        <li><strong>Performance</strong> - Reduce the number of re-renders</li>
        <li><strong>Atomicity</strong> - Ensure related updates happen together</li>
      </ul>

      <h2>DevTools Integration</h2>

      <p>
        Transactions are automatically logged to DevTools (if enabled), showing transaction
        start, duration, and all updates within the transaction.
      </p>

      <h2>Example: Form Submission</h2>

      <CodeBlock language="typescript">
{`async function submitForm(formData: FormData) {
  await store.transaction(async () => {
    // Set loading state
    store.set(loadingAtom, true);
    store.set(errorAtom, null);
    
    try {
      // Submit form
      const result = await api.submitForm(formData);
      
      // Update state
      store.set(formDataAtom, result);
      store.set(successAtom, true);
    } catch (error) {
      store.set(errorAtom, error.message);
    } finally {
      store.set(loadingAtom, false);
    }
  });
}`}
      </CodeBlock>
    </div>
  );
}

