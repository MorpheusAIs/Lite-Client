import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import { mainConfig, mainDevConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'mor-submod',
    extraResource: ['./src/executables/'],
    icon: 'logo_white',
  },
  hooks: {
    postPackage: async (_, { platform, outputPaths }) => {
      const platformFile =
        platform === 'darwin'
          ? 'ollama-darwin'
          : platform === 'win32'
            ? 'ollama.exe'
            : 'ollama-linux';

      const outputResourceFolder = `${outputPaths[0]}${platform === 'darwin' ? '/mor-submod.app/Contents' : ''}/resources/executables/`;

      fs.readdir(outputResourceFolder, (err, files) => {
        if (err) {
          throw err;
        }

        files.forEach((file) => {
          const localPath = path.join(outputResourceFolder, file);

          if (file !== platformFile) {
            fs.unlinkSync(localPath);
          } else {
            platform !== 'win32' ? exec(`chmod +x ${localPath}`) : fs.chmodSync(localPath, 755);
          }
        });
      });
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
    new MakerDMG({
      name: 'morpheus',

      background: 'src/assets/dmg-background.png',
      format: 'ULFO',
      icon: 'src/assets/src/frontend/assets/images/MOR_logo-sq.icnslogo_white.png',
      overwrite: true,
      contents: [
        {
          x: 410,
          y: 220,
          type: 'link',
          path: '/Applications',
        },
        {
          x: 130,
          y: 220,
          type: 'file',
          path: '/path/to/file',
        },
      ],
//      identity: process.env.APPLE_DEVELOPER_ID,
    }),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig: process.env.NODE_ENV === 'development' ? mainDevConfig : mainConfig,
      devContentSecurityPolicy:
        "connect-src 'self' unsafe-inline ws://localhost:* https://metamask-sdk-socket.metafi.codefi.network wss://metamask-sdk-socket.metafi.codefi.network data:",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/backend/index.html',
            js: './src/backend/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/backend/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
