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

    fs.writeFileSync(keyPath, key.content);
}
