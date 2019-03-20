const App = require('@octokit/app')
const Octokit = require('@octokit/rest');
const request = require('@octokit/request')
const fs = require('fs');

// Returns an octokit instance (from @octokit/rest) that is authenticated to
// access the specified repository owned by the specified user.
async function octokitFor(owner, repo) {
  private_key = fs.readFileSync('github.pem', "utf8");

  // From https://www.npmjs.com/package/@octokit/app/v/2.2.1
  const app = new App({ id: process.env.GITHUB_APP_ID, privateKey: private_key })
  const jwt = app.getSignedJsonWebToken()
  const { data } = await request('GET /repos/:owner/:repo/installation', {
    owner,
    repo,
    headers: {
      authorization: `Bearer ${jwt}`,
      accept: 'application/vnd.github.machine-man-preview+json'
    }
  })
  const installationId = data.id

  // From https://www.npmjs.com/package/@octokit/rest/v/16.16.4
  const octokit = new Octokit({
    async auth () {
      const installationAccessToken = await app.getInstallationAccessToken({ 
        installationId: installationId
      });
      return `token ${installationAccessToken}`;
    }
  })

  return octokit;
}

function split_repo_name(full_repo_name) {
  parts = full_repo_name.split('/');
  if (parts.length !== 2) {
    throw new Error('split_repo_name got invalid repo name: ' + full_repo_name);
  }
  owner = parts[0];
  repo = parts[1];
  return { owner, repo };
}

// user is the person who added the comment
exports.addComment = async function (full_repo_name, pull_request_number, user, line_number, commentBody) {
  if (line_number !== null) {
    throw new Error('Line numbers for comments are not implemented yet.');
  }

  const { owner, repo } = split_repo_name(full_repo_name);
  const octokit = await octokitFor(owner, repo);
  commentBody = 'User ' + user + ' commented: \n\n' + commentBody;

  await octokit.issues.createComment({owner, repo, number: pull_request_number, body: commentBody});
}