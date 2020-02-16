import * as Path from 'path';
import * as FileSystem from 'fs';
import * as Core from '@actions/core';

import { KeyPair } from './KeyPair';
import { User } from './User';
import { Hierarchy } from '../Hierarchy';

export class Environment {
    private _alpine: string;
    private _workdir: string;
    private _user: User;
    private _keyPair: KeyPair;

    public static async fromAction(): Promise<Environment> {
        const [user, keyPair] = await Promise.all([
            User.fromSystem(),
            KeyPair.fromAction()
        ]);

        const alpine = Core.getInput('alpine');
        const workdir = Core.getInput('workdir');

        return new Environment(alpine, workdir, user, keyPair);
    }

    public constructor(
        alpine: string,
        cwdir: string,
        user: User,
        keyPair: KeyPair
    ) {
        this._alpine = alpine;
        this._workdir = cwdir;
        this._user = user;
        this._keyPair = keyPair;
    }

    public async write(hierarchy: Hierarchy): Promise<void> {
        await this.log(hierarchy);

        const data = await this.read(hierarchy);

        const env = Path.join(hierarchy.root(), '.env');

        FileSystem.writeFile(env, data, error => {
            if (error) {
                throw error;
            }
        });

        await this._keyPair.write(hierarchy);
    }

    public alpine(): string {
        return this._alpine;
    }

    private async read(hierarchy: Hierarchy): Promise<string> {
        const env = Path.join(hierarchy.skel(), 'env.in');

        let data = FileSystem.readFileSync(env, 'utf8');

        data = data.replace('%ALPINE_VERSION%', this._alpine);
        data = data.replace('%UID%', this._user.uid().toString());
        data = data.replace('%GID%', this._user.gid().toString());
        data = data.replace('%KEY_NAME%', this._keyPair.keyName());
        data = data.replace('%REPOSITORY%', hierarchy.repository());
        data = data.replace('%WORKSPACE%', hierarchy.workspace());
        data = data.replace('%WORKDIR%', this._workdir);

        return data;
    }

    private async log(hierarchy: Hierarchy): Promise<void> {
        Core.startGroup('.env file configuration');

        Core.info('.env will be written with the following settings.');

        Core.info(`ALPINE_VERSION: ${this._alpine}`);
        Core.info(`UID:            ${this._user.uid()}`);
        Core.info(`GID:            ${this._user.gid()}`);
        Core.info(`KEY_NAME:       ${this._keyPair.keyName()}`);
        Core.info(`REPOSITORY:     ${hierarchy.repository()}`);
        Core.info(`WORKSPACE:      ${hierarchy.workspace()}`);
        Core.info(
            `WORKDIR:        ${Path.join(
                hierarchy.repository(),
                this._workdir
            )}`
        );

        Core.endGroup();
    }
}
