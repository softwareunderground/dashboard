export interface Config {
  repos: RepoInfo[];
}

export interface RepoInfo {
  owner: string;
  name: string;
}
