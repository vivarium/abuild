import * as path from 'path';

import * as core from '@actions/core';
import * as io from '@actions/io';

import * as githubHelper from './github-helper';
import * as inputHelper from './input-helper';
import * as confWriter from './conf-writer';
import * as keysWriter from './key-writer';
import * as abuild from './abuild';

async function run() {
  try {
    const github = githubHelper.getGitHub();

    const etc = '/etc';
    const keys = path.join(etc, 'apk', 'keys');
    const _abuild = path.join(github.home, '.abuild');

    io.mkdirP(_abuild);

    const conf = inputHelper.getConf();
    const privKey = inputHelper.getPrivKey();
    const pubKey = inputHelper.getPubKey();

    confWriter.writeConf(conf, etc);
    keysWriter.writeKey(pubKey, keys);
    keysWriter.writeKey(privKey, _abuild);
    keysWriter.writePrivKeyConf(privKey, _abuild);

    const packages = inputHelper.getPackages(github.workspace);

    for (let i = 0; i < packages.length; i++) {
      await abuild.build(packages[i]);
    }

    const output = path.join(github.workspace, 'packages', conf.prefix);
    core.setOutput('repository', output);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
