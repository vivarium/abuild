import * as process from 'process';

import * as core from '@actions/core';
import * as exec from '@actions/exec';

export interface IPackage {
  path: string;
  name: string;
}

export async function build(alpinePackage: IPackage) {
  core.debug(`Build ${alpinePackage.name}`);

  process.chdir(alpinePackage.path);

  await exec.exec('abuild -F checksum');
  await exec.exec('abuild -rF');
}
