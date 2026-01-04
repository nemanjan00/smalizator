const beautify = require("../../beautify/index.js");
const helpers = require("../../helpers/index.js");
const fridaCallTemplate = require("../../templates/frida_hook/index.js");

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

    const method = {
        class: classOrigin,
        className: classOrigin.split(".").slice(-1)[0],
        methodType,
        methodName,
        isVoid,
        isStatic: (methodType == "static"),
        arguments: methodArgs.map((arg, index) => {
            arg.index = index + 1;
            arg.isLast = (methodArgs.length == index + 1)
            return arg;
        }),
        javaCallFormat: helpers.javaCallFormat(methodArgs)
    };

    // Formatting arguments for the template implementation function
    method.arguments = method.arguments.map((arg, i) => `arg${i}`).join(", ");

    const code = helpers.renderTemplate(fridaCallTemplate, method);
    beautify(code).then(console.log);
};
