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

    public data(): string {
        return this.getPath('data');
    }

    public keys(): string {
        return this.getPath('data/keys');
    }

    public skel(): string {
        const skel = Path.join(this.root(), 'skel');
        if (!FileSystem.existsSync(skel)) {
            throw new Error('Skel directory is not present.');
        }

        return skel;
    }

    public cache(): string {
        let cacheRoot = Process.env['RUNNER_TOOL_CACHE'];
        if (cacheRoot) {
            cacheRoot = Path.join(cacheRoot, 'abuild');
        } else {
            cacheRoot = Path.join(
                this.baseLocation(),
                'actions',
                'cache',
                'abuild'
            );
        }

        return this.getPath(cacheRoot);
    }

    public repository(): string {
        return this.getPath('repository');
    }

    private getPath(dir: string): string {
        const path = Path.join(this.root(), dir);
        if (!FileSystem.existsSync(path)) {
            IO.mkdirP(path);
        }

        return path;
    }

    private baseLocation(): string {
        if (Process.platform == 'win32') {
            return process.env['USERPROFILE'] || 'C:\\';
        }

        if (Process.platform == 'darwin') {
            return '/Users';
        }

        return '/home';
    }
}
