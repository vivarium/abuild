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
const Exec = __importStar(require("@actions/exec"));
const Container_1 = require("../Container");
class Docker extends Container_1.Container {
    constructor(name) {
        super(name);
        this._isBuilt = false;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isBuilt) {
                yield Exec.exec('docker-compose', ['build', this.name()]);
                this._isBuilt = true;
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.build();
            yield Exec.exec('docker-compose', ['up']);
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isBuilt) {
                yield Exec.exec('docker-compose', ['down']);
            }
        });
    }
}
exports.Docker = Docker;
//# sourceMappingURL=Docker.js.map