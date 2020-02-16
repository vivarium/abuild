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
const Path = __importStar(require("path"));
class GitHub {
    constructor(home, workspace) {
        this._home = home;
        this._workspace = workspace;
    }
    static fromSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            let githubHome = process.env['HOME'];
            if (!githubHome) {
                throw new Error('HOME not defined');
            }
            let githubWorkspace = process.env['GITHUB_WORKSPACE'];
            if (!githubWorkspace) {
                throw new Error('GITHUB_WORKSPACE not defined');
            }
            githubHome = Path.resolve(githubHome);
            githubWorkspace = Path.resolve(githubWorkspace);
            return new GitHub(githubHome, githubWorkspace);
        });
    }
    home() {
        return this._home;
    }
    workspace() {
        return this._workspace;
    }
}
exports.GitHub = GitHub;
//# sourceMappingURL=GitHub.js.map