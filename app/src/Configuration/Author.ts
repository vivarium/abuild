import * as Core from '@actions/core';

export class Author {
    private _packager: string;

    private _maintainer: string;

    public static async fromAction(): Promise<Author> {
        const packager = Core.getInput('packager');
        const maintainer = Core.getInput('maintainer');

        return new Author(packager, maintainer);
    }

    public constructor(packager: string, maintainer: string) {
        this._packager = packager;
        this._maintainer = maintainer;
    }

    public packager(): string {
        return this._packager;
    }

    public maintainer(): string {
        return this._maintainer.length == 0 ? this._packager : this._maintainer;
    }
}
