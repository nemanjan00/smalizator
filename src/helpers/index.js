const exec = require("../shell/index.js");

const primitiveNames = {
    "Z": "boolean",
    "B": "byte",
    "S": "short",
    "C": "char",
    "I": "int",
    "J": "long",
    "F": "float",
    "D": "double"
};

const smaliClassToJava = (className) => {
    if (className.startsWith("L") && className.endsWith(";")) {
        return className.substring(1, className.length - 1).replace(/\//g, ".");
    }

    return className;
};

const javaClassToSmali = (className) => {
    return "L" + className.replace(/\./g, "/") + ";";
};

const renderTemplate = (template, data) => {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
};

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

const javaCallFormat = (args) => {
    return args.map((arg, index) => `${arg.java} arg${index + 1}`).join(", ");
};

const sanitizeVariableName = (name) => {
    // Remove invalid characters like <, >, -, etc.
    return name.replace(/[^a-zA-Z0-9_$]/g, "_");
};

const parseSmaliArguments = (smaliArguments) => {
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
                    java: smaliClassToJava(className) + Array(arrayLevel).fill("[]").join(""),
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

        if (primitiveNames[char]) {
            methodArgs.push({
                java: primitiveNames[char] + Array(arrayLevel).fill("[]").join(""),
                smali: Array(arrayLevel).fill("[").join("") + char,
                arrayLevel,
                isPrimitive: true
            });
            arrayLevel = 0;
        }
    });

    return methodArgs;
};

module.exports = {
    primitiveNames,
    smaliClassToJava,
    javaClassToSmali,
    renderTemplate,
    search,
    javaCallFormat,
    sanitizeVariableName,
    parseSmaliArguments
};
