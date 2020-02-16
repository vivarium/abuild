import * as Core from '@actions/core';

export class Compiler {
    private _cflags: string;
    private _cxxflags: string;
    private _cppflags: string;
    private _ldflags: string;
    private _jobs: number;

    public static async fromAction(): Promise<Compiler> {
        const cflags = Core.getInput('cflags');
        const cxxflags = Core.getInput('cxxflags');
        const cppflags = Core.getInput('cppflags');
        const ldflags = Core.getInput('ldflags');
        let jobs = Number(Core.getInput('jobs'));

        await Promise.all([
            this.validateFlags('cflags', cflags),
            this.validateFlags('cxxflags', cxxflags),
            this.validateFlags('cppflags', cppflags),
            this.validateFlags('ldflags', ldflags)
        ]);

        if (isNaN(jobs)) {
            return Promise.reject('Input variable "jobs" must be a number.');
        }

        if (jobs <= 0) {
            Core.warning('Number of jobs is zero or less, defaulting to 1...');
            jobs = 1;
        }

        return new Compiler(cflags, cxxflags, cppflags, ldflags, jobs);
    }

    private static async validateFlags(
        name: string,
        flags: String
    ): Promise<void> {
        if (flags.length == 0) {
            Core.warning(`Flag ${name.toUpperCase()} is empty`);
            return Promise.resolve();
        }

        const list = flags.split(' ');
        list.forEach(element => {
            if (!element.startsWith('-')) {
                throw new Error(
                    `${name.toUpperCase()} contains invalid flags: ${element}`
                );
            }
        });
    }

    private constructor(
        cflags: string,
        cxxflags: string,
        cppflags: string,
        ldflags: string,
        jobs: number
    ) {
        this._cflags = cflags;
        this._cxxflags = cxxflags;
        this._cppflags = cppflags;
        this._ldflags = ldflags;
        this._jobs = jobs;
    }

    public cflags(): string {
        return this._cflags;
    }

    public cxxflags(): string {
        return this._cxxflags;
    }

    public cppflags(): string {
        return this._cppflags;
    }

    public ldflags(): string {
        return this._ldflags;
    }

    public jobs(): number {
        return this._jobs;
    }
}
