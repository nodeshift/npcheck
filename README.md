# NPCheck

"Node Package Checker" - A tool to run various checks on npm modules

![Node.js CI](https://github.com/nodeshift/npcheck/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/nodeshift/npcheck/badge.svg?branch=main)](https://coveralls.io/github/nodeshift/npcheck?branch=main)

## Prerequisites

- Node.js - version 16.x or greater

## Install

To install globally: `npm i -g npcheck`

## Configuration

Npcheck requires a configuration file where custom behavior can be specified. The configuration file have to be named `npcheck.json` in order for npcheck to pick it up.

### Options

- `modules`: The list of specified modules that npcheck will run checks on. _(type: Array)_

- `[module].name`: The name of the npm module. _(type: String)_

- `[module].npmLink`: Module's NPM url/link _(type: String)_

- `licenses`: Config object to define custom license check behavior. _(type: Object)_

- `licenses.allow`: List that defines global allowed licenses. _(type: Array)_

- `licenses.rules`: Custom per module rules about license checks. _(type: Object)_

- `licenses.rules[module].allow`: Allowed licenses only for the specified module. _(type: Array)_

- `licenses.rules[modules].override`: List of licenses that the cli will treat as warnings (future license decisions to be made) but won't break the CI. _(type: Array)_

- `citgm.skip[modules]`: Modules to be skipped by the CITGM checker _(type: Array)_

- `allow`: Config object do define vulnerabilities that have been accessed as ok to ignore. _(type: Object)_

- `allow[CVE]`: Module and effected modules that are allowed to be ignored for CVE. _(type: Array)_

- 'allow[CVE][i].name`: Name of the module against which the CVE is reported. _(type: String)_

- 'allow[CVE][i].effects: Modules that include the module againts which the CVE is reported. _(type: Array)_

### Example

A simple npcheck configuration file.

```json
{
  "modules": [
    {
      "name": "express",
      "npmLink": "https://www.npmjs.com/package/express"
    }
  ],
  "licenses": {
    "allow": ["MIT", "Apache-2.0"],
    "rules": {}
  },
  "citgm": {
    "skip": ["rhea"]
  },
  "audit": {
    "allow": {
      "CVE-2022-0235": [{
        "name": "node-fetch",
        "effects": ["opencollective"]
      }]
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

**no-errors**

Treats all errors as warnings.

**help**

Shows the below help.

```sh
Usage: npcheck [options]

Options:
  --help                Show help                                      [boolean]
  --version             Show version number                            [boolean]
  --github-token        Custom GitHub token provided to the API for resources
                        (env variable GITHUB_TOKEN is also an option)
                                                            [string] [default: null]
  --no-errors           Treats every error as a warning     [boolean] [default: false]
```
