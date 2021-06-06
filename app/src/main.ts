import * as Process from 'process';
import * as Core from '@actions/core';
import * as Path from 'path';

import * as Command from '@actions/core/lib/command';

import { Container } from './Container';
import { Configuration } from './Configuration';
import { Cached } from './Container/Cached';
import { Docker } from './Container/Docker';
import { Hierarchy } from './Hierarchy';
import { ImageCache } from './Cache/ImageCache';

async function matchers(): Promise<void> {
    const problem = Path.join(__dirname, '..', 'problem');
    Command.issueCommand(
        'add-matcher',
        {},
        Path.join(problem, 'problem-abuild.json')
    );

    Command.issueCommand(
        'add-matcher',
        {},
        Path.join(problem, 'problem-permission-denied.json')
    );
}

async function github(
    hierarchy: Hierarchy,
    container: Container
): Promise<Container> {
    const conf = await Configuration.fromAction();
    const env = await conf.write(hierarchy);

    try {
        const cachePath = await hierarchy.cache(env.alpine());
        const cache = new ImageCache(cachePath);

        return new Cached(container, cache, env.alpine());
    } catch (error) {
        Core.warning('Skipping cache');
    }

    return container;
}

async function configure(
    container: Container,
    hierarchy: Hierarchy
): Promise<Container> {
    if (Process.argv.length > 3) {
        Core.warning(
            'This program needs exactly one argument to start, ignoring others.'
        );
    }

    const arg = Process.argv.length == 3 ? Process.argv[2] : '-g';

    Core.debug(arg);
    switch (arg) {
        default:
            return github(hierarchy, container);
    }
}

async function run(): Promise<void> {
    const hierarchy = await Hierarchy.fromAction();
    let container: Container = new Docker('abuild', hierarchy);

    try {
        await matchers();
        container = await configure(container, hierarchy);
        await container.start();
    } catch (error) {
        Core.setFailed(error.message);
    } finally {
        container.destroy();
    }
}

run();
