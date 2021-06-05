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
exports.Hierarchy = void 0;
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
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPath('data');
        });
    }
    keys() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPath('data/keys');
        });
    }
    skel() {
        const skel = Path.join(this.root(), 'skel');
        if (!FileSystem.existsSync(skel)) {
            throw new Error('Skel directory is not present.');
        }
        return skel;
    }
    cache(version) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheRoot = Process.env['RUNNER_TOOL_CACHE'];
            if (!cacheRoot) {
                throw new Error('RUNNER_TOOL_CACHE not exists');
            }
            cacheRoot = Path.join(cacheRoot, 'abuild', version);
            if (!FileSystem.existsSync(cacheRoot)) {
                yield IO.mkdirP(cacheRoot);
            }
            return cacheRoot;
        });
    }
    repository() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getPath('repository');
        });
    }
    getPath(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = Path.join(this.root(), dir);
            if (!FileSystem.existsSync(path)) {
                yield IO.mkdirP(path);
            }
            return path;
        });
    }
}
exports.Hierarchy = Hierarchy;
//# sourceMappingURL=Hierarchy.js.map