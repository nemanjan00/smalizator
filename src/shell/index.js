const { spawn } = require("child_process");

module.exports = (command, args, stdin) => {
	return new Promise(resolve => {
		const shell = spawn(command, args);

		let response = "";

		if (stdin) {
			shell.stdin.write(stdin);
			shell.stdin.end();
		}

		shell.stdout.on("data", data => {
			response += data;
		});

		shell.stderr.on("data", data => {
			response += data;
		});

		shell.on("close", (code) => resolve({ response, code }));
	});
};
