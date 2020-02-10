import * as path from 'path'

import core from '@actions/core'
import exec from '@actions/exec'

export interface IPackage {
    path: string;
    name: string;
}

export function build(alpinePackage:IPackage): void {

    const alpinePackagePath = path.join(alpinePackage.path, alpinePackage.name); 

    core.debug(`Build ${alpinePackage.name}`);

    exec.exec(`cd ${alpinePackagePath}`);
    exec.exec('abuild -F checksum');
    exec.exec('abuild -rF');
}
