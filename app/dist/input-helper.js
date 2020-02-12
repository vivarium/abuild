"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const userHelper = __importStar(require("./user-helper"));
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
    return conf;
}
exports.getConf = getConf;
function getEnv() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            userHelper.getUser()
                .then(user => {
                const env = {};
                env.alpine = core.getInput('alpine');
                env.buildFile = core.getInput('buildFile');
                env.keyName = core.getInput('keyName');
                const github = github_helper_1.getGitHub();
                const data = path.join('.', 'data');
                const repository = path.join(github.home, 'repository', env.alpine);
                env.inputDir = data;
                env.outputDir = repository;
                env.workspace = path.join(github.workspace, core.getInput('workspace'));
                env.user = user;
                return env;
            })
                .then((env) => {
                resolve(env);
            });
        });
    });
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
