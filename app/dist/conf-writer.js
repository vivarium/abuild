"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core = __importStar(require("@actions/core"));
function writeConf(conf, skelPath, confPath) {
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
exports.writeConf = writeConf;
function writeEnv(env, skelPath, envPath) {
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
exports.writeEnv = writeEnv;
function logConf(conf, confPath) {
    core.startGroup('abuild.conf file configuration');
    core.info('Abuild configuration will be written with the following settings.');
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
function logEnv(env, envPath) {
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
