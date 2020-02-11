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
function getGitHub() {
    let github = {};
    let githubHome = process.env['HOME'];
    if (!githubHome) {
        throw new Error('HOME not defined');
    }
    let githubWorkspace = process.env['GITHUB_WORKSPACE'];
    if (!githubWorkspace) {
        throw new Error('GITHUB_WORKSPACE not defined');
    }
    github.home = path.resolve(githubHome);
    github.workspace = path.resolve(githubWorkspace);
    return github;
}
exports.getGitHub = getGitHub;
