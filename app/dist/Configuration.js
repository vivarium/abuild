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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const Abuild_1 = require("./Configuration/Abuild");
const Environment_1 = require("./Configuration/Environment");
class Configuration {
    constructor(abuild, environment) {
        this._abuild = abuild;
        this._environment = environment;
    }
    static fromAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const [abuild, environment] = yield Promise.all([
                Abuild_1.Abuild.fromAction(),
                Environment_1.Environment.fromAction()
            ]);
            return new Configuration(abuild, environment);
        });
    }
    write(hierarchy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this._abuild.write(hierarchy),
                this._environment.write(hierarchy)
            ]);
            return this._environment;
        });
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map