# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.1](https://www.github.com/nodeshift/npcheck/compare/v0.4.0...v0.4.1) (2021-12-03)


### Bug Fixes

* update jest ([4e799ec](https://www.github.com/nodeshift/npcheck/commit/4e799ec1c096709b277e2e35331141fcefff027e))

## [0.4.0](https://www.github.com/nodeshift/npcheck/compare/v0.3.0...v0.4.0) (2021-12-03)


### Features

* add a check for a default number of dependencies ([05f353c](https://www.github.com/nodeshift/npcheck/commit/05f353c289a73742d9ef88ab71eff3a390e91a35))
* checks if pkg is using git instead of npm ([18e425d](https://www.github.com/nodeshift/npcheck/commit/18e425df4944c2202bd19fd7181ecad22b9bd08f))


### Bug Fixes

* upgrade axios from 0.22.0 to 0.24.0 ([4f57f5e](https://www.github.com/nodeshift/npcheck/commit/4f57f5ea9ff20e94819b8f2999df61c88697446d))
* upgrade eslint-plugin-import from 2.25.2 to 2.25.3 ([0372e27](https://www.github.com/nodeshift/npcheck/commit/0372e277b50859ad360f7745a228b54511e38372))

## [0.3.0](https://www.github.com/nodeshift/npcheck/compare/v0.2.0...v0.3.0) (2021-11-24)


### Features

* small readability improvement on the summary ([80996e7](https://www.github.com/nodeshift/npcheck/commit/80996e7b66f4bfd29308b314f9fe6caf7dcfe3bd))

## [0.2.0](https://www.github.com/nodeshift/npcheck/compare/v0.1.19...v0.2.0) (2021-11-19)


### Features

* upgrade @npmcli/arborist from 0.0.0 to 2.8.3 ([#79](https://www.github.com/nodeshift/npcheck/issues/79)) ([1d34b0a](https://www.github.com/nodeshift/npcheck/commit/1d34b0a80b56a8d7cc6cb6b0426bb53b7a2661a3))
* upgrade @npmcli/arborist from 2.9.0 to 3.0.0 ([#85](https://www.github.com/nodeshift/npcheck/issues/85)) ([5ba9066](https://www.github.com/nodeshift/npcheck/commit/5ba90662f7820a83dca01f51ee85d5b891169a7f))


### Bug Fixes

* update security advisory data endpoint ([fc82dd3](https://www.github.com/nodeshift/npcheck/commit/fc82dd3410db6d27876a28a36186872e666ed143))
* upgrade @npmcli/arborist from 2.8.3 to 2.9.0 ([#83](https://www.github.com/nodeshift/npcheck/issues/83)) ([147f899](https://www.github.com/nodeshift/npcheck/commit/147f899b18e77e03283abe5bbbfab9826d4a8e85))
* upgrade axios from 0.21.3 to 0.21.4 ([#74](https://www.github.com/nodeshift/npcheck/issues/74)) ([a8448ee](https://www.github.com/nodeshift/npcheck/commit/a8448eefd127b88b0f47e84038a3d3037f7f98c1))
* upgrade axios from 0.21.4 to 0.22.0 ([#86](https://www.github.com/nodeshift/npcheck/issues/86)) ([c0ef7cc](https://www.github.com/nodeshift/npcheck/commit/c0ef7cc3eaceea245690f71186e6cf6870bbab96))
* upgrade date-fns from 2.23.0 to 2.24.0 ([#81](https://www.github.com/nodeshift/npcheck/issues/81)) ([977cff0](https://www.github.com/nodeshift/npcheck/commit/977cff0b4cb7096d6e9942e8a7656fd3a421767e))
* upgrade date-fns from 2.24.0 to 2.25.0 ([#87](https://www.github.com/nodeshift/npcheck/issues/87)) ([ca5fcb8](https://www.github.com/nodeshift/npcheck/commit/ca5fcb8436dae2da5a4a9ffe38b016df1450ab0a))
* upgrade eslint-plugin-import from 2.24.0 to 2.24.2 ([#80](https://www.github.com/nodeshift/npcheck/issues/80)) ([7ffa70f](https://www.github.com/nodeshift/npcheck/commit/7ffa70f4136f8ad5a0b0a29a7173e7ac3a25718d))
* upgrade eslint-plugin-import from 2.24.2 to 2.25.2 ([#89](https://www.github.com/nodeshift/npcheck/issues/89)) ([ef64837](https://www.github.com/nodeshift/npcheck/commit/ef648370c5b6396e6d4b6af3087f0c4eca0ba8ce))
* upgrade standard-version from 9.3.1 to 9.3.2 ([#90](https://www.github.com/nodeshift/npcheck/issues/90)) ([7358406](https://www.github.com/nodeshift/npcheck/commit/7358406bbe5d8cedab043d8115e71d1c3d9b4b33))

### [0.1.19](https://github.com/nodeshift/npcheck/compare/v0.1.18...v0.1.19) (2021-09-13)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([208cc8d](https://github.com/nodeshift/npcheck/commit/208cc8d15b7776736f1a7a8d7a257a9fe5ceefba))

### [0.1.18](https://github.com/nodeshift/npcheck/compare/v0.1.17...v0.1.18) (2021-09-01)


### Features

* add community CITGM checks ([#64](https://github.com/nodeshift/npcheck/issues/64)) ([7ceeced](https://github.com/nodeshift/npcheck/commit/7ceeced4549ab2bc8bb455b52bea21b2ece7f436))


### Bug Fixes

* cache GitHub API requests by full URL ([#65](https://github.com/nodeshift/npcheck/issues/65)) ([ada7116](https://github.com/nodeshift/npcheck/commit/ada71160a746a0e0e541346931de6a73c4d7ee95))
* clean up env directory after failure ([#61](https://github.com/nodeshift/npcheck/issues/61)) ([611aeb0](https://github.com/nodeshift/npcheck/commit/611aeb055d3bedc3b5b5b7ac1a86275d913a903e))
* return response data for cache hits ([#62](https://github.com/nodeshift/npcheck/issues/62)) ([4b8f540](https://github.com/nodeshift/npcheck/commit/4b8f5404e8b57f68f1609d1283b45444542b99c4))

### [0.1.17](https://github.com/nodeshift/npcheck/compare/v0.1.16...v0.1.17) (2021-08-05)


### Features

* adding typescript typings plugin ([#51](https://github.com/nodeshift/npcheck/issues/51)) ([4da2c41](https://github.com/nodeshift/npcheck/commit/4da2c41fdbc8e5758ef341c1783d154bf6687136))

### [0.1.16](https://github.com/nodeshift/npcheck/compare/v0.1.15...v0.1.16) (2021-07-28)

### [0.1.15](https://github.com/nodeshift/npcheck/compare/v0.1.14...v0.1.15) (2021-07-08)


### Bug Fixes

* license field issue ([#38](https://github.com/nodeshift/npcheck/issues/38)) ([5fb15e7](https://github.com/nodeshift/npcheck/commit/5fb15e7cd40ee12f0686666ab6d142f9d52e63db))

### 0.1.14 (2021-07-07)


### Features

* adding initial test structure ([#4](https://github.com/nodeshift/npcheck/issues/4)) ([e6281df](https://github.com/nodeshift/npcheck/commit/e6281df6e803ced9c6d57460821af7d8a431480e))
* changelog with standard-version ([#37](https://github.com/nodeshift/npcheck/issues/37)) ([12189e3](https://github.com/nodeshift/npcheck/commit/12189e3a506f6028742877c84067df07b33101a2))
