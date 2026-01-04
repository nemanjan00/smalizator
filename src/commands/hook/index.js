const beautify = require("../../beautify/index.js");
const helpers = require("../../helpers/index.js");
const fridaCallTemplate = require("../../templates/frida_hook/index.js");

const sanitizeVariableName = (name) => {
    // Remove invalid characters like <, >, -, etc.
    return name.replace(/[^a-zA-Z0-9_$]/g, "_");
};

// Formats: "java.lang.String", "int", etc.
const formatOverloadArgs = (args) => {
    return args.map(arg => `		"${arg.java}"`).join(",\n");
};

// Formats: arg1, // java.lang.String
const formatImplementationArgs = (args) => {
    return args.map((arg, i) => `		arg${i + 1}, // ${arg.java}`).join("\n");
};

// Formats: arg1, // java.lang.String
const formatCallArgs = (args) => {
    return args.map((arg, i) => `			arg${i + 1}, // ${arg.java}`).join("\n");
};

module.exports = (argv) => {
    const directive = argv.call.trim();
    const instruction = directive.split(" ")[0];

    const operands = directive.slice(instruction.length).trim();
    const signature = operands.split(",").slice(-1)[0].trim();
    const classOrigin = helpers.smaliClassToJava(signature.split("->")[0]);
    let methodName = signature.split("->")[1].split("(")[0].trim();

    if (methodName === "<init>") {
        methodName = "$init";
    }

    const methodType = instruction.split("-")[1];
    const smaliArguments = signature.split("(")[1].split(")")[0];

    const methodArgs = [];
    let isParsingClass = false;
    let className = "";
    let isVoid = false;
    let arrayLevel = 0;

    smaliArguments.split("").map(char => {
        if (isParsingClass) {
            className += char;

            if (char == ";") {
                isParsingClass = false;
                methodArgs.push({
                    java: helpers.smaliClassToJava(className) + Array(arrayLevel).fill("[]").join(""),
                    smali: Array(arrayLevel).fill("[").join("") + className,
                    arrayLevel,
                    isPrimitive: false
                });
                className = "";
                arrayLevel = 0;
            }

            return;
        }

        if (char == "[") {
            arrayLevel++;
            return;
        }

        if (char == "L") {
            isParsingClass = true;
            className += char;
            return
        }

        if (char == "V") {
            isVoid = true;
            return;
        }

        if (helpers.primitiveNames[char]) {
            methodArgs.push({
                java: helpers.primitiveNames[char] + Array(arrayLevel).fill("[]").join(""),
                smali: Array(arrayLevel).fill("[").join("") + char,
                arrayLevel,
                isPrimitive: true
            });
            arrayLevel = 0;
        }
    });

    // Variables construction
    const classVarName = "Class" + sanitizeVariableName(classOrigin.split(".").join(""));
    const methodVarName = "Func" + sanitizeVariableName(classOrigin.split(".").slice(-1)[0]) + sanitizeVariableName(methodName);

    const methodData = {
        smali_signature: directive,
        method_signature: signature, // Or just the method part if preferred, but usually the full signature is useful
        class_name: classOrigin,
        class_var: classVarName,
        method_name: methodName,
        method_var: methodVarName,
        overload_args: formatOverloadArgs(methodArgs),
        implementation_args: formatImplementationArgs(methodArgs),
        call_args: formatCallArgs(methodArgs)
    };

    const code = helpers.renderTemplate(fridaCallTemplate, methodData);
    beautify(code).then(console.log);
};
