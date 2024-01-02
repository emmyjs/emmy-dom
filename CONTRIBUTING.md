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

### 3. Create a new branch for your changes:
Change to the repository directory on your computer (if you are not already there):

```bash
cd emmy-dom
```

Now create a branch using the `git checkout` command:

```bash
git checkout -b your-feature-name
```

### 4. Make your changes and commit them using the following command, which includes running tests:

```bash
npm run co
```

> [!IMPORTANT]
> Ensure that your changes pass the existing tests.

This command is equivalent to:
```bash
npm run build
git add .
sui-mono commit
git push
```

The use of `sui-mono commit` is mandatory to ensure that the commit message follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### 5. Push your changes to your forked repository
```bash
git push origin your-feature-name
```

Create a pull request on the `emmy-dom` repository. After your pull request is merged, you can safely delete your branch if you want to.

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
