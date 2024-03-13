import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { PublisherGithub } from '@electron-forge/publisher-github';
import fs from 'fs';
import { exec } from 'child_process';

import { mainConfig, mainDevConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    name: 'morpheus',
    extraResource: ['./executables/'],
    icon: 'src/frontend/assets/images/circle-mor-logo',
    osxSign: {
      identity: process.env.APPLE_DEVELOPER_ID,
      optionsForFile: () => {
        return {
          entitlements: './entitlements.plist',
        };
      },
    },
    ...(process.env.APPLE_ID &&
      process.env.APPLE_ID_PASSWORD &&
      process.env.APPLE_TEAM_ID && {
      osxNotarize: {
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
        teamId: process.env.APPLE_TEAM_ID,
      },
    }),
  },
  hooks: {
    prePackage: async (_, platform) => {
      const platformFile =
        platform === 'darwin'
          ? 'ollama-darwin'
          : platform === 'win32'
            ? 'ollama.exe'
            : 'ollama-linux';

      const filePath = `src/executables/${platformFile}`;

      platform !== 'win32'
        ? exec(`chmod +x ${filePath}`)
        : fs.chmodSync(filePath, 755);

      fs.mkdirSync('executables');
      fs.copyFileSync(filePath, `executables/${platformFile}`);
    },
    postPackage: async () => {
      fs.rmSync('executables', { recursive: true, force: true });
    }
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: 'src/frontend/assets/images/circle-mor-logo.ico',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({
      options: {
        icon: 'src/frontend/assets/images/MOR_logo_circle.iconset/icon_512x512.png',
        maintainer: 'Morpheus',
        homepage: 'https://www.mor.org',
        categories: ['Utility'],
      },
    }),
    new MakerDMG({
      icon: 'src/frontend/assets/images/circle-mor-logo.icns',
      format: 'ULFO',
      background: 'src/frontend/assets/images/dmgbg.svg',
      overwrite: true,
      additionalDMGOptions: {
        window: {
          size: {
            width: 600,
            height: 600,
          },
        },
      },
    }),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'MorpheusAIs',
        name: 'Node',
      },
      draft: true,
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
