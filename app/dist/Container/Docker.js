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
exports.Docker = void 0;
const Exec = __importStar(require("@actions/exec"));
const Core = __importStar(require("@actions/core"));
const Container_1 = require("../Container");
class Docker extends Container_1.Container {
    constructor(name, hierarchy) {
        super(name);
        this._isBuilt = false;
        this._hierarchy = hierarchy;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isBuilt) {
                Core.debug(this._hierarchy.root());
                yield Exec.exec('docker-compose', ['build', this.name()], {
                    cwd: this._hierarchy.root()
                });
                this._isBuilt = true;
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.build();
            yield Exec.exec('docker-compose', ['up'], {
                cwd: this._hierarchy.root()
            });
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isBuilt) {
                yield Exec.exec('docker-compose', ['down'], {
                    cwd: this._hierarchy.root()
                });
            }
        });
    }
}
exports.Docker = Docker;
//# sourceMappingURL=Docker.js.map