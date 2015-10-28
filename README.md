# Leibniz Frontend

[![Build Status][travis-badge]][travis]

  TODO: Introduction

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)<br>
  Make sure that your node version is at least 0.12.* with `node -v`. If your distribution
  comes with an older version, update with _n_ following these steps:
  * `sudo npm cache clean -f`
  * `sudo npm install -g n`
  * `sudo n stable`
* [Bower](http://bower.io/): `sudo npm install bower -g`
* [Ember CLI](http://www.ember-cli.com/): `sudo npm install ember-cli -g`
* [PhantomJS](http://phantomjs.org/): `sudo npm install phantomjs -g`
* Optional: SCSS linting requires Ruby gem scss-lint. Install with `gem install scss_lint` (yes, with an underscore).
  Since ember-cli-scss-lint currently ignores exludes, just use `scss-lint app/styles` for meaningful output.

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying
TODO: How to deploy

[travis]: https://travis-ci.org/subugoe/leibniz-frontend
[travis-badge]: https://travis-ci.org/subugoe/leibniz-frontend.svg?branch=develop
