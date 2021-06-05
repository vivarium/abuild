"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEvent = exports.getSupportedEvents = exports.resolvePath = exports.logWarning = exports.getCacheState = exports.setOutputAndState = exports.setCacheHitOutput = exports.setCacheState = exports.isExactKeyMatch = exports.getArchiveFileSize = exports.createTempDirectory = void 0;
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const uuidV4 = __importStar(require("uuid/v4"));
const Constants_1 = require("./Constants");
function createTempDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        const IS_WINDOWS = process.platform === 'win32';
        let tempDirectory = process.env['RUNNER_TEMP'] || '';
        if (!tempDirectory) {
            let baseLocation;
            if (IS_WINDOWS) {
                baseLocation = process.env['USERPROFILE'] || 'C:\\';
            }
            else {
                if (process.platform === 'darwin') {
                    baseLocation = '/Users';
                }
                else {
                    baseLocation = '/home';
                }
            }
            tempDirectory = path.join(baseLocation, 'actions', 'temp');
        }
        const dest = path.join(tempDirectory, uuidV4.default());
        yield io.mkdirP(dest);
        return dest;
    });
}
exports.createTempDirectory = createTempDirectory;
function getArchiveFileSize(path) {
    return fs.statSync(path).size;
}
exports.getArchiveFileSize = getArchiveFileSize;
function isExactKeyMatch(key, cacheResult) {
    return !!(cacheResult &&
        cacheResult.cacheKey &&
        cacheResult.cacheKey.localeCompare(key, undefined, {
            sensitivity: 'accent'
        }) === 0);
}
exports.isExactKeyMatch = isExactKeyMatch;
function setCacheState(state) {
    core.saveState(Constants_1.State.CacheResult, JSON.stringify(state));
}
exports.setCacheState = setCacheState;
function setCacheHitOutput(isCacheHit) {
    core.setOutput(Constants_1.Outputs.CacheHit, isCacheHit.toString());
}
exports.setCacheHitOutput = setCacheHitOutput;
function setOutputAndState(key, cacheResult) {
    setCacheHitOutput(isExactKeyMatch(key, cacheResult));
    cacheResult && setCacheState(cacheResult);
}
exports.setOutputAndState = setOutputAndState;
function getCacheState() {
    const stateData = core.getState(Constants_1.State.CacheResult);
    core.debug(`State: ${stateData}`);
    if (stateData) {
        return JSON.parse(stateData);
    }
    return undefined;
}
exports.getCacheState = getCacheState;
function logWarning(message) {
    const warningPrefix = '[warning]';
    core.info(`${warningPrefix}${message}`);
}
exports.logWarning = logWarning;
function resolvePath(filePath) {
    if (filePath[0] === '~') {
        const home = os.homedir();
        if (!home) {
            throw new Error('Unable to resolve `~` to HOME');
        }
        return path.join(home, filePath.slice(1));
    }
    return path.resolve(filePath);
}
exports.resolvePath = resolvePath;
function getSupportedEvents() {
    return [Constants_1.Events.Push, Constants_1.Events.PullRequest];
}
exports.getSupportedEvents = getSupportedEvents;
function isValidEvent() {
    const githubEvent = process.env[Constants_1.Events.Key] || '';
    return getSupportedEvents().includes(githubEvent);
}
exports.isValidEvent = isValidEvent;
//# sourceMappingURL=ActionUtils.js.map