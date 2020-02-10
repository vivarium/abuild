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
function writeConf(conf, confPath) {
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
    data = data.replace('%PREFIX%', conf.prefix);
    fs.writeFileSync(confPath, data);
}
exports.writeConf = writeConf;
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
