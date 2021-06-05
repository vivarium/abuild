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
exports.Key = void 0;
const FileSystem = __importStar(require("fs"));
const Path = __importStar(require("path"));
const Core = __importStar(require("@actions/core"));
class Key {
    constructor(name, content) {
        if (name.includes('/')) {
            throw new Error('Key name contains invalid character /');
        }
        this._name = name;
        this._content = content;
    }
    write(destPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!FileSystem.statSync(destPath).isDirectory()) {
                throw new Error('path must be a directory');
            }
            const file = Path.join(destPath, this._name);
            Core.info(`Writing key ${this._name} to ${destPath}`);
            FileSystem.writeFileSync(file, this._content);
        });
    }
}
exports.Key = Key;
//# sourceMappingURL=Key.js.map