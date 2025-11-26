import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const plugins = [
  nodeResolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    declarationMap: false,
  }),
];

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins,
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    external,
    plugins,
  },
  // Worker entry bundle (for web workers)
  {
    input: 'src/worker-entry.ts',
    output: {
      file: './dist/worker-entry.js',
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins,
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'es',
    },
    external,
    plugins: [dts()],
  },
];

