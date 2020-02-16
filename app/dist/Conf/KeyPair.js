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
const FileSystem = __importStar(require("fs"));
const Core = __importStar(require("@actions/core"));
const IO = __importStar(require("@actions/io"));
const Key_1 = require("../Key");
class KeyPair {
    constructor(keyName, pubKey, privKey) {
        this._keyName = keyName;
        this._pubKey = pubKey;
        this._privKey = privKey;
    }
    static fromAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyName = Core.getInput('keyName');
            const privKey = Core.getInput('privKey');
            const pubKey = Core.getInput('pubKey');
            return new KeyPair(keyName, new Key_1.Key(keyName, privKey), new Key_1.Key(`${keyName}.pub`, pubKey));
        });
    }
    write(destPath) {
        return __awaiter(this, void 0, void 0, function* () {
            destPath = Path.join(destPath, 'keys');
            if (!FileSystem.existsSync(destPath)) {
                IO.mkdirP(destPath);
            }
            yield Promise.all([
                this._privKey.write(destPath),
                this._pubKey.write(destPath)
            ]);
        });
    }
    keyName() {
        return this._keyName;
    }
}
exports.KeyPair = KeyPair;
//# sourceMappingURL=KeyPair.js.map