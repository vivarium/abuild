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
exports.User = void 0;
const Exec = __importStar(require("@actions/exec"));
class User {
    constructor(uid, gid) {
        uid = Math.floor(uid);
        gid = Math.floor(gid);
        if (uid < 0 || gid < 0) {
            throw new Error('UID and GID must be both positive numbers.');
        }
        this._uid = uid;
        this._gid = gid;
    }
    static fromSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = 1000;
            let gid = 1000;
            yield Exec.exec('id', ['-u'], {
                silent: true,
                listeners: {
                    stdout: buffer => {
                        uid = parseInt(buffer.toString().slice(0, buffer.length - 1));
                    }
                }
            });
            yield Exec.exec('id', ['-g'], {
                silent: true,
                listeners: {
                    stdout: buffer => {
                        gid = parseInt(buffer.toString().slice(0, buffer.length - 1));
                    }
                }
            });
            return new User(uid, gid);
        });
    }
    uid() {
        return this._uid;
    }
    gid() {
        return this._gid;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map