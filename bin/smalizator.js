#!/usr/bin/env node

const yargs = require("yargs/yargs")(process.argv.slice(2));

yargs
    .command(require("../src/commands/hook/index.js"))
    .command(require("../src/commands/implements/index.js"))
    .command(require("../src/commands/extends/index.js"))
    .scriptName("smalizator")
    .help()
    .alias("help", "h")
    .demandCommand(1, "You need at least one command before moving on")
    .argv;
