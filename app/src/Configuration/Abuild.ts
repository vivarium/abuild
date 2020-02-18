import * as Path from 'path';
import * as FileSystem from 'fs';
import * as Core from '@actions/core';

import { Compiler } from './Compiler';
import { Author } from './Author';
import { Hierarchy } from '../Hierarchy';

export class Abuild {
    private _compiler: Compiler;
    private _author: Author;

    public static async fromAction(): Promise<Abuild> {
        const [compiler, author] = await Promise.all([
            Compiler.fromAction(),
            Author.fromAction()
        ]);

        return new Abuild(compiler, author);
    }

    public constructor(compiler: Compiler, author: Author) {
        this._compiler = compiler;
        this._author = author;
    }

    public async write(hierarchy: Hierarchy): Promise<void> {
        await this.log();
        const data = await this.read(hierarchy.skel());
        const abuild = Path.join(hierarchy.data(), 'abuild.conf');
        FileSystem.writeFileSync(abuild, data);
    }

    private async read(skelPath: string): Promise<string> {
        const abuild = Path.join(skelPath, 'abuild.conf.in');

        let data = FileSystem.readFileSync(abuild, 'utf8');

        data = data.replace('%CFLAGS%', this._compiler.cflags());
        data = data.replace('%CXXFLAGS%', this._compiler.cxxflags());
        data = data.replace('%CPPFLAGS%', this._compiler.cppflags());
        data = data.replace('%LDFLAGS%', this._compiler.ldflags());
        data = data.replace('%JOBS%', this._compiler.jobs().toString());
        data = data.replace('%PACKAGER%', this._author.packager());
        data = data.replace('%MAINTAINER%', this._author.maintainer());

        return data;
    }

    private async log(): Promise<void> {
        Core.startGroup('abuild.conf file configuration');

        Core.info('Abuild.conf will be written with the following settings.');

        Core.info(`CFLAGS:     ${this._compiler.cflags()}`);
        Core.info(`CXXFLAGS:   ${this._compiler.cxxflags()}`);
        Core.info(`CPPFLAGS:   ${this._compiler.cppflags()}`);
        Core.info(`LDFLAGS:    ${this._compiler.ldflags()}`);
        Core.info(`Jobs:       ${this._compiler.jobs()}`);
        Core.info(`Packager:   ${this._author.packager()}`);
        Core.info(`Maintainer: ${this._author.maintainer()}`);

        Core.endGroup();
    }
}
