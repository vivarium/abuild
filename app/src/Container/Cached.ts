import * as Path from 'path';
import * as FileSystem from 'fs';

import * as Exec from '@actions/exec';
import * as Core from '@actions/core';
import * as IO from '@actions/io';

import { Container } from '../Container';
import { Hierarchy } from '../Hierarchy';

export class Cached extends Container {
    private _container: Container;

    private _version: string;

    private _image: string;

    private _cache: string;

    private _complete: string;

    public constructor(
        container: Container,
        hierarchy: Hierarchy,
        alpine: string
    ) {
        super(container.name());

        this._container = container;
        this._version = alpine;

        this._image = `${this._version}.tar`;

        const cachePath = hierarchy.cache(this._version);
        this._cache = Path.join(cachePath, this._image);
        this._complete = Path.join(cachePath, '.complete');
    }

    public async build(): Promise<void> {
        if (
            FileSystem.existsSync(this._complete) &&
            FileSystem.existsSync(this._cache)
        ) {
            Core.info(
                `Cache hit! Found ${this.name()} version ${this._version}`
            );
            await Exec.exec('docker', ['image', 'load', '-i', this._cache]);
        }

        await this._container.build();
    }

    public async start(): Promise<void> {
        await this.build();
        await this._container.start();
    }

    public async destroy(): Promise<void> {
        try {
            IO.rmRF(this._complete);

            const history = await this.history();
            await Exec.exec('docker', [
                'image',
                'save',
                `${this.name()}:${this._version}`,
                ...history,
                '-o',
                this._cache
            ]);

            FileSystem.writeFileSync(this._complete, '');

            Core.info(`Abuild image cached to ${this._cache}`);
        } catch (error) {
            Core.error(error.message);
            Core.error("Container image can't be cached");
        } finally {
            await this._container.destroy();
        }
    }

    private async history(): Promise<Array<string>> {
        let history: Array<string> = [];

        await Exec.exec(
            'docker',
            ['history', '-q', `${this.name()}:${this._version}`],
            {
                silent: true,
                listeners: {
                    stdout: buffer => {
                        history = buffer
                            .toString()
                            .trim()
                            .replace(/(\r\n|\n|\r)/gm, ' ')
                            .replace('<missing>', '')
                            .trim()
                            .split(' ');
                    }
                }
            }
        );

        return history;
    }
}
