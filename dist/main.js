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
const path = __importStar(require("path"));
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const githubHelper = __importStar(require("./github-helper"));
const inputHelper = __importStar(require("./input-helper"));
const confWriter = __importStar(require("./conf-writer"));
const keysWriter = __importStar(require("./key-writer"));
const abuild = __importStar(require("./abuild"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const github = githubHelper.getGitHub();
            const etc = '/etc';
            const keys = path.join(etc, 'apk', 'keys');
            const _abuild = path.join(github.home, '.abuild');
            io.mkdirP(_abuild);
            const conf = inputHelper.getConf();
            const privKey = inputHelper.getPrivKey();
            const pubKey = inputHelper.getPubKey();
            confWriter.writeConf(conf, etc);
            keysWriter.writeKey(pubKey, keys);
            keysWriter.writeKey(privKey, _abuild);
            keysWriter.writePrivKeyConf(privKey, _abuild);
            const packages = inputHelper.getPackages(github.workspace);
            for (let i = 0; i < packages.length; i++) {
                yield abuild.build(packages[i]);
            }
            const output = path.join(github.workspace, 'packages', conf.version);
            core.setOutput('repoDir', output);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
