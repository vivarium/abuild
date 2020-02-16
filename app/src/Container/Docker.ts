import * as Exec from '@actions/exec';
import { Container } from '../Container';

export class Docker extends Container {
    private _isBuilt: boolean;

    public constructor(name: string) {
        super(name);

        this._isBuilt = false;
    }

    public async build(): Promise<void> {
        if (!this._isBuilt) {
            await Exec.exec('docker-compose', ['build', this.name()]);

            this._isBuilt = true;
        }
    }

    public async start(): Promise<void> {
        await this.build();

        await Exec.exec('docker-compose', ['up']);
    }

    public async destroy(): Promise<void> {
        if (this._isBuilt) {
            await Exec.exec('docker-compose', ['down']);
        }
    }
}
