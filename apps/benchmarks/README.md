# TitanState Benchmarks

Performance benchmark suite for TitanState.

## Benchmarks

1. **Micro Updates** - 1M small atom updates per second
2. **Large Table** - 10k-item table CRUD with lazy hydration
3. **Hydration** - 100MB dataset hydration & query latency
4. **Worker Throughput** - Worker reducer performance
5. **Time-Travel** - Time-travel reconstruction cost

## Running Benchmarks

```bash
# From root
pnpm benchmark

# Or from benchmarks directory
cd apps/benchmarks
pnpm build
pnpm benchmark
```

## Output

Benchmarks output results in both table and JSON format (if `OUTPUT_JSON=true`).

