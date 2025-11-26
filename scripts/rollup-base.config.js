/**
 * Base Rollup configuration for TitanState packages
 */
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { dts } from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

export function createRollupConfig(pkgPath, options = {}) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  
  const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...(options.additionalExternal || []),
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

  const configs = [
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
  ];

  // Add UMD build if specified
  if (options.umd) {
    configs.push({
      input: 'src/index.ts',
      output: {
        file: pkg.browser || './dist/index.umd.js',
        format: 'umd',
        name: options.umdName || 'TitanState',
        sourcemap: true,
        globals: options.globals || {},
      },
      external,
      plugins,
    });
  }

  // Type definitions
  configs.push({
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'es',
    },
    external,
    plugins: [dts()],
  });

  return configs;
}

