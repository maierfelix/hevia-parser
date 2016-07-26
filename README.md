<h1 align="center">Hevia</h1>

<div align="center">
  <strong>A Swift Parser, written in ES6.</strong>
</div>

<br/>

<div align="center">
  <a href="https://travis-ci.org/maierfelix/Hevia">
    <img src="https://img.shields.io/travis/maierfelix/Hevia/master.svg?style=flat-square" alt="Build Status" />
  </a>
  <a href="https://swift.org/blog/swift-3-0-release-process/">
    <img src="https://img.shields.io/badge/Swift-3.0-blue.svg?style=flat-square" alt="Swift Version" />
  </a>
  <a href="https://www.npmjs.com/package/hevia">
    <img src="https://img.shields.io/npm/v/hevia.svg?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square" alt="API Stability" />
  </a>
</div>

## Installation

```sh
npm install hevia
```

Or clone the source:

```sh
git clone https://github.com/maierfelix/hevia.git
```

## Getting started

#### tokenize
Use `tokenize(str)` to tokenize a string
```js

let tokens = hevia.tokenize("var a:Int = 10"); // returns array of tokens
```

#### parse
Use `parse(tokens)` to parse an array of tokens
```js

let ast = hevia.parse(tokens); // returns ast
```
