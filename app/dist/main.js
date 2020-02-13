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
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
const coreCommand = __importStar(require("@actions/core/lib/command"));
const inputHelper = __importStar(require("./input-helper"));
const confWriter = __importStar(require("./conf-writer"));
const keysWriter = __importStar(require("./key-writer"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            coreCommand.issueCommand('add-matcher', {}, path.join(__dirname, 'problem-abuild.json'));
            coreCommand.issueCommand('add-matcher', {}, path.join(__dirname, 'problem-permission-denied.json'));
            const here = path.resolve(path.join(__dirname, '..', '..'));
            const skel = path.join(here, 'skel');
            const data = path.join(here, 'data');
            const keys = path.join(data, 'keys');
            const conf = inputHelper.getConf();
            const privKey = inputHelper.getPrivKey();
            const pubKey = inputHelper.getPubKey();
            inputHelper
                .getEnv()
                .then(env => {
                Promise.all([
                    io.mkdirP(env.inputDir),
                    io.mkdirP(env.outputDir),
                    io.mkdirP(keys)
                ]).then(() => {
                    confWriter.writeConf(conf, skel, data);
                    confWriter.writeEnv(env, skel, here);
                    keysWriter.writeKey(pubKey, keys);
                    keysWriter.writeKey(privKey, keys);
                    core.setOutput('repository', env.outputDir);
                });
            })
                .then(() => {
                return exec.exec('docker-compose', ['build'], {
                    cwd: here
                });
            })
                .then(() => {
                return exec.exec('docker-compose', [
                    'up',
                    '--abort-on-container-exit',
                    '--exit-code-from=abuild'
                ], {
                    cwd: here
                });
            })
                .then(() => {
                exec.exec('docker-compose', ['down'], {
                    cwd: here
                });
            })
                .catch(error => {
                core.setFailed(error.message);
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
