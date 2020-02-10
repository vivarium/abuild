import * as path from 'path'
import * as process from 'process'
import core from '@actions/core'
import io from '@actions/io'

import * as inputHelper from './input-helper'
import * as confWriter from './conf-writer'
import * as keysWriter from './key-writer'
import * as abuild from './abuild'

async function run() {
  try {

    let githubHome = process.env['HOME'];
    if (!githubHome) {
      throw new Error('HOME not defined')
    }

    let githubWorkspace = process.env['GITHUB_WORKSPACE'];
    if (!githubWorkspace) {
      throw new Error('GITHUB_WORKSPACE not defined');
    }

    githubHome      = path.resolve(githubHome)
    githubWorkspace = path.resolve(githubWorkspace);

    const etc     = '/etc';
    const keys    = path.join(etc, 'apk', 'keys');
    const _abuild = path.join(githubHome, '.abuild');

    io.mkdirP(_abuild);

    const conf    = inputHelper.getConf();
    const privKey = inputHelper.getPrivKey();
    const pubKey  = inputHelper.getPubKey(); 

    confWriter.writeConf(conf, etc);
    keysWriter.writeKey(pubKey, keys);
    keysWriter.writeKey(privKey, _abuild);
    keysWriter.writePrivKeyConf(privKey, _abuild);

    const packages = inputHelper.getPackages(githubWorkspace);
    
    packages.forEach((_package) => {
      abuild.build(_package);
    })

    const output = path.join(githubWorkspace, 'packages', conf.version);
    core.setOutput('repoDir', output);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
