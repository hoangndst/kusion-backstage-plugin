# Contributing to Kusion Backstage Plugin
## Code of Conduct

We follow the [CNCF Code of Conduct][code-of-conduct]. By contributing, you agree to uphold these standards.

[code-of-conduct]: https://github.com/KusionStack/community/blob/main/CODE_OF_CONDUCT.md

## Getting Started

Let's start with the [README](README.md). After you cloned a fork of this repo, you can install dependencies and run the project.

```bash
cd kusion-backstage-plugin

yarn install # install dependencies
yarn tsc # does a first run of type generation and checks
```

### Serving the Backstage App

```bash
yarn dev
```
This is going to start two things, the frontend (:3000) and the backend (:7007).

This should open a local instance of Backstage in your browser, otherwise open one of the URLs printed in the terminal.

By default, Backstage will start on port 3000, however you can override this by setting an environment variable `PORT` on your local machine. e.g. `export PORT=8080` then running `yarn dev`. Or `PORT=8080 yarn dev`.

## Create a new plugin

Follow the [Backstage plugin documentation](https://backstage.io/docs/plugins/create-a-plugin) to create a new plugin.

## Coding Guidelines

We use the backstage-cli to build, serve, lint, test and package all the plugins.

All code should be formatted with `prettier` according to the repository’s configuration. It’s best to set up your editor to auto-format, but you can also run `yarn prettier --write <file>` to manually format files.

A consistent coding style is enforced using [EditorConfig](https://editorconfig.org/) through the [`.editorconfig`](.editorconfig) file located at the root of the repository. Most editors support this feature natively, but if yours does not, you can [install a plugin](https://editorconfig.org/#download) to enable it.

The Backstage development environment does not require any specific editor, but it is intended to be used with one that has built-in linting and type-checking. The development server does not include any checks by default, but they can be enabled using the `--check` flag. Note that using the flag may consume more system resources and slow things down.

## Package Scripts
The following scripts are available in the [`package.json`](https://github.com/KusionStack/kusion-backstage-plugin/blob/main/package.json) file.

## Local configuration

Local config is read from `app-config.local.yaml` if it exists. This file is not tracked by git and will be merged with `app-config.yaml` and overwrite the default app configs.

Learn more about the [Backstage configuration](https://backstage.io/docs/conf/).

## Creating Changesets

We use [changesets](https://github.com/atlassian/changesets) to help us prepare releases. They help us make sure that every package affected by a change gets a proper version number and an entry in its `CHANGELOG.md`. To make the process of generating releases easy, it helps when contributors include changesets with their pull requests.

### When to use a changeset?

Any time a patch, minor, or major change aligning to [Semantic Versioning](https://semver.org) is made to any published package in `packages/` or `plugins/`, a changeset should be used.

In general, changesets are only needed for changes to packages within `packages/` or `plugins/` directories, and only for the packages that are not marked as `private`. Changesets are also not needed for changes that do not affect the published version of each package, for example changes to tests or in-line source code comments.

Changesets **are** needed for new packages, as that is what triggers the package to be part of the next release. They are also needed for changes to `README.md` files so that the updates are reflected on the NPM page for the changed package.

### How to create a changeset

1. Run `yarn changeset` from the root of the repo
2. Select which packages you want to include a changeset for
3. Select impact of the change you're introducing. If the package you are changing is at version `0.x`, use `minor` for breaking changes and `patch` otherwise. If the package is at `1.0.0` or higher, use `major` for breaking changes, `minor` for backwards compatible API changes, and `patch` otherwise. See the [Semantic Versioning specification](https://semver.org/#semantic-versioning-specification-semver) for more details.
4. Explain your changes in the generated changeset.
5. Add generated changeset to Git
6. Push the commit with your changeset to the branch associated with your PR
7. Accept our gratitude for making the release process easier on the maintainers

For more information on changesets, see the [adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) documentation.

Here is an example of a changeset pull request:
- <https://github.com/KusionStack/kusion-backstage-plugin/pull/2>

## Release Process

Please include changeset files your pull requests if you would like them to be released. To create a changeset file run yarn changeset and commit the resulting file to the pull request.

After merging a changeset file to main, a subsequent pull request is created automatically that makes the actual version bumps of the plugins/packages based on the changeset files. When this pull request is merged, the plugins and packages are automatically published to npm.

## API Reports

Backstage uses [API Extractor](https://api-extractor.com/) and TSDoc comments to generate API Reports in Markdown format. These reports are what drive the [API Reference documentation](https://backstage.io/docs/reference/). What this means is that if you are making changes to the API or adding a new plugin then you will need either generate a new API Report or update an existing API Report. If you don't do this the CI build will fail when you create your Pull Request.

You can run `yarn build:api-reports plugins/<your-plugin-with-changes>` from the root and it will update the existing API Report or create a new one.

Each plugin/package has its own API Report which means you might see more than one file updated or created depending on your changes. These changes will then need to be committed as well.
