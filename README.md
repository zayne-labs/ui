# Create Ts Library

This is an opinionated starter template for creating a library with TypeScript.


## Usage

To use this template, simply click the green `Use this template` button at the top right of this repo, or just fork and clone it if you prefer.

## Tooling available
- Eslint plugins for linting (customizable)
- Prettier for formatting
- [TSUP](https://github.com/egoist/tsup) for bundling
- [@zayne-labs/tsconfig](https://github.com/zayne-labs/tsconfig) for relevant tsconfig presets
- [Changesets](https://github.com/changesets/changesets) (Both cli and github action which must be installed on the repo) for versioning, publishing, release notes and changelogs
- [publint](https://github.com/bluwy/publint) and [@arethetypeswrong/cli](https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/packages/cli/README.md) for validating package.json and checking for proper package types resolutions respectively.
- [size-limit](https://github.com/ai/size-limit) for bundle size analysis and management
- [lint-staged](https://github.com/lint-staged/lint-staged) for lint and types checks on staged files and [husky](https://github.com/typicode/husky) for running lint-staged before any commit and before push if you prefer
- [pkg.pr.new](https://pkg-pr-new) for continuous testing of packages on every commit before publishing to npm.
- Various github workflows for:
  - Linting on ci
  - Automatic publishing via changesets
  - Formatting on ci via [autofix.ci](https://autofix.ci/)
  - Labeling issues
  - Issue assignment
  - Continuous release testing via pkg.pr.new github action, etc.

## Setup

- Click the `Use this template` button.
- Create a new repository with it.
- Install the necessary github applications and bots on your repo namely:
  - [aufofix app](https://github.com/marketplace/autofix-ci) for running automatic code fixes
  - [changesets bot](https://github.com/apps/changeset-bot) for checking if there are any changesets contained in PRs
  - [pkg.pr.new app](https://github.com/apps/pkg-pr-new) for continuous testing of packages
- Create npm token [here](https://docs.npmjs.com/creating-and-viewing-access-tokens) (Skip if you already have it handy).
- Add it as a [secret to your repository](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-development-environment-secrets-for-your-repository-or-organization#adding-secrets-for-a-repository) (or at the organization level if you have one), using the name `"NPM_TOKEN"`.
- Install the dependencies using `pnpm install`.
	- Edit the package.json file, and replace any of these: `[*]`, with the appropriate names relevant to your lib (Did this cuz comments aren't allowed in json files).
- Lint your changes by running some of the `lint:*` scripts in the package.json.
- Commit and push your changes.

## To publish a new version
 - Create a changeset via `pnpm changeset` command
 - Follow the prompts
 - Push to github
 - Wait for the changeset action to finish and if it's successful, you should see a pr created by the changeset bot
 - Merging it will lead to the version bump, release and publishing of the package


