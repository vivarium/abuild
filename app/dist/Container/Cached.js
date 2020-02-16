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
const OS = __importStar(require("os"));
const FileSystem = __importStar(require("fs"));
const Exec = __importStar(require("@actions/exec"));
const Core = __importStar(require("@actions/core"));
const IO = __importStar(require("@actions/io"));
const Container_1 = require("../Container");
class Cached extends Container_1.Container {
    constructor(container, hierarchy, alpine) {
        super(container.name());
        this._container = container;
        this._version = alpine;
        this._image = `${this._version}.tar`;
        this._cache = Path.join(hierarchy.cache(), this._image);
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            if (FileSystem.existsSync(this._cache)) {
                Core.info(`Cache hit! Found ${this.name()} version ${this._version}`);
                yield Exec.exec('docker', ['image', 'load', '-i', this._cache]);
            }
            yield this._container.build();
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
            const tmp = Path.join(OS.tmpdir(), this._image);
            const history = yield this.history();
            try {
                yield Exec.exec('docker', [
                    'image',
                    'save',
                    `${this.name()}:${this._version}`,
                    ...history,
                    '-o',
                    tmp
                ]);
                yield IO.cp(tmp, this._cache);
            }
            catch (error) {
                Core.error(error.message);
                Core.error("Container image can't be cached");
            }
            finally {
                Core.info(`Abuild image cached to ${this._cache}`);
                yield this._container.destroy();
            }
        });
    }
    history() {
        return __awaiter(this, void 0, void 0, function* () {
            let history = [];
            yield Exec.exec('docker', ['history', '-q', `${this.name()}:${this._version}`], {
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