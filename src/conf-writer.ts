import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

export interface IAbuildConf {
  cflags: string;
  cxxflags: string;
  cppflags: string;
  ldflags: string;
  jobs: number;
  packager: string;
  maintainer: string;
  version: string;
}

export function writeConf(conf: IAbuildConf, confPath: string) {
  confPath = path.join(confPath, 'abuild.conf');

  logConf(conf, confPath);

  let data = fs.readFileSync(confPath, 'utf8');

  data = data.replace('%CFLAGS%', conf.cflags);
  data = data.replace('%CXXFLAGS%', conf.cxxflags);
  data = data.replace('%CPPFLAGS%', conf.cppflags);
  data = data.replace('%LDFLAGS%', conf.ldflags);
  data = data.replace('%JOBS%', conf.jobs.toString());
  data = data.replace('%PACKAGER%', conf.packager);
  data = data.replace('%MAINTAINER%', conf.maintainer);
  data = data.replace('%VERSION%', conf.version);

  fs.writeFileSync(confPath, data);
}

function logConf(conf: IAbuildConf, confPath: string): void {
  core.debug(
    'Abuild configuration will be written with the following settings.'
  );

  core.debug(`Path:       ${confPath}`);

  core.debug(`CFLAGS:     ${conf.cflags}`);
  core.debug(`CXXFLAGS:   ${conf.cxxflags}`);
  core.debug(`CPPFLAGS:   ${conf.cppflags}`);
  core.debug(`LDFLAGS:    ${conf.ldflags}`);
  core.debug(`Jobs:       ${conf.jobs}`);
  core.debug(`Packager:   ${conf.packager}`);
  core.debug(`Maintainer: ${conf.maintainer}`);
  core.debug(`Version:    ${conf.version}`);
}
