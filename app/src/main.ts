import * as Process from 'process';
import * as Core from '@actions/core';
import * as Command from '@actions/core/lib/command';
import * as Path from 'path';

import { Container } from './Container';
import { Configuration } from './Configuration';
import { Cached } from './Container/Cached';
import { Docker } from './Container/Docker';
import { Hierarchy } from './Hierarchy';

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

    return new Cached(container, hierarchy, env.alpine());
}

async function configure(container: Container): Promise<Container> {
    if (Process.argv.length > 3) {
        Core.warning(
            'This program needs exactly one argument to start, ignoring others.'
        );
    }

    const hierarchy = await Hierarchy.fromAction();

    const arg = Process.argv.length == 3 ? Process.argv[2] : '-g';

    Core.debug(arg);
    switch (arg) {
        default:
            return github(hierarchy, container);
    }
}

async function run(): Promise<void> {
    let container: Container = new Docker('abuild');

    try {
        await matchers();
        container = await configure(container);
        await container.start();
    } catch (error) {
        Core.setFailed(error.message);
    } finally {
        container.destroy();
    }
}

run();
