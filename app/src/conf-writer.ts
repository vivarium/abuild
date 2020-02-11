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
    prefix: string;
}

export interface IEnvironment {
    alpine: string;
    keyName: string;
    buildFile: string;
    inputDir: string;
    outputDir: string;
    workspace: string;
}

export function writeConf(
    conf: IAbuildConf,
    skelPath: string,
    confPath: string
) {
    skelPath = path.join(skelPath, 'abuild.conf');
    confPath = path.join(confPath, 'abuild.conf');

    logConf(conf, confPath);

    let data = fs.readFileSync(skelPath, 'utf8');

    data = data.replace('%CFLAGS%', conf.cflags);
    data = data.replace('%CXXFLAGS%', conf.cxxflags);
    data = data.replace('%CPPFLAGS%', conf.cppflags);
    data = data.replace('%LDFLAGS%', conf.ldflags);
    data = data.replace('%JOBS%', conf.jobs.toString());
    data = data.replace('%PACKAGER%', conf.packager);
    data = data.replace('%MAINTAINER%', conf.maintainer);
    data = data.replace('%PREFIX%', conf.prefix);

    fs.writeFileSync(confPath, data);
}

export function writeEnv(env: IEnvironment, skelPath: string, envPath: string) {
    skelPath = path.join(skelPath, '.env');
    envPath = path.join(envPath, '.env');

    logEnv(env, envPath);

    let data = fs.readFileSync(skelPath, 'utf8');

    data = data.replace('%ALPINE_VERSION%', env.alpine);
    data = data.replace('%KEY_NAME%', env.keyName);
    data = data.replace('%BUILD_FILE%', env.buildFile);
    data = data.replace('%INPUT_DIR%', env.inputDir);
    data = data.replace('%OUTPUT_DIR%', env.outputDir);
    data = data.replace('%WORKSPACE%', env.workspace);

    fs.writeFileSync(envPath, data);
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
    core.debug(`Prefix:     ${conf.prefix}`);
}

function logEnv(env: IEnvironment, envPath: string): void {
    core.debug('.env will be written with the following settings.');

    core.debug(`Path:       ${envPath}`);

    core.debug(`ALPINE_VERSION: ${env.alpine}`);
    core.debug(`KEY_NAME:       ${env.keyName}`);
    core.debug(`BUILD_FILE:     ${env.buildFile}`);
    core.debug(`INPUT_DIR:      ${env.inputDir}`);
    core.debug(`OUTPUT_DIR:     ${env.outputDir}`);
    core.debug(`WORKSPACE:      ${env.workspace}`);
}
