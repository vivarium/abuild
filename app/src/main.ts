import * as path from 'path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as coreCommand from '@actions/core/lib/command';
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

        await io.mkdirP(env.inputDir);
        await io.mkdirP(env.outputDir);
        await io.mkdirP(keys);

        coreCommand.issueCommand(
            'add-matcher',
            {},
            path.join(__dirname, 'problem-abuild.json')
        );

        coreCommand.issueCommand(
            'add-matcher',
            {},
            path.join(__dirname, 'problem-docker.json')
        );

        coreCommand.issueCommand(
            'add-matcher',
            {},
            path.join(__dirname, 'problem-permission-denied.json')
        );

        confWriter.writeConf(conf, skel, env.inputDir);
        confWriter.writeEnv(env, skel, here);
        keysWriter.writeKey(pubKey, keys);
        keysWriter.writeKey(privKey, keys);

        core.setOutput('repository', env.outputDir);

        await exec.exec('docker-compose', ['build']);
        await exec.exec('docker-compose', ['up']);
        await exec.exec('docker-compose', ['down']);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
