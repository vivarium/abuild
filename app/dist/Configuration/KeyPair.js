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
exports.KeyPair = void 0;
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