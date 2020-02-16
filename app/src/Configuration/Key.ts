import * as FileSystem from 'fs';
import * as Path from 'path';
import * as Core from '@actions/core';

export class Key {
    private _name: string;

    private _content: string;

    public constructor(name: string, content: string) {
        if (name.includes('/')) {
            throw new Error('Key name contains invalid character /');
        }

        this._name = name;
        this._content = content;
    }

    public async write(destPath: string): Promise<void> {
        if (!FileSystem.statSync(destPath).isDirectory()) {
            throw new Error('path must be a directory');
        }

        const file = Path.join(destPath, this._name);

        Core.info(`Writing key ${this._name} to ${destPath}`);

        FileSystem.writeFile(file, this._content, error => {
            if (error) {
                throw error;
            }
        });
    }
}
