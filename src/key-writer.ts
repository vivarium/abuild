import * as fs from 'fs'
import * as path from 'path'

import core from '@actions/core'

export interface IKey {
    name: string;
    content: string;
}

export async function writeKey(key:IKey, keyPath:string): Promise<void> {

    keyPath = path.join(keyPath, key.name);

    core.debug(`Write key to ${keyPath}`);

    fs.writeFile(keyPath, key.content, (error) => {
        if (error) {
            throw error;
        }
    });
}

export async function writePrivKeyConf(key:IKey, keyPath:string): Promise<void> {

    const confPath = path.join(keyPath, 'abuild.conf');
    keyPath        = path.join(keyPath, key.name);

    fs.exists(keyPath, (error) => {
        if (error) {
            throw error;
        }
    });

    const confData = `PACKAGER_PRIVKEY="${keyPath}"`;

    fs.writeFile(confPath, confData, (error) => {
        if (error) {
            throw error;
        }
    });
}