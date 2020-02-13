import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import { IUser } from './user-helper';

export interface IAbuildConf {
    cflags: string;
    cxxflags: string;
    cppflags: string;
    ldflags: string;
    jobs: number;
    packager: string;
    maintainer: string;
}

export interface IEnvironment {
    alpine: string;
    keyName: string;
    buildFile: string;
    inputDir: string;
    outputDir: string;
    workspace: string;
    user: IUser;
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

    let prefix = core.getInput('alpine');
    if (prefix != 'edge') {
        prefix = `v${prefix}`;
    }

    data = data.replace('%PREFIX%', prefix);

    fs.writeFileSync(confPath, data);
}

export function writeEnv(env: IEnvironment, skelPath: string, envPath: string) {
    skelPath = path.join(skelPath, '.env');
    envPath = path.join(envPath, '.env');

    logEnv(env, envPath);

    let data = fs.readFileSync(skelPath, 'utf8');

    data = data.replace('%ALPINE_VERSION%', env.alpine);
    data = data.replace('%UID%', env.user.uid);
    data = data.replace('%GID%', env.user.gid);
    data = data.replace('%KEY_NAME%', env.keyName);
    data = data.replace('%BUILD_FILE%', env.buildFile);
    data = data.replace('%INPUT_DIR%', env.inputDir);
    data = data.replace('%OUTPUT_DIR%', env.outputDir);
    data = data.replace('%WORKSPACE%', env.workspace);

    fs.writeFileSync(envPath, data);
}

function logConf(conf: IAbuildConf, confPath: string): void {
    core.startGroup('abuild.conf file configuration');

    core.info(
        'Abuild configuration will be written with the following settings.'
    );

    core.info(`Path:       ${confPath}`);

    core.info(`CFLAGS:     ${conf.cflags}`);
    core.info(`CXXFLAGS:   ${conf.cxxflags}`);
    core.info(`CPPFLAGS:   ${conf.cppflags}`);
    core.info(`LDFLAGS:    ${conf.ldflags}`);
    core.info(`Jobs:       ${conf.jobs}`);
    core.info(`Packager:   ${conf.packager}`);
    core.info(`Maintainer: ${conf.maintainer}`);

    core.endGroup();
}

function logEnv(env: IEnvironment, envPath: string): void {
    core.startGroup('.env file configuration');

    core.info('.env will be written with the following settings.');

    core.info(`Path:           ${envPath}`);

    core.info(`ALPINE_VERSION: ${env.alpine}`);
    core.info(`UID:            ${env.user.uid}`);
    core.info(`GID:            ${env.user.gid}`);
    core.info(`KEY_NAME:       ${env.keyName}`);
    core.info(`BUILD_FILE:     ${env.buildFile}`);
    core.info(`INPUT_DIR:      ${path.resolve(env.inputDir)}`);
    core.info(`OUTPUT_DIR:     ${env.outputDir}`);
    core.info(`WORKSPACE:      ${env.workspace}`);

    core.endGroup();
}
