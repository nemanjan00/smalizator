const beautify = require("../../beautify/index.js");
const smaliHelpers = require("../../helpers/smali.js");
const utils = require("../../helpers/utils.js");
const fridaGenerator = require("../../generators/frida/index.js");
const xposedGenerator = require("../../generators/xposed/index.js");

exports.command = "hook [call]";
exports.describe = "Hook method call in frida";
exports.builder = (yargs) => {
	return yargs.option("xposed", {
		alias: "x",
		type: "boolean",
		description: "Generate Xposed hook instead of Frida"
	});
};

exports.handler = (argv) => {
	if (!argv.call) {
		console.error("Error: No method signature provided.");
		return;
	}

	// 1. Parse Input
	const directive = argv.call.trim();
	const instruction = directive.split(" ")[0]; // e.g., invoke-direct/range
	const operands = directive.slice(instruction.length).trim(); // e.g., {v0}, LX/3jy;-><init>(...)
	const signature = operands.split(",").slice(-1)[0].trim(); // e.g., LX/3jy;-><init>(...)

	// 2. Parse Signature Parts
	const classPart = signature.split("->")[0];
	const methodPart = signature.split("->")[1];
	const rawMethodName = methodPart.split("(")[0].trim();
	const smaliArgs = methodPart.split("(")[1].split(")")[0];
	const returnType = methodPart.split(")")[1];

	// 3. Process Data
	const classOrigin = smaliHelpers.smaliClassToJava(classPart);
	const methodArgs = smaliHelpers.parseSmaliArguments(smaliArgs);
	const isVoid = returnType === "V";

	let methodName = rawMethodName;
	if (methodName === "<init>") {
		methodName = "$init";
	}

	const classVarName = "Class" + utils.sanitizeVariableName(classOrigin.split(".").join(""));
	const methodVarName = "Func" + utils.sanitizeVariableName(classOrigin.split(".").slice(-1)[0]) + utils.sanitizeVariableName(methodName);

	const methodInfo = {
		directive,
		instruction,
		signature,
		classOrigin,
		methodName,
		classVarName,
		methodVarName,
		methodArgs,
		isVoid
	};

	// 4. Generate Code
	if (argv.xposed) {
		const code = xposedGenerator(methodInfo);
		beautify(code, "java").then(console.log);
	} else {
		const code = fridaGenerator(methodInfo);
		beautify(code).then(console.log);
	}
};
