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
const path = __importStar(require("path"));
const process = __importStar(require("process"));
const core_1 = __importDefault(require("@actions/core"));
const io_1 = __importDefault(require("@actions/io"));
const inputHelper = __importStar(require("./input-helper"));
const confWriter = __importStar(require("./conf-writer"));
const keysWriter = __importStar(require("./key-writer"));
const abuild = __importStar(require("./abuild"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let githubHome = process.env['HOME'];
            if (!githubHome) {
                throw new Error('HOME not defined');
            }
            let githubWorkspace = process.env['GITHUB_WORKSPACE'];
            if (!githubWorkspace) {
                throw new Error('GITHUB_WORKSPACE not defined');
            }
            githubHome = path.resolve(githubHome);
            githubWorkspace = path.resolve(githubWorkspace);
            const etc = '/etc';
            const keys = path.join(etc, 'apk', 'keys');
            const _abuild = path.join(githubHome, '.abuild');
            io_1.default.mkdirP(_abuild);
            const conf = inputHelper.getConf();
            const privKey = inputHelper.getPrivKey();
            const pubKey = inputHelper.getPubKey();
            confWriter.writeConf(conf, etc);
            keysWriter.writeKey(pubKey, keys);
            keysWriter.writeKey(privKey, _abuild);
            keysWriter.writePrivKeyConf(privKey, _abuild);
            const packages = inputHelper.getPackages(githubWorkspace);
            packages.forEach((_package) => {
                abuild.build(_package);
            });
            const output = path.join(githubWorkspace, 'packages', conf.version);
            core_1.default.setOutput('repoDir', output);
        }
        catch (error) {
            core_1.default.setFailed(error.message);
        }
    });
}
run();
