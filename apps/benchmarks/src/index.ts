/**
 * Benchmark runner entry point
 */

import { runAllBenchmarks, formatResultsAsTable, formatResultsAsJSON } from './harness.js';

async function main() {
  try {
    const results = await runAllBenchmarks();
    
    // Output results
    console.log(formatResultsAsTable(results));
    
    // Optionally output as JSON
    if (process.env.OUTPUT_JSON === 'true') {
      console.log('\nJSON Output:');
      console.log(formatResultsAsJSON(results));
    }
  } catch (error) {
    console.error('Benchmark failed:', error);
    process.exit(1);
  }
}

main();

