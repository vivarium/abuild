export abstract class Container {
    private _name: string;

    public constructor(name: string) {
        this._name = name;
    }

    public name(): string {
        return this._name;
    }

    public abstract build(): Promise<void>;

    public abstract start(): Promise<void>;

    public abstract destroy(): Promise<void>;
}
