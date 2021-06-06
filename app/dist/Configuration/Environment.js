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
exports.Environment = void 0;
const Path = __importStar(require("path"));
const FileSystem = __importStar(require("fs"));
const Core = __importStar(require("@actions/core"));
const KeyPair_1 = require("./KeyPair");
const User_1 = require("./User");
class Environment {
    constructor(alpine, cwdir, user, keyPair) {
        this._alpine = alpine;
        this._workdir = cwdir;
        this._user = user;
        this._keyPair = keyPair;
    }
    static fromAction() {
        return __awaiter(this, void 0, void 0, function* () {
            const [user, keyPair] = yield Promise.all([
                User_1.User.fromSystem(),
                KeyPair_1.KeyPair.fromAction()
            ]);
            const alpine = Core.getInput('alpine');
            const workdir = Core.getInput('workdir');
            return new Environment(alpine, workdir, user, keyPair);
        });
    }
    write(hierarchy) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log(hierarchy);
            const data = yield this.read(hierarchy);
            const env = Path.join(hierarchy.root(), '.env');
            FileSystem.writeFileSync(env, data);
            yield this._keyPair.write(hierarchy);
        });
    }
    alpine() {
        return this._alpine;
    }
    read(hierarchy) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = Path.join(yield hierarchy.skel(), 'env.in');
            let data = FileSystem.readFileSync(env, 'utf8');
            data = data.replace('%ALPINE_VERSION%', this._alpine);
            data = data.replace('%UID%', this._user.uid().toString());
            data = data.replace('%GID%', this._user.gid().toString());
            data = data.replace('%KEY_NAME%', this._keyPair.keyName());
            data = data.replace('%REPOSITORY%', yield hierarchy.repository());
            data = data.replace('%WORKSPACE%', hierarchy.workspace());
            data = data.replace('%WORKDIR%', this._workdir);
            return data;
        });
    }
    log(hierarchy) {
        return __awaiter(this, void 0, void 0, function* () {
            Core.startGroup('.env file configuration');
            Core.info('.env will be written with the following settings.');
            Core.info(`ALPINE_VERSION: ${this._alpine}`);
            Core.info(`UID:            ${this._user.uid()}`);
            Core.info(`GID:            ${this._user.gid()}`);
            Core.info(`KEY_NAME:       ${this._keyPair.keyName()}`);
            Core.info(`REPOSITORY:     ${yield hierarchy.repository()}`);
            Core.info(`WORKSPACE:      ${hierarchy.workspace()}`);
            Core.info(`WORKDIR:        ${Path.join(hierarchy.workspace(), this._workdir)}`);
            Core.endGroup();
        });
    }
}
exports.Environment = Environment;
//# sourceMappingURL=Environment.js.map