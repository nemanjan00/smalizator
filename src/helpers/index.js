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

module.exports = {
    primitiveNames,
    smaliClassToJava,
    javaClassToSmali,
    renderTemplate,
    search,
    javaCallFormat
};
