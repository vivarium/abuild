import * as Core from '@actions/core';

import { Key } from './Key';
import { Hierarchy } from '../Hierarchy';

export class KeyPair {
    private _keyName;

    private _pubKey: Key;

    private _privKey: Key;

    public static async fromAction(): Promise<KeyPair> {
        const keyName = Core.getInput('keyName');

        const privKey = Core.getInput('privKey');
        if (privKey.length == 0) {
            throw new Error('Private key is empty!');
        }

        const pubKey = Core.getInput('pubKey');
        if (pubKey.length == 0) {
            throw new Error('Public key is empty!');
        }

        return new KeyPair(
            keyName,
            new Key(keyName, privKey),
            new Key(`${keyName}.pub`, pubKey)
        );
    }

    private constructor(keyName: string, pubKey: Key, privKey: Key) {
        this._keyName = keyName;
        this._pubKey = pubKey;
        this._privKey = privKey;
    }

    public async write(hierarchy: Hierarchy): Promise<void> {
        await Promise.all([
            this._privKey.write(await hierarchy.keys()),
            this._pubKey.write(await hierarchy.keys())
        ]);
    }

    public keyName(): string {
        return this._keyName;
    }
}
