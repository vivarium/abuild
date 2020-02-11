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
const inputHelper = __importStar(require("./input-helper"));
const confWriter = __importStar(require("./conf-writer"));
const keysWriter = __importStar(require("./key-writer"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const here = path.resolve('.');
            const skel = path.join(here, 'skel');
            const conf = inputHelper.getConf();
            const env = inputHelper.getEnv();
            const privKey = inputHelper.getPrivKey();
            const pubKey = inputHelper.getPubKey();
            const keys = path.join(env.inputDir, 'keys');
            io.mkdirP(env.inputDir);
            io.mkdirP(env.outputDir);
            io.mkdirP(keys);
            confWriter.writeConf(conf, skel, env.inputDir);
            confWriter.writeEnv(env, skel, here);
            keysWriter.writeKey(pubKey, keys);
            keysWriter.writeKey(privKey, keys);
            core.setOutput('repository', env.outputDir);
            yield exec.exec('docker-compose', ['up']);
            yield exec.exec('docker-compose', ['down']);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
