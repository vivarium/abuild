import * as Crypto from 'crypto';
import * as FileSystem from 'fs';
import * as Path from 'path';

import * as Core from '@actions/core';

import * as Utils from './ActionUtils';
import * as CacheHttpClient from './CacheHttpClient';
import { Events, State } from './Constants';

export class ImageCache {
    private _cachePath;

    public constructor(cachePath: string) {
        this._cachePath = cachePath;
    }

    public async restore(version: string): Promise<string> {
        Core.info(`Check cache for abuild:${version}...`);

        try {
            // Validate inputs, this can cause task failure
            if (!Utils.isValidEvent()) {
                Utils.logWarning(
                    `Event Validation Error: The event type ${
                        process.env[Events.Key]
                    } is not supported. Only ${Utils.getSupportedEvents().join(
                        ', '
                    )} events are supported at this time.`
                );

                return '';
            }

            const primaryKey = version;
            Core.saveState(State.CacheKey, primaryKey);
            const keys = [primaryKey];

            const cacheEntry = await CacheHttpClient.getCacheEntry(keys);
            if (!cacheEntry?.archiveLocation) {
                Core.info(`...Cache not found for abuild:${version}.`);

                return '';
            }

            const archivePath = Path.join(this._cachePath, `${version}.tar`);

            Core.debug(`Archive Path: ${archivePath}`);

            // Store the cache result
            Utils.setCacheState(cacheEntry);

            // Download the cache from the cache entry
            await CacheHttpClient.downloadCache(
                cacheEntry.archiveLocation,
                archivePath
            );

            const archiveFileSize = Utils.getArchiveFileSize(archivePath);
            Core.info(
                `Cache Size: ~${Math.round(
                    archiveFileSize / (1024 * 1024)
                )} MB (${archiveFileSize} B)`
            );

            return archivePath;
        } catch (error) {
            Core.error(error.message);
            Core.warning('Unable to restore cache');

            return '';
        }
    }

    public async save(image: string, version: string) {
        try {
            if (!Utils.isValidEvent()) {
                Utils.logWarning(
                    `Event Validation Error: The event type ${
                        process.env[Events.Key]
                    } is not supported. Only ${Utils.getSupportedEvents().join(
                        ', '
                    )} events are supported at this time.`
                );
                return;
            }

            const imageName = `${version}.tar`;
            const cachedImage = Path.join(this._cachePath, imageName);

            if (
                FileSystem.existsSync(cachedImage) &&
                this.isUpToDate(cachedImage, image)
            ) {
                Core.info('Cache is up to date, not saving image.');
                return;
            }

            Core.debug('Reserving Cache');
            const cacheId = await CacheHttpClient.reserveCache(version);
            if (cacheId == -1) {
                Core.info(
                    `Unable to reserve cache with key ${version}, another job may be creating this cache.`
                );
                return;
            }
            Core.debug(`Cache ID: ${cacheId}`);

            Core.debug(`Archive Path: ${image}`);

            const fileSizeLimit = 5 * 1024 * 1024 * 1024; // 5GB per repo limit
            const archiveFileSize = Utils.getArchiveFileSize(image);
            Core.debug(`File Size: ${archiveFileSize}`);
            if (archiveFileSize > fileSizeLimit) {
                Utils.logWarning(
                    `Cache size of ~${Math.round(
                        archiveFileSize / (1024 * 1024)
                    )} MB (${archiveFileSize} B) is over the 5GB limit, not saving cache.`
                );
                return;
            }

            Core.debug(`Saving Cache (ID: ${cacheId})`);

            await CacheHttpClient.saveCache(cacheId, image);
        } catch (error) {
            Utils.logWarning(error.message);
        }
    }

    private async isUpToDate(cache: string, image: string): Promise<boolean> {
        const cacheStream = FileSystem.createReadStream(cache);
        const imageStream = FileSystem.createReadStream(image);

        const cacheSha = await this.sha256(cacheStream);
        const imageSha = await this.sha256(imageStream);

        return cacheSha == imageSha;
    }

    private async sha256(stream: FileSystem.ReadStream): Promise<string> {
        const sha256 = Crypto.createHash('sha256');

        let shaSum = '';
        stream.on('data', data => {
            sha256.update(data);
        });

        stream.on('end', () => {
            shaSum = sha256.digest('hex');
        });

        return shaSum;
    }
}
