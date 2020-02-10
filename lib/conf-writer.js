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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core_1 = __importDefault(require("@actions/core"));
function writeConf(conf, confPath) {
    return __awaiter(this, void 0, void 0, function* () {
        confPath = path.join(confPath, 'abuild.conf');
        logConf(conf, confPath);
        fs.readFile(confPath, 'utf8', (error, data) => {
            if (error) {
                throw error;
            }
            data = data.replace('%CFLAGS%', conf.cflags);
            data = data.replace('%CXXFLAGS%', conf.cxxflags);
            data = data.replace('%CPPFLAGS%', conf.cppflags);
            data = data.replace('%LDFLAGS%', conf.ldflags);
            data = data.replace('%JOBS%', conf.jobs.toString());
            data = data.replace('%PACKAGER%', conf.packager);
            data = data.replace('%MAINTAINER%', conf.maintainer);
            data = data.replace('%VERSION%', conf.version);
            fs.writeFile(confPath, data, (error) => {
                if (error) {
                    throw error;
                }
            });
        });
    });
}
exports.writeConf = writeConf;
function logConf(conf, confPath) {
    core_1.default.debug('Abuild configuration will be written with the following settings.');
    core_1.default.debug(`Path:       ${confPath}`);
    core_1.default.debug(`CFLAGS:     ${conf.cflags}`);
    core_1.default.debug(`CXXFLAGS:   ${conf.cxxflags}`);
    core_1.default.debug(`CPPFLAGS:   ${conf.cppflags}`);
    core_1.default.debug(`LDFLAGS:    ${conf.ldflags}`);
    core_1.default.debug(`Jobs:       ${conf.jobs}`);
    core_1.default.debug(`Packager:   ${conf.packager}`);
    core_1.default.debug(`Maintainer: ${conf.maintainer}`);
    core_1.default.debug(`Version:    ${conf.version}`);
}
