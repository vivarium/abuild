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
const Process = __importStar(require("process"));
const Core = __importStar(require("@actions/core"));
const Path = __importStar(require("path"));
const Command = __importStar(require("@actions/core/lib/command"));
const Configuration_1 = require("./Configuration");
const Cached_1 = require("./Container/Cached");
const Docker_1 = require("./Container/Docker");
const Hierarchy_1 = require("./Hierarchy");
const ImageCache_1 = require("./Cache/ImageCache");
function matchers() {
    return __awaiter(this, void 0, void 0, function* () {
        const problem = Path.join(__dirname, '..', 'problem');
        Command.issueCommand('add-matcher', {}, Path.join(problem, 'problem-abuild.json'));
        Command.issueCommand('add-matcher', {}, Path.join(problem, 'problem-permission-denied.json'));
    });
}
function github(hierarchy, container) {
    return __awaiter(this, void 0, void 0, function* () {
        const conf = yield Configuration_1.Configuration.fromAction();
        const env = yield conf.write(hierarchy);
        try {
            const cachePath = yield hierarchy.cache(env.alpine());
            const cache = new ImageCache_1.ImageCache(cachePath);
            return new Cached_1.Cached(container, cache, env.alpine());
        }
        catch (error) {
            Core.warning('Skipping cache');
        }
        return container;
    });
}
function configure(container) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Process.argv.length > 3) {
            Core.warning('This program needs exactly one argument to start, ignoring others.');
        }
        const hierarchy = yield Hierarchy_1.Hierarchy.fromAction();
        const arg = Process.argv.length == 3 ? Process.argv[2] : '-g';
        Core.debug(arg);
        switch (arg) {
            default:
                return github(hierarchy, container);
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let container = new Docker_1.Docker('abuild');
        try {
            yield matchers();
            container = yield configure(container);
            yield container.start();
        }
        catch (error) {
            Core.setFailed(error.message);
        }
        finally {
            container.destroy();
        }
    });
}
run();
//# sourceMappingURL=main.js.map