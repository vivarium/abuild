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
const Core = __importStar(require("@actions/core"));
const Key_1 = require("./Key");
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
            if (privKey.length == 0) {
                throw new Error('Private key is empty!');
            }
            const pubKey = Core.getInput('pubKey');
            if (pubKey.length == 0) {
                throw new Error('Public key is empty!');
            }
            return new KeyPair(keyName, new Key_1.Key(keyName, privKey), new Key_1.Key(`${keyName}.pub`, pubKey));
        });
    }
    write(hierarchy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this._privKey.write(yield hierarchy.keys()),
                this._pubKey.write(yield hierarchy.keys())
            ]);
        });
    }
    keyName() {
        return this._keyName;
    }
}
exports.KeyPair = KeyPair;
//# sourceMappingURL=KeyPair.js.map