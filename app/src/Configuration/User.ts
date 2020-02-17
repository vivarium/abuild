import * as Exec from '@actions/exec';

export class User {
    private _uid: number;

    private _gid: number;

    public static async fromSystem(): Promise<User> {
        let uid = 1000;
        let gid = 1000;

        await Exec.exec('id', ['-u'], {
            silent: true,
            listeners: {
                stdout: buffer => {
                    uid = parseInt(
                        buffer.toString().slice(0, buffer.length - 1)
                    );
                }
            }
        });

        await Exec.exec('id', ['-g'], {
            silent: true,
            listeners: {
                stdout: buffer => {
                    gid = parseInt(
                        buffer.toString().slice(0, buffer.length - 1)
                    );
                }
            }
        });

        return new User(uid, gid);
    }

    public constructor(uid: number, gid: number) {
        uid = Math.floor(uid);
        gid = Math.floor(gid);

        if (uid < 0 || gid < 0) {
            throw new Error('UID and GID must be both positive numbers.');
        }

        this._uid = uid;
        this._gid = gid;
    }

    public uid(): number {
        return this._uid;
    }

    public gid(): Number {
        return this._gid;
    }
}
