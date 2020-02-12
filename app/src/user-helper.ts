import * as exec from '@actions/exec';

export interface IUser {
    uid: string;
    gid: string;
}

export async function getUser() : Promise<IUser>
{
    let user = ({} as unknown) as IUser;

    await exec.exec('id', ['-u'], {

        listeners: {
            stdout: (data) => {
                user.uid = data.toString().slice(0, data.length - 1);
            }
        }
    })

    await exec.exec('id', ['-g'], {
        listeners: {
            stdout: (data) => {
                user.gid = data.toString().slice(0, data.length - 1);
            }
        }
    })

    return new Promise<IUser>((resolve, reject) => {
        resolve(user);
    })
}