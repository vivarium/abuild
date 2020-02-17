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
const Process = __importStar(require("process"));
const FileSystem = __importStar(require("fs"));
const IO = __importStar(require("@actions/io"));
class Hierarchy {
    constructor(root, workspace) {
        this._root = root;
        this._workspace = workspace;
    }
    static fromAction() {
        return __awaiter(this, void 0, void 0, function* () {
            let githubWorkspace = Process.env['GITHUB_WORKSPACE'];
            if (!githubWorkspace) {
                throw new Error('GITHUB_WORKSPACE not defined');
            }
            githubWorkspace = Path.resolve(githubWorkspace);
            const root = Path.resolve(Path.join(__dirname, '..', '..'));
            return new Hierarchy(root, githubWorkspace);
        });
    }
    root() {
        return this._root;
    }
    workspace() {
        return this._workspace;
    }
    data() {
        return this.getPath('data');
    }
    keys() {
        return this.getPath('data/keys');
    }
    skel() {
        const skel = Path.join(this.root(), 'skel');
        if (!FileSystem.existsSync(skel)) {
            throw new Error('Skel directory is not present.');
        }
        return skel;
    }
    cache() {
        let cacheRoot = Process.env['RUNNER_TOOL_CACHE'];
        if (cacheRoot) {
            cacheRoot = Path.join(cacheRoot, 'abuild');
        }
        else {
            cacheRoot = Path.join(this.baseLocation(), 'actions', 'cache', 'abuild');
        }
        return this.getPath(cacheRoot);
    }
    repository() {
        return this.getPath('repository');
    }
    getPath(dir) {
        const path = Path.join(this.root(), dir);
        if (!FileSystem.existsSync(path)) {
            IO.mkdirP(path);
        }
        return path;
    }
    baseLocation() {
        if (Process.platform == 'win32') {
            return process.env['USERPROFILE'] || 'C:\\';
        }
        if (Process.platform == 'darwin') {
            return '/Users';
        }
        return '/home';
    }
}
exports.Hierarchy = Hierarchy;
//# sourceMappingURL=Hierarchy.js.map