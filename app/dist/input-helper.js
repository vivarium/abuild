"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const core = __importStar(require("@actions/core"));
const github_helper_1 = require("./github-helper");
function getConf() {
    const conf = {};
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
exports.getConf = getConf;
function getEnv() {
    const env = {};
    env.alpine = core.getInput('alpine');
    env.buildFile = core.getInput('buildFile');
    env.keyName = core.getInput('keyName');
    const github = github_helper_1.getGitHub();
    const data = path.join('.', 'data');
    const repository = path.join(github.home, 'repository');
    env.inputDir = data;
    env.outputDir = repository;
    env.workspace = github.workspace;
    return env;
}
exports.getEnv = getEnv;
function getPrivKey() {
    const key = {};
    key.name = core.getInput('keyName');
    key.content = core.getInput('privKey');
    if (key.name.includes('/')) {
        throw new Error('Key name contains invalid character /');
    }
    return key;
}
exports.getPrivKey = getPrivKey;
function getPubKey() {
    const key = {};
    key.name = core.getInput('keyName') + '.pub';
    key.content = core.getInput('pubKey');
    if (key.name.includes('/')) {
        throw new Error('Key name contains invalid character /');
    }
    return key;
}
exports.getPubKey = getPubKey;
function validateFlags(name, flags) {
    if (flags.length > 0) {
        const list = flags.split(' ');
        list.forEach(element => {
            if (!element.startsWith('-')) {
                throw new Error(`${name.toUpperCase()} contains invalid flags: ${element}`);
            }
        });
    }
}
