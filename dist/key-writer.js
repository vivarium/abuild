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
function writeKey(key, keyPath) {
    keyPath = path.join(keyPath, key.name);
    core.debug(`Write key to ${keyPath}`);
    fs.writeFileSync(keyPath, key.content);
}
exports.writeKey = writeKey;
function writePrivKeyConf(key, keyPath) {
    const confPath = path.join(keyPath, 'abuild.conf');
    keyPath = path.join(keyPath, key.name);
    if (!fs.existsSync(keyPath)) {
        throw new Error(`Private key at ${keyPath} missing`);
    }
    const confData = `PACKAGER_PRIVKEY="${keyPath}"`;
    fs.writeFileSync(confPath, confData);
}
exports.writePrivKeyConf = writePrivKeyConf;
