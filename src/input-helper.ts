import * as fs from 'fs';
import * as path from 'path';

import * as core from '@actions/core';

import {IAbuildConf} from './conf-writer';
import {IKey} from './key-writer';
import {IPackage} from './abuild';
import {isArray} from 'util';

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

export function getPackages(basePath: string): IPackage[] {
  let packages: Array<IPackage> = [];

  const buildFile = path.join(basePath, core.getInput('buildFile'));

  core.debug(`Read packages from: ${buildFile}`);

  let data = fs.readFileSync(buildFile, 'utf8');

  const buildContent = JSON.parse(data);
  if (!isArray(buildContent)) {
    throw new Error('Build file content must be a JSON array');
  }

  buildContent.forEach(alpinePackage => {
    let _package = ({} as unknown) as IPackage;
    _package.path = path.join(basePath, alpinePackage);
    _package.name = _package.path.substring(
      _package.path.lastIndexOf('/') + 1,
      _package.path.length
    );

    packages.push(_package);
  });

  if (packages.length == 0) {
    core.warning('Nothing to build.');
  } else {
    core.debug(`Found ${packages.length} packages.`);
  }

  return packages;
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
