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
            FileSystem.writeFile(file, this._content, error => {
                if (error) {
                    throw error;
                }
            });
        });
    }
}
exports.Key = Key;
//# sourceMappingURL=Key.js.map