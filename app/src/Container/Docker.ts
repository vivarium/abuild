import * as Exec from '@actions/exec';
import * as Core from '@actions/core';
import { Container } from '../Container';
import { Hierarchy } from '../Hierarchy';

export class Docker extends Container {
    private _isBuilt: boolean;

    private _hierarchy: Hierarchy;

    public constructor(name: string, hierarchy: Hierarchy) {
        super(name);

        this._isBuilt = false;
        this._hierarchy = hierarchy;
    }

    public async build(): Promise<void> {
        if (!this._isBuilt) {
            Core.debug(this._hierarchy.root());

            await Exec.exec('docker-compose', ['build', this.name()], {
                cwd: this._hierarchy.root()
            });

            this._isBuilt = true;
        }
    }

    public async start(): Promise<void> {
        await this.build();

        await Exec.exec('docker-compose', ['up'], {
            cwd: this._hierarchy.root()
        });
    }

    public async destroy(): Promise<void> {
        if (this._isBuilt) {
            await Exec.exec('docker-compose', ['down'], {
                cwd: this._hierarchy.root()
            });
        }
    }
}
