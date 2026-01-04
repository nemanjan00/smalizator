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

const parseSmaliArguments = (smaliArguments) => {
    const methodArgs = [];
    let isParsingClass = false;
    let className = "";
    let isVoid = false;
    let arrayLevel = 0;

    if (!smaliArguments) return [];

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
    parseSmaliArguments
};
