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
class Compiler {
    constructor(cflags, cxxflags, cppflags, ldflags, jobs) {
        this._cflags = cflags;
        this._cxxflags = cxxflags;
        this._cppflags = cppflags;
        this._ldflags = ldflags;
        this._jobs = jobs;
    }
    static fromAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const cflags = Core.getInput('cflags');
            const cxxflags = Core.getInput('cxxflags');
            const cppflags = Core.getInput('cppflags');
            const ldflags = Core.getInput('ldflags');
            let jobs = Number(Core.getInput('jobs'));
            yield Promise.all([
                this.validateFlags('cflags', cflags),
                this.validateFlags('cxxflags', cxxflags),
                this.validateFlags('cppflags', cppflags),
                this.validateFlags('ldflags', ldflags)
            ]);
            if (isNaN(jobs)) {
                return Promise.reject('Input variable "jobs" must be a number.');
            }
            if (jobs <= 0) {
                Core.warning('Number of jobs is zero or less, defaulting to 1...');
                jobs = 1;
            }
            return new Compiler(cflags, cxxflags, cppflags, ldflags, jobs);
        });
    }
    static validateFlags(name, flags) {
        return __awaiter(this, void 0, void 0, function* () {
            if (flags.length == 0) {
                Core.warning(`Flag ${name.toUpperCase()} is empty`);
                return Promise.resolve();
            }
            const list = flags.split(' ');
            list.forEach(element => {
                if (!element.startsWith('-')) {
                    throw new Error(`${name.toUpperCase()} contains invalid flags: ${element}`);
                }
            });
        });
    }
    cflags() {
        return this._cflags;
    }
    cxxflags() {
        return this._cxxflags;
    }
    cppflags() {
        return this._cppflags;
    }
    ldflags() {
        return this._ldflags;
    }
    jobs() {
        return this._jobs;
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map