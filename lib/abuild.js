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
const path = __importStar(require("path"));
const core_1 = __importDefault(require("@actions/core"));
const exec_1 = __importDefault(require("@actions/exec"));
function build(alpinePackage) {
    const alpinePackagePath = path.join(alpinePackage.path, alpinePackage.name);
    core_1.default.debug(`Build ${alpinePackage.name}`);
    exec_1.default.exec(`cd ${alpinePackagePath}`);
    exec_1.default.exec('abuild -F checksum');
    exec_1.default.exec('abuild -rF');
}
exports.build = build;
