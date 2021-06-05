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
exports.saveCache = exports.reserveCache = exports.downloadCache = exports.getCacheEntry = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const auth_1 = require("@actions/http-client/auth");
const http_client_1 = require("@actions/http-client");
const utils = __importStar(require("./ActionUtils"));
function isSuccessStatusCode(statusCode) {
    if (!statusCode) {
        return false;
    }
    return statusCode >= 200 && statusCode < 300;
}
function isRetryableStatusCode(statusCode) {
    if (!statusCode) {
        return false;
    }
    const retryableStatusCodes = [
        http_client_1.HttpCodes.BadGateway,
        http_client_1.HttpCodes.ServiceUnavailable,
        http_client_1.HttpCodes.GatewayTimeout
    ];
    return retryableStatusCodes.includes(statusCode);
}
function getCacheApiUrl(resource) {
    const baseUrl = (process.env['ACTIONS_CACHE_URL'] ||
        process.env['ACTIONS_RUNTIME_URL'] ||
        '').replace('pipelines', 'artifactcache');
    if (!baseUrl) {
        throw new Error('Cache Service Url not found, unable to restore cache.');
    }
    const url = `${baseUrl}_apis/artifactcache/${resource}`;
    core.debug(`Resource Url: ${url}`);
    return url;
}
function createAcceptHeader(type, apiVersion) {
    return `${type};api-version=${apiVersion}`;
}
function getRequestOptions() {
    const requestOptions = {
        headers: {
            Accept: createAcceptHeader('application/json', '6.0-preview.1')
        }
    };
    return requestOptions;
}
function createHttpClient() {
    const token = process.env['ACTIONS_RUNTIME_TOKEN'] || '';
    const bearerCredentialHandler = new auth_1.BearerCredentialHandler(token);
    return new http_client_1.HttpClient('actions/cache', [bearerCredentialHandler], getRequestOptions());
}
function getCacheEntry(keys) {
    return __awaiter(this, void 0, void 0, function* () {
        const httpClient = createHttpClient();
        const resource = `cache?keys=${encodeURIComponent(keys.join(','))}`;
        const response = yield httpClient.getJson(getCacheApiUrl(resource));
        if (response.statusCode === 204) {
            return null;
        }
        if (!isSuccessStatusCode(response.statusCode)) {
            throw new Error(`Cache service responded with ${response.statusCode}`);
        }
        const cacheResult = response.result;
        const cacheDownloadUrl = cacheResult === null || cacheResult === void 0 ? void 0 : cacheResult.archiveLocation;
        if (!cacheDownloadUrl) {
            throw new Error('Cache not found.');
        }
        core.setSecret(cacheDownloadUrl);
        core.debug(`Cache Result:`);
        core.debug(JSON.stringify(cacheResult));
        return cacheResult;
    });
}
exports.getCacheEntry = getCacheEntry;
function pipeResponseToStream(response, stream) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            response.message.pipe(stream).on('close', () => {
                resolve();
            });
        });
    });
}
function downloadCache(archiveLocation, archivePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const stream = fs.createWriteStream(archivePath);
        const httpClient = new http_client_1.HttpClient('actions/cache');
        const downloadResponse = yield httpClient.get(archiveLocation);
        yield pipeResponseToStream(downloadResponse, stream);
    });
}
exports.downloadCache = downloadCache;
function reserveCache(key) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const httpClient = createHttpClient();
        const reserveCacheRequest = {
            key
        };
        const response = yield httpClient.postJson(getCacheApiUrl('caches'), reserveCacheRequest);
        return (_b = (_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.cacheId) !== null && _b !== void 0 ? _b : -1;
    });
}
exports.reserveCache = reserveCache;
function getContentRange(start, end) {
    return `bytes ${start}-${end}/*`;
}
function uploadChunk(httpClient, resourceUrl, data, start, end) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(`Uploading chunk of size ${end -
            start +
            1} bytes at offset ${start} with content range: ${getContentRange(start, end)}`);
        const additionalHeaders = {
            'Content-Type': 'application/octet-stream',
            'Content-Range': getContentRange(start, end)
        };
        const uploadChunkRequest = () => __awaiter(this, void 0, void 0, function* () {
            return yield httpClient.sendStream('PATCH', resourceUrl, data, additionalHeaders);
        });
        const response = yield uploadChunkRequest();
        if (isSuccessStatusCode(response.message.statusCode)) {
            return;
        }
        if (isRetryableStatusCode(response.message.statusCode)) {
            core.debug(`Received ${response.message.statusCode}, retrying chunk at offset ${start}.`);
            const retryResponse = yield uploadChunkRequest();
            if (isSuccessStatusCode(retryResponse.message.statusCode)) {
                return;
            }
        }
        throw new Error(`Cache service responded with ${response.message.statusCode} during chunk upload.`);
    });
}
function parseEnvNumber(key) {
    const value = Number(process.env[key]);
    if (Number.isNaN(value) || value < 0) {
        return undefined;
    }
    return value;
}
function uploadFile(httpClient, cacheId, archivePath) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const fileSize = fs.statSync(archivePath).size;
        const resourceUrl = getCacheApiUrl(`caches/${cacheId.toString()}`);
        const fd = fs.openSync(archivePath, 'r');
        const concurrency = (_a = parseEnvNumber('CACHE_UPLOAD_CONCURRENCY')) !== null && _a !== void 0 ? _a : 4;
        const MAX_CHUNK_SIZE = (_b = parseEnvNumber('CACHE_UPLOAD_CHUNK_SIZE')) !== null && _b !== void 0 ? _b : 32 * 1024 * 1024;
        core.debug(`Concurrency: ${concurrency} and Chunk Size: ${MAX_CHUNK_SIZE}`);
        const parallelUploads = [...new Array(concurrency).keys()];
        core.debug('Awaiting all uploads');
        let offset = 0;
        try {
            yield Promise.all(parallelUploads.map(() => __awaiter(this, void 0, void 0, function* () {
                while (offset < fileSize) {
                    const chunkSize = Math.min(fileSize - offset, MAX_CHUNK_SIZE);
                    const start = offset;
                    const end = offset + chunkSize - 1;
                    offset += MAX_CHUNK_SIZE;
                    const chunk = fs.createReadStream(archivePath, {
                        fd,
                        start,
                        end,
                        autoClose: false
                    });
                    yield uploadChunk(httpClient, resourceUrl, chunk, start, end);
                }
            })));
        }
        finally {
            fs.closeSync(fd);
        }
        return;
    });
}
function commitCache(httpClient, cacheId, filesize) {
    return __awaiter(this, void 0, void 0, function* () {
        const commitCacheRequest = { size: filesize };
        return yield httpClient.postJson(getCacheApiUrl(`caches/${cacheId.toString()}`), commitCacheRequest);
    });
}
function saveCache(cacheId, archivePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const httpClient = createHttpClient();
        core.debug('Upload cache');
        yield uploadFile(httpClient, cacheId, archivePath);
        core.debug('Commiting cache');
        const cacheSize = utils.getArchiveFileSize(archivePath);
        const commitCacheResponse = yield commitCache(httpClient, cacheId, cacheSize);
        if (!isSuccessStatusCode(commitCacheResponse.statusCode)) {
            throw new Error(`Cache service responded with ${commitCacheResponse.statusCode} during commit cache.`);
        }
        core.info('Cache saved successfully');
    });
}
exports.saveCache = saveCache;
//# sourceMappingURL=CacheHttpClient.js.map