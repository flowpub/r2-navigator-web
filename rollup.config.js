import string from 'rollup-plugin-string';
import typescript2 from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const pkg = require('./package.json');

export default {
  input: './src/index.ts',
  preserveSymlinks: true,
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'umd',
      name: 'readiumNg',
      sourcemap: true,
      globals: {
        '@evidentpoint/readium-shared-js': 'readiumSharedJs',
        '@evidentpoint/r2-shared-js': 'r2SharedJs'
      }
    }
  ],
  external: [
    '@evidentpoint/readium-shared-js',
    '@evidentpoint/r2-shared-js',
    'readium-cfi-js',
    'eventemitter3',
    'jquery'
  ],
  plugins: [
    string({
			include: './node_modules/r2-glue-js/dist/ReadiumGlue-payload.js',
		}),
    resolve(),
    commonjs(),
    typescript2(),
  ]
};