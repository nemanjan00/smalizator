const exec = require("../shell/index.js");

const search = (pattern) => {
	return new Promise((resolve) => {
		exec("which", ["ag"]).then((result) => {
			if (result.code === 0) {
				exec("ag", ["--color", pattern]).then(res => resolve(res));
			} else {
				console.warn("To start seeing results faster, install silver searcher (ag)");

				// grep -r pattern .
				exec("grep", ["-r", "--color=always", pattern, "."]).then(res => resolve(res));
			}
		});
	});
};

module.exports = {
	search
};
