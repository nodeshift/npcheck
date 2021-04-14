# npcheck

"Node Package Checker" - A tool to run various checks on npm modules

![Node.js CI](https://github.com/nodeshift/npcheck/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/nodeshift/npcheck/badge.svg?branch=main)](https://coveralls.io/github/nodeshift/npcheck?branch=main)

## Prerequisites

- Node.js - version 14.x or greater

## Install

To install globally: `npm i -g npcheck`

## Configuration

Npcheck requires a configuration file where custom behavior can be specified. The configuration file have to be named `npcheck.json` in order for npcheck to pick it up.

### Options

- `modules`: The list of specified modules that npcheck will run checks on. *(type: Array)*

- `[module].name`: The name of the npm module. *(type: String)*

- `[module].npmLink`: Module's NPM url/link *(type: String)*

- `licenses`: Config object to define custom license check behavior. *(type: Object)*

- `licenses.allow`: List that defines global allowed licenses. *(type: Array)*

- `licenses.rules`: Custom per module rules about license checks. *(type: Object)*

- `licenses.rules[module].allow`: Allowed licenses only for the specified module. *(type: Array)*

- `licenses.rules[modules].override`: List of licenses that the cli will treat as warnings (future license decisions to be made) but won't break the CI. *(type: Array)*

### Example

A simple npcheck configuration file.

```json
{
  "modules": [
    {
      "name": "express",
      "npmLink": "https://www.npmjs.com/package/express"
    },
    {
      "name": "eslint",
      "npmLink": "https://www.npmjs.com/package/eslint"
    }
  ],
  "licenses": {
    "allow": ["MIT", "Apache-2.0"],
    "rules": {
      "express": {
        "allow": ["ISC"],
        "override": ["BSD-2-Clause", "BSD-3-Clause"]
      }
    }
  }
}
```

## Advanced Options

While npcheck is very opinionated about how it works there is also some extra options you can use to change it's behavior.

**version**

Outputs the current version of npcheck.

**github-token**

GitHub's OAuth token npcheck will use when contacting the GitHub API.

**help**

Shows the below help.

```sh
Usage: npcheck [--options]

Options:
  --help                Show help                                      [boolean]
  --version             Show version number                            [boolean]
  --github-token, --gt  Custom GitHub token provided to the API for resources
                        (env variable GITHUB_TOKEN is also an option)
                                                        [string] [default: null]
```