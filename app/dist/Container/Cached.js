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
exports.Cached = void 0;
const Path = __importStar(require("path"));
const OS = __importStar(require("os"));
const Exec = __importStar(require("@actions/exec"));
const Core = __importStar(require("@actions/core"));
const Container_1 = require("../Container");
class Cached extends Container_1.Container {
    constructor(container, cache, alpine) {
        super(container.name());
        this._container = container;
        this._cache = cache;
        this._version = alpine;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cache = yield this._cache.restore(this._version);
                if (cache.length > 0) {
                    Core.info(`Cache hit! Found ${this.name()} version ${this._version}`);
                    yield Exec.exec('docker', ['image', 'load', '-i', cache]);
                }
            }
            catch (error) {
                Core.error(error.message);
                Core.error('Cannot load cache');
            }
            finally {
                yield this._container.build();
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.build();
            yield this._container.start();
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const history = yield this.history();
                const tmp = Path.join(OS.tmpdir(), `${this._version}.tar`);
                yield Exec.exec('docker', [
                    'image',
                    'save',
                    `${this.name()}:${this._version}`,
                    ...history,
                    '-o',
                    tmp
                ]);
                yield this._cache.save(tmp, this._version);
            }
            catch (error) {
                Core.error(error.message);
                Core.error("Container image can't be cached");
            }
            finally {
                yield this._container.destroy();
            }
        });
    }
    history() {
        return __awaiter(this, void 0, void 0, function* () {
            let history = [];
            yield Exec.exec('docker', ['history', '-q', `${this.name()}:${this._version}`], {
                silent: true,
                listeners: {
                    stdout: buffer => {
                        history = buffer
                            .toString()
                            .trim()
                            .replace(/(\r\n|\n|\r)/gm, ' ')
                            .replace('<missing>', '')
                            .trim()
                            .split(' ');
                    }
                }
            });
            return history;
        });
    }
}
exports.Cached = Cached;
//# sourceMappingURL=Cached.js.map