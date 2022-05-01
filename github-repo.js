// Name: Github Repo
// Description: Open a repository in Github
// Author: Chris Malven

import '@johnlindquist/kit';

let GITHUB_TOKEN = await env('GITHUB_TOKEN', {
  panel: md(`
    ## Get a [Github Personal Access Token](https://github.com/settings/tokens)
    
    The token should have the following scopes:
    - repo
  `),
  ignoreBlur: true,
  secret: true,
});

const BASE_URL = 'https://api.github.com';
const REPOS_URL = `${BASE_URL}/user/repos?sort=updated&per_page=20&type=owner`;

let getReposResponse = await get(REPOS_URL, {
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
  },
});

let url = await arg(
  `Select repo:`,
  getReposResponse.data
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      value: repo.html_url,
    })),
);

exec(`open '${url}'`);