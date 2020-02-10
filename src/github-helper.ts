import * as path from 'path'

export interface IGitHub {
    home: string;
    workspace: string;
}

export function getGitHub(): IGitHub {

    let github = ({} as unknown) as IGitHub;

    let githubHome = process.env['HOME'];
    if (!githubHome) {
      throw new Error('HOME not defined');
    }

    let githubWorkspace = process.env['GITHUB_WORKSPACE'];
    if (!githubWorkspace) {
      throw new Error('GITHUB_WORKSPACE not defined');
    }

    github.home      = path.resolve(githubHome);
    github.workspace = path.resolve(githubWorkspace);

    return github;
}