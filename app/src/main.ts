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
        coreCommand.issueCommand(
            'add-matcher',
            {},
            path.join(__dirname, 'problem-abuild.json')
        );

        coreCommand.issueCommand(
            'add-matcher',
            {},
            path.join(__dirname, 'problem-permission-denied.json')
        );

        const here = path.resolve(path.join(__dirname, '..', '..'));
        const skel = path.join(here, 'skel');
        const data = path.join(here, 'data');
        const keys = path.join(data, 'keys');

        const conf = inputHelper.getConf();
        const privKey = inputHelper.getPrivKey();
        const pubKey = inputHelper.getPubKey();

        inputHelper
            .getEnv()
            .then(env => {
                Promise.all([
                    io.mkdirP(env.inputDir),
                    io.mkdirP(env.outputDir),
                    io.mkdirP(keys)
                ]).then(() => {
                    confWriter.writeConf(conf, skel, data);
                    confWriter.writeEnv(env, skel, here);
                    keysWriter.writeKey(pubKey, keys);
                    keysWriter.writeKey(privKey, keys);

                    core.setOutput('repository', env.outputDir);
                });
            })
            .then(() => {
                return exec.exec('docker-compose', ['build'], {
                    cwd: here
                });
            })
            .then(() => {
                return exec.exec(
                    'docker-compose',
                    [
                        'up',
                        '--abort-on-container-exit',
                        '--exit-code-from=abuild'
                    ],
                    {
                        cwd: here
                    }
                );
            })
            .then(() => {
                exec.exec('docker-compose', ['down'], {
                    cwd: here
                });
            })
            .catch(error => {
                core.setFailed(error.message);
            });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
