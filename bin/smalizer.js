#!/usr/bin/env node

const yargs = require("yargs/yargs")(process.argv.slice(2));
const commands = require("../src/commands/index.js");

const argv = yargs
    .command("hook [call]", "Hook method call in frida")
    .command("implements [interface]", "Find classes that implement interface")
    .command("extends [class]", "Find classes that extend class")
    .help()
    .alias("help", "h")
    .demandCommand(1, "You need at least one command before moving on")
    .argv;

let running = false;

argv._.forEach(command => {

    if (commands[command] !== undefined && running == false) {
        running = true;
        commands[command](argv);
    }

});
