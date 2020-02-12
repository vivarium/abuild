import * as path from 'path';

import * as core from '@actions/core';

import { IAbuildConf, IEnvironment } from './conf-writer';
import { IKey } from './key-writer';
import { getGitHub } from './github-helper';

export function getConf(): IAbuildConf {
    const conf = ({} as unknown) as IAbuildConf;

    conf.cflags = core.getInput('cflags');
    conf.cxxflags = core.getInput('cxxflags');
    conf.cppflags = core.getInput('cppflags');
    conf.ldflags = core.getInput('ldflags');

    validateFlags('cflags', conf.cflags);
    validateFlags('cxxflags', conf.cxxflags);
    validateFlags('cppflags', conf.cppflags);
    validateFlags('ldflags', conf.ldflags);

    conf.packager = core.getInput('packager');
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

    conf.prefix = core.getInput('prefix');

    return conf;
}

export function getEnv(): IEnvironment {
    const env = ({} as unknown) as IEnvironment;

    env.alpine = core.getInput('alpine');
    env.buildFile = core.getInput('buildFile');
    env.keyName = core.getInput('keyName');

    const github = getGitHub();
    const data = path.resolve(path.join('.', 'data'));
    const repository = path.join(github.home, 'repository');

    env.inputDir = data;
    env.outputDir = repository;
    env.workspace = path.join(github.workspace, core.getInput('workspace'));

    return env;
}

export function getPrivKey(): IKey {
    const key = ({} as unknown) as IKey;

    key.name = core.getInput('keyName');
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

function validateFlags(name: string, flags: string): void {
    if (flags.length > 0) {
        const list = flags.split(' ');
        list.forEach(element => {
            if (!element.startsWith('-')) {
                throw new Error(
                    `${name.toUpperCase()} contains invalid flags: ${element}`
                );
            }
        });
    }
}
