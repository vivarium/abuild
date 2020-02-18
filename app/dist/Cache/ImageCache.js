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
const Crypto = __importStar(require("crypto"));
const FileSystem = __importStar(require("fs"));
const Path = __importStar(require("path"));
const Core = __importStar(require("@actions/core"));
const Utils = __importStar(require("./ActionUtils"));
const CacheHttpClient = __importStar(require("./CacheHttpClient"));
const Constants_1 = require("./Constants");
class ImageCache {
    constructor(cachePath) {
        this._cachePath = cachePath;
    }
    restore(version) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            Core.info(`Check cache for abuild:${version}...`);
            try {
                if (!Utils.isValidEvent()) {
                    Utils.logWarning(`Event Validation Error: The event type ${process.env[Constants_1.Events.Key]} is not supported. Only ${Utils.getSupportedEvents().join(', ')} events are supported at this time.`);
                    return '';
                }
                const primaryKey = version;
                Core.saveState(Constants_1.State.CacheKey, primaryKey);
                const keys = [primaryKey];
                const cacheEntry = yield CacheHttpClient.getCacheEntry(keys);
                if (!((_a = cacheEntry) === null || _a === void 0 ? void 0 : _a.archiveLocation)) {
                    Core.info(`...Cache not found for abuild:${version}.`);
                    return '';
                }
                const archivePath = Path.join(this._cachePath, `${version}.tar`);
                Core.debug(`Archive Path: ${archivePath}`);
                Utils.setCacheState(cacheEntry);
                yield CacheHttpClient.downloadCache(cacheEntry.archiveLocation, archivePath);
                const archiveFileSize = Utils.getArchiveFileSize(archivePath);
                Core.info(`Cache Size: ~${Math.round(archiveFileSize / (1024 * 1024))} MB (${archiveFileSize} B)`);
                return archivePath;
            }
            catch (error) {
                Core.error(error.message);
                Core.warning('Unable to restore cache');
                return '';
            }
        });
    }
    save(image, version) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Utils.isValidEvent()) {
                    Utils.logWarning(`Event Validation Error: The event type ${process.env[Constants_1.Events.Key]} is not supported. Only ${Utils.getSupportedEvents().join(', ')} events are supported at this time.`);
                    return;
                }
                const imageName = `${version}.tar`;
                const cachedImage = Path.join(this._cachePath, imageName);
                if (FileSystem.existsSync(cachedImage) &&
                    this.isUpToDate(cachedImage, image)) {
                    Core.info('Cache is up to date, not saving image.');
                    return;
                }
                Core.debug('Reserving Cache');
                const cacheId = yield CacheHttpClient.reserveCache(version);
                if (cacheId == -1) {
                    Core.info(`Unable to reserve cache with key ${version}, another job may be creating this cache.`);
                    return;
                }
                Core.debug(`Cache ID: ${cacheId}`);
                Core.debug(`Archive Path: ${image}`);
                const fileSizeLimit = 5 * 1024 * 1024 * 1024;
                const archiveFileSize = Utils.getArchiveFileSize(image);
                Core.debug(`File Size: ${archiveFileSize}`);
                if (archiveFileSize > fileSizeLimit) {
                    Utils.logWarning(`Cache size of ~${Math.round(archiveFileSize / (1024 * 1024))} MB (${archiveFileSize} B) is over the 5GB limit, not saving cache.`);
                    return;
                }
                Core.debug(`Saving Cache (ID: ${cacheId})`);
                yield CacheHttpClient.saveCache(cacheId, image);
            }
            catch (error) {
                Utils.logWarning(error.message);
            }
        });
    }
    isUpToDate(cache, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheStream = FileSystem.createReadStream(cache);
            const imageStream = FileSystem.createReadStream(image);
            const cacheSha = yield this.sha256(cacheStream);
            const imageSha = yield this.sha256(imageStream);
            return cacheSha == imageSha;
        });
    }
    sha256(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const sha256 = Crypto.createHash('sha256');
            let shaSum = '';
            stream.on('data', data => {
                sha256.update(data);
            });
            stream.on('end', () => {
                shaSum = sha256.digest('hex');
            });
            return shaSum;
        });
    }
}
exports.ImageCache = ImageCache;
//# sourceMappingURL=ImageCache.js.map