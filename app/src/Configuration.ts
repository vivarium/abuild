import { Abuild } from './Configuration/Abuild';
import { Environment } from './Configuration/Environment';
import { Hierarchy } from './Hierarchy';

export class Configuration {
    private _abuild: Abuild;
    private _environment: Environment;

    public static async fromAction(): Promise<Configuration> {
        const [abuild, environment] = await Promise.all([
            Abuild.fromAction(),
            Environment.fromAction()
        ]);

        return new Configuration(abuild, environment);
    }

    public constructor(abuild: Abuild, environment: Environment) {
        this._abuild = abuild;
        this._environment = environment;
    }

    public async write(hierarchy: Hierarchy): Promise<Environment> {
        await Promise.all([
            this._abuild.write(hierarchy),
            this._environment.write(hierarchy)
        ]);

        return this._environment;
    }
}
