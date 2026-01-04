const { search } = require("../../helpers/search.js");

exports.command = "extends [class]";
exports.describe = "Find classes that extend class";
exports.builder = {};

exports.handler = (argv) => {
	if (argv.class.slice(0, 1) !== "L") {
		console.log("Please use smali class notation (Lpackage/name;)");
		return;
	}

	const searchString = `.super ${argv.class}`;

	search(searchString).then(response => {
		console.log(response.stdout);
	});
};
