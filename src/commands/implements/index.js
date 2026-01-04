const { search } = require("../../helpers/search.js");

exports.command = "implements [interface]";
exports.describe = "Find classes that implement interface";
exports.builder = {};

exports.handler = (argv) => {
	if (argv.interface.slice(0, 1) !== "L") {
		console.log("Please use smali class notation (Lpackage/name;)");
		return;
	}

	const searchString = `.implements ${argv.interface}`;

	search(searchString).then(response => {
		console.log(response.stdout);
	});
};
