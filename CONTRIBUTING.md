# Contributing to Emmy.js
Thank you for considering contributing to Emmy.js! This document outlines some guidelines to help you get started.

## How to Contribute
### 1. Fork the Emmy.js repository.
Fork this repository by clicking on the fork button on the top of this page. This will create a copy of this repository in your account.

### 2. Clone your forked repository to your local machine:

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the _copy to clipboard_ icon.

Open a terminal and run the following git command:

```bash
git clone "url you just copied"
```

where "url you just copied" (without the quotation marks) is the url to this repository (your fork of this project). See the previous steps to obtain the url. This step should look like this:

```bash
git clone https://github.com/YOUR_USERNAME/emmy-dom.git
```

### 2.1 Install git hooks (recommended)
To run the local quality gate before each commit, install the repository hooks:

```bash
npm run hooks:install
```

This enables a `pre-commit` hook that runs:

```bash
npm run precommit:check
```

### 3. Create a new branch for your changes:
Change to the repository directory on your computer (if you are not already there):

```bash
cd emmy-dom
```

Use one short-lived branch per issue/feature. We recommend the following naming format:

- `feat/<issue-number>-short-description`
- `fix/<issue-number>-short-description`
- `chore/<issue-number>-short-description`

Examples:

- `feat/123-router-routes`
- `fix/210-hooks-useeffect`
- `chore/315-readme-status`

Now create a branch using the `git checkout` command:

```bash
git checkout -b feat/123-short-description
```

> [!TIP]
> Keep branches small and short-lived. Avoid long-running sub-branches unless a large feature is being split into stacked PRs.

### 4. Make your changes and commit them using the following command:

```bash
npm run co
```

> [!IMPORTANT]
> Ensure that your changes pass the existing tests.

`npm run co` runs `co:build` (`tsc`, `cpdir`, `vitest run`, and `eslint --fix`), stages all changes, opens the `sui-mono` commit flow, and pushes.

This command is equivalent to:
```bash
npm run co:build
git add .
sui-mono commit
git push
```

The use of `sui-mono commit` is mandatory to ensure that the commit message follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### 5. Push your changes to your forked repository
```bash
git push origin feat/123-short-description
```

Create a pull request on the `emmy-dom` repository. After your pull request is merged, you can safely delete your branch if you want to.

## Pull Request Guidelines
- Open small, focused PRs (preferably one feature or fix per PR).
- Link the related issue in the PR description.
- Include a short risk note and the tests you added or updated.
- Ensure build and tests pass before requesting review.
- Use squash merge to keep history clean.

### Stability Label Rule
If a feature is marked as `Stable`, it must have active automated tests for its core behavior and no known critical TODOs blocking production use. Otherwise, it should be labeled `Experimental` or `Unstable`.

## Reporting Issues
If you encounter any issues or have suggestions for improvements, please create an issue on the `emmy-dom`  GitHub repository.

## Building and Testing
To build and test `emmy-dom` locally, follow these steps:
Install dependencies:
```bash
npm install
```
Build the project and run tests:
```bash
npm run build
```
