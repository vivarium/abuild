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
    data = data.replace('%PREFIX%', conf.prefix);
    fs.writeFileSync(confPath, data);
}
exports.writeConf = writeConf;
function writeEnv(env, skelPath, envPath) {
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
exports.writeEnv = writeEnv;
function logConf(conf, confPath) {
    core.debug('Abuild configuration will be written with the following settings.');
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
function logEnv(env, envPath) {
    core.debug('.env will be written with the following settings.');
    core.debug(`Path:       ${envPath}`);
    core.debug(`ALPINE_VERSION: ${env.alpine}`);
    core.debug(`KEY_NAME:       ${env.keyName}`);
    core.debug(`BUILD_FILE:     ${env.buildFile}`);
    core.debug(`INPUT_DIR:      ${env.inputDir}`);
    core.debug(`OUTPUT_DIR:     ${env.outputDir}`);
    core.debug(`WORKSPACE:      ${env.workspace}`);
}
