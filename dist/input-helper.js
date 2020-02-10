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
const util_1 = require("util");
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
    conf.version = core.getInput('version');
    return conf;
}
exports.getConf = getConf;
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
function getPackages(basePath) {
    let packages = [];
    const buildFile = path.join(basePath, core.getInput('buildFile'));
    core.debug(`Read packages from: ${buildFile}`);
    let data = fs.readFileSync(buildFile, 'utf8');
    const buildContent = JSON.parse(data);
    if (!util_1.isArray(buildContent)) {
        throw new Error('Build file content must be a JSON array');
    }
    buildContent.forEach(alpinePackage => {
        let _package = {};
        _package.path = path.join(basePath, alpinePackage);
        _package.name = _package.path.substring(_package.path.lastIndexOf('/') + 1, _package.path.length);
        packages.push(_package);
    });
    if (packages.length == 0) {
        core.warning('Nothing to build.');
    }
    else {
        core.debug(`Found ${packages.length} packages.`);
    }
    return packages;
}
exports.getPackages = getPackages;
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
