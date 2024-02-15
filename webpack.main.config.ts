/* eslint-disable import/default */
/* eslint-disable @typescript-eslint/no-var-requires */
import type { Configuration } from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
const WebpackPermissionsPlugin = require('webpack-permissions-plugin');
import path from 'path';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const devPlugins = [
  ...plugins,
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.join(__dirname, 'src/executables'), to: path.join(__dirname, '.webpack/executables'),
        force: true
      }
    ],
  }),
  new WebpackPermissionsPlugin({
    buildFolders: [
      {
        path: path.resolve(__dirname, '.webpack/executables'),
        fileMode: '755',
        dirMode: '644'
      }
    ],
    buildFiles: [
      { path: path.resolve(__dirname, '.webpack/executables/ollama.exe'), fileMode: '755' },
      { path: path.resolve(__dirname, '.webpack/executables/ollama-darwin'), fileMode: '755' },
      { path: path.resolve(__dirname, '.webpack/executables/ollama-linux'), fileMode: '755' },
    ]
  })
];

export const mainConfig: Configuration = {
  entry: './src/backend/index.ts',
  module: {
    rules,
  },
  plugins: [...plugins],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};

export const mainDevConfig: Configuration = {
  mode: 'development',
  entry: './src/backend/index.ts',
  module: {
    rules,
  },
  plugins: [...devPlugins],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
