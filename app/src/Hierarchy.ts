import * as Path from 'path';
import * as Process from 'process';
import * as FileSystem from 'fs';

import * as IO from '@actions/io';

export class Hierarchy {
    private _root: string;

    private _workspace;

    public static async fromAction(): Promise<Hierarchy> {
        let githubWorkspace = Process.env['GITHUB_WORKSPACE'];
        if (!githubWorkspace) {
            throw new Error('GITHUB_WORKSPACE not defined');
        }

        githubWorkspace = Path.resolve(githubWorkspace);

        const root = Path.resolve(Path.join(__dirname, '..', '..'));

        return new Hierarchy(root, githubWorkspace);
    }

    public constructor(root: string, workspace: string) {
        this._root = root;
        this._workspace = workspace;
    }

    public root(): string {
        return this._root;
    }

    public workspace(): string {
        return this._workspace;
    }

    public async data(): Promise<string> {
        return this.getPath('data');
    }

    public async keys(): Promise<string> {
        return this.getPath('data/keys');
    }

    public skel(): string {
        const skel = Path.join(this.root(), 'skel');
        if (!FileSystem.existsSync(skel)) {
            throw new Error('Skel directory is not present.');
        }

        return skel;
    }

    public async cache(version: string): Promise<string> {
        let cacheRoot = Process.env['RUNNER_TOOL_CACHE'];
        if (!cacheRoot) {
            throw new Error('RUNNER_TOOL_CACHE not exists');
        }

        cacheRoot = Path.join(cacheRoot, 'abuild', version);

        if (!FileSystem.existsSync(cacheRoot)) {
            await IO.mkdirP(cacheRoot);
        }

        return cacheRoot;
    }

    public async repository(): Promise<string> {
        return await this.getPath('repository');
    }

    private async getPath(dir: string): Promise<string> {
        const path = Path.join(this.root(), dir);
        if (!FileSystem.existsSync(path)) {
            await IO.mkdirP(path);
        }

        return path;
    }
}
