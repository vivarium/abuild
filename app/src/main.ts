import * as path from 'path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as inputHelper from './input-helper';
import * as confWriter from './conf-writer';
import * as keysWriter from './key-writer';

async function run() {
    try {
        const here = path.resolve('.');
        const skel = path.join(here, 'skel');

        const conf = inputHelper.getConf();
        const env = inputHelper.getEnv();
        const privKey = inputHelper.getPrivKey();
        const pubKey = inputHelper.getPubKey();

        const keys = path.join(env.inputDir, 'keys');

        io.mkdirP(env.inputDir);
        io.mkdirP(env.outputDir);
        io.mkdirP(keys);

        confWriter.writeConf(conf, skel, env.inputDir);
        confWriter.writeEnv(env, skel, here);
        keysWriter.writeKey(pubKey, keys);
        keysWriter.writeKey(privKey, keys);

        core.setOutput('repository', env.outputDir);

        await exec.exec('docker-compose', ['up']);
        await exec.exec('docker-compose', ['down']);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
