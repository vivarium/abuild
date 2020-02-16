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
const Compiler_1 = require("./Compiler");
const Author_1 = require("./Author");
class Abuild {
    constructor(compiler, author) {
        this._compiler = compiler;
        this._author = author;
    }
    static fromAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const [compiler, author] = yield Promise.all([
                Compiler_1.Compiler.fromAction(),
                Author_1.Author.fromAction()
            ]);
            return new Abuild(compiler, author);
        });
    }
    write(skelPath, destPath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log();
            const data = yield this.read(skelPath);
            if (!FileSystem.existsSync(destPath)) {
                yield IO.mkdirP(destPath);
            }
            const abuild = Path.join(destPath, 'abuild.conf');
            FileSystem.writeFile(abuild, data, error => {
                if (error) {
                    throw new Error(error.message);
                }
            });
        });
    }
    read(skelPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const abuild = Path.join(skelPath, 'abuild.conf.in');
            let data = FileSystem.readFileSync(abuild, 'utf8');
            data = data.replace('%CFLAGS%', this._compiler.cflags());
            data = data.replace('%CXXFLAGS%', this._compiler.cxxflags());
            data = data.replace('%CPPFLAGS%', this._compiler.cppflags());
            data = data.replace('%LDFLAGS%', this._compiler.ldflags());
            data = data.replace('%JOBS%', this._compiler.jobs().toString());
            data = data.replace('%PACKAGER%', this._author.packager());
            data = data.replace('%MAINTAINER%', this._author.maintainer());
            return data;
        });
    }
    log() {
        return __awaiter(this, void 0, void 0, function* () {
            Core.startGroup('abuild.conf file configuration');
            Core.info('Abuild.conf will be written with the following settings.');
            Core.info(`CFLAGS:     ${this._compiler.cflags()}`);
            Core.info(`CXXFLAGS:   ${this._compiler.cxxflags()}`);
            Core.info(`CPPFLAGS:   ${this._compiler.cppflags()}`);
            Core.info(`LDFLAGS:    ${this._compiler.ldflags()}`);
            Core.info(`Jobs:       ${this._compiler.jobs()}`);
            Core.info(`Packager:   ${this._author.packager()}`);
            Core.info(`Maintainer: ${this._author.maintainer()}`);
            Core.endGroup();
        });
    }
}
exports.Abuild = Abuild;
//# sourceMappingURL=Abuild.js.map