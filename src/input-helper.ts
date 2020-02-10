import * as fs from 'fs'
import * as path from 'path'

import core from '@actions/core'

import { IAbuildConf } from './conf-writer'
import { IKey } from './key-writer'
import { IPackage } from './abuild'
import { isArray } from 'util'

export function getConf(): IAbuildConf {

    const conf = ({} as unknown) as IAbuildConf;

    conf.cflags   = core.getInput('cflags');
    conf.cxxflags = core.getInput('cxxflags');
    conf.cppflags = core.getInput('cppflags');
    conf.ldflags  = core.getInput('ldflags');

    validateFlags('cflags', conf.cflags);
    validateFlags('cxxflags', conf.cxxflags);
    validateFlags('cppflags', conf.cppflags);
    validateFlags('ldflags', conf.ldflags);

    conf.packager   = core.getInput('packager');
    conf.maintainer = core.getInput('maintainer');

    if (conf.maintainer.length == 0) {
        conf.maintainer = conf.packager;
    }

    conf.jobs = Number(core.getInput('jobs'));
    if (isNaN(conf.jobs)) {
        throw new Error('Input variable "jobs" must be a number.');
    }

    if (conf.jobs <= 0) {
        core.warning('Number of jobs is zero or less, defaulting to 1...');
        conf.jobs = 1;
    }

    conf.version = core.getInput('version');

    return conf;
}

export function getPrivKey(): IKey {

    const key = ({} as unknown) as IKey;

    key.name = core.getInput('keyName')
    key.content = core.getInput('privKey');

    if (key.name.includes('/')) {
        throw new Error('Key name contains invalid character /');
    }

    return key;
}

export function getPubKey(): IKey {

    const key = ({} as unknown) as IKey;

    key.name = core.getInput('keyName') + '.pub';
    key.content = core.getInput('pubKey');

    if (key.name.includes('/')) {
        throw new Error('Key name contains invalid character /');
    }

    return key;
}

export function getPackages(basePath:string): IPackage[] {

    let packages:Array<IPackage> = [];
    
    const buildFile = core.getInput('buildFile');

    fs.readFile(buildFile, 'utf8', (error, data) => {
        const buildContent = JSON.parse(data);
        if (!isArray(buildContent)) {
            throw Error('Build file content must be a JSON array');
        }

        

        buildContent.forEach((alpinePackage) => {
            
            let _package = ({} as unknown) as IPackage;
            _package.path = path.join(basePath, alpinePackage);
            _package.name = _package.path.substring(
                _package.path.lastIndexOf('/'), _package.path.length
            );

            let packagePath = path.join(basePath, alpinePackage);
            packages.push(_package);
        });
    });

    return packages;
}

function validateFlags(name:string, flags:string): void {

    const list = flags.split(' ');
    list.forEach(element => {
        if (!element.startsWith('-')) {
            throw new Error(name.toUpperCase + " contains invalid flags: " + element);
        }
    });
}