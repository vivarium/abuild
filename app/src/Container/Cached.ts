import * as Path from 'path';
import * as OS from 'os';

import * as Exec from '@actions/exec';
import * as Core from '@actions/core';

import { Container } from '../Container';
import { ImageCache } from '../Cache/ImageCache';

export class Cached extends Container {
    private _container: Container;

    private _cache: ImageCache;

    private _version: string;

    public constructor(
        container: Container,
        cache: ImageCache,
        alpine: string
    ) {
        super(container.name());

        this._container = container;
        this._cache = cache;
        this._version = alpine;
    }

    public async build(): Promise<void> {
        try {
            const cache = await this._cache.restore(this._version);

            if (cache.length > 0) {
                Core.info(
                    `Cache hit! Found ${this.name()} version ${this._version}`
                );
                await Exec.exec('docker', ['image', 'load', '-i', cache]);
            }
        } catch (error) {
            Core.error(error.message);
            Core.error('Cannot load cache');
        } finally {
            await this._container.build();
        }
    }

    public async start(): Promise<void> {
        await this.build();
        await this._container.start();
    }

    public async destroy(): Promise<void> {
        try {
            const history = await this.history();
            const tmp = Path.join(OS.tmpdir(), `${this._version}.tar`);

            await Exec.exec('docker', [
                'image',
                'save',
                `${this.name()}:${this._version}`,
                ...history,
                '-o',
                tmp
            ]);

            await this._cache.save(tmp, this._version);
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
