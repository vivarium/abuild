import * as fs from 'fs';
import * as path from 'path';

import * as core from '@actions/core';

export interface IKey {
  name: string;
  content: string;
}

export function writeKey(key: IKey, keyPath: string) {
  keyPath = path.join(keyPath, key.name);

  core.debug(`Write key to ${keyPath}`);

  fs.writeFile(keyPath, key.content, error => {
    if (error) {
      throw error;
    }
  });
}

export function writePrivKeyConf(key: IKey, keyPath: string) {
  const confPath = path.join(keyPath, 'abuild.conf');
  keyPath = path.join(keyPath, key.name);

  if (!fs.existsSync(keyPath)) {
    throw new Error(`Private key at ${keyPath} missing`);
  }

  const confData = `PACKAGER_PRIVKEY="${keyPath}"`;

  fs.writeFileSync(confPath, confData);
}
