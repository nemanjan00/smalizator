# smalizator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Smalizator is a CLI tool for Frida hooking and Smali reverse engineering.

## Content

<!-- vim-markdown-toc GFM -->

* [Features](#features)
* [Installation / update](#installation--update)
* [Usage](#usage)
* [Developers guide](#developers-guide)
  * [Yarn package manager](#yarn-package-manager)
  * [Coding Style](#coding-style)
* [Authors](#authors)

<!-- vim-markdown-toc -->

## Features

* **Hook Generation**: Generate Frida hooks for methods easily.
* **Interface Search**: Find classes that implement a specific interface.
* **Extension Search**: Find classes that extend a specific class.

## Installation / update

```bash
sudo npm install -g smalizator
```

## Usage

**Generate a Frida hook:**
```bash
smalizator hook "invoke-virtual {v0}, Lcom/example/MyClass;->myMethod(I)V"
```

**Find implementations of an interface:**
```bash
smalizator implements Ljava/lang/Runnable;
```

**Find extensions of a class:**
```bash
smalizator extends Ljava/lang/Object;
```

## Developers guide

### Yarn package manager

For this project development, we are using faster, [yarn](https://yarnpkg.com/lang/en/) package manager.

To install it, run:

```bash
sudo npm install -g yarn
```

After that, you need to install dependencies, using:

```bash
yarn
```

### Coding Style

Coding style of this project emphasizes readability and accessibility.
* **Tabs**: We use tabs for indentation.
* **Spacing**: Logic blocks are separated by empty lines.

## Authors

* [Nemanja Nedeljković](https://github.com/nemanjan00)
