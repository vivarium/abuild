"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core_1 = __importDefault(require("@actions/core"));
const util_1 = require("util");
function getConf() {
    const conf = {};
    conf.cflags = core_1.default.getInput('cflags');
    conf.cxxflags = core_1.default.getInput('cxxflags');
    conf.cppflags = core_1.default.getInput('cppflags');
    conf.ldflags = core_1.default.getInput('ldflags');
    validateFlags('cflags', conf.cflags);
    validateFlags('cxxflags', conf.cxxflags);
    validateFlags('cppflags', conf.cppflags);
    validateFlags('ldflags', conf.ldflags);
    conf.packager = core_1.default.getInput('packager');
    conf.maintainer = core_1.default.getInput('maintainer');
    if (conf.packager.length == 0) {
        conf.packager = ''; //github.context.repo.owner;
    }
    if (conf.maintainer.length == 0) {
        conf.maintainer = conf.packager;
    }
    conf.jobs = Number(core_1.default.getInput('jobs'));
    if (isNaN(conf.jobs)) {
        throw new Error('Input variable "jobs" must be a number.');
    }
    if (conf.jobs <= 0) {
        core_1.default.warning('Number of jobs is zero or less, defaulting to 1...');
        conf.jobs = 1;
    }
    conf.version = core_1.default.getInput('version');
    return conf;
}
exports.getConf = getConf;
function getPrivKey() {
    const key = {};
    key.name = core_1.default.getInput('keyName');
    key.content = core_1.default.getInput('privKey');
    if (key.name.includes('/')) {
        throw new Error('Key name contains invalid character /');
    }
    return key;
}
exports.getPrivKey = getPrivKey;
function getPubKey() {
    const key = {};
    key.name = core_1.default.getInput('keyName') + '.pub';
    key.content = core_1.default.getInput('pubKey');
    if (key.name.includes('/')) {
        throw new Error('Key name contains invalid character /');
    }
    return key;
}
exports.getPubKey = getPubKey;
function getPackages(basePath) {
    let packages = [];
    const buildFile = core_1.default.getInput('buildFile');
    fs.readFile(buildFile, 'utf8', (error, data) => {
        const buildContent = JSON.parse(data);
        if (!util_1.isArray(buildContent)) {
            throw Error('Build file content must be a JSON array');
        }
        buildContent.forEach((alpinePackage) => {
            let _package = {};
            _package.path = path.join(basePath, alpinePackage);
            _package.name = _package.path.substring(_package.path.lastIndexOf('/'), _package.path.length);
            let packagePath = path.join(basePath, alpinePackage);
            packages.push(_package);
        });
    });
    return packages;
}
exports.getPackages = getPackages;
function validateFlags(name, flags) {
    const list = flags.split(' ');
    list.forEach(element => {
        if (!element.startsWith('-')) {
            throw new Error(name.toUpperCase + " contains invalid flags: " + element);
        }
    });
}
