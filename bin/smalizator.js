#!/usr/bin/env node

const yargs = require("yargs/yargs");
const inquirer = require("inquirer");

const main = async () => {
	const argv = yargs(process.argv.slice(2))
		.command(require("../src/commands/hook/index.js"))
		.command(require("../src/commands/implements/index.js"))
		.command(require("../src/commands/extends/index.js"))
		.scriptName("smalizator")
		.help()
		.alias("help", "h")
		// Remove strictly required demandCommand to allow running without args for wizard
		.argv;

	// If no command provided, run interactive mode
	if (argv._.length === 0) {
		console.log("Welcome to Smalizator Interactive Mode!\n");
		const { commandType } = await inquirer.prompt([
			{
				type: "list",
				name: "commandType",
				message: "What do you want to do?",
				choices: ["Hook Method", "Find Implementations", "Find Extensions"]
			}
		]);

		if (commandType === "Hook Method") {
			const { hookType, signature } = await inquirer.prompt([
				{
					type: "list",
					name: "hookType",
					message: "Which type of hook?",
					choices: ["Frida", "Xposed"]
				},
				{
					type: "input",
					name: "signature",
					message: "Enter method signature (e.g. invoke-direct {v0}, LPkg/Cls;->method()V):",
					validate: input => input.includes("->") ? true : "Invalid signature format"
				}
			]);

			const hookCommand = require("../src/commands/hook/index.js");
			// Construct argv-like object
			const wizardArgv = {
				call: signature,
				xposed: hookType === "Xposed"
			};
			hookCommand.handler(wizardArgv);
		} else if (commandType === "Find Implementations") {
			const { interfaceName } = await inquirer.prompt([
				{
					type: "input",
					name: "interfaceName",
					message: "Enter interface name (e.g. Ljava/lang/Runnable;):"
				}
			]);
			require("../src/commands/implements/index.js").handler({ interface: interfaceName });
		} else if (commandType === "Find Extensions") {
			const { className } = await inquirer.prompt([
				{
					type: "input",
					name: "className",
					message: "Enter class name (e.g. Ljava/lang/Object;):"
				}
			]);
			require("../src/commands/extends/index.js").handler({ class: className });
		}
	}
};

main();
