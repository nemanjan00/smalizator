const utils = require("../../helpers/utils.js");
const fridaCallTemplate = require("../../templates/frida_hook/index.js");

// Formats: "java.lang.String", "int", etc.
const formatOverloadArgs = (args) => {
    return args.map(arg => `		"${arg.java}"`).join(",\n");
};

// Formats: arg1, // java.lang.String
const formatImplementationArgs = (args) => {
    return args.map((arg, i) => {
        const comma = i < args.length - 1 ? "," : "";
        return `		arg${i + 1}${comma} // ${arg.java}`;
    }).join("\n");
};

// Formats: arg1, // java.lang.String
const formatCallArgs = (args) => {
    return args.map((arg, i) => {
        const comma = i < args.length - 1 ? "," : "";
        return `			arg${i + 1}${comma} // ${arg.java}`;
    }).join("\n");
};

module.exports = (methodInfo) => {
    const {
        directive,
        signature,
        classOrigin,
        classVarName,
        methodName,
        methodVarName,
        methodArgs
    } = methodInfo;

    const methodData = {
        smali_signature: directive,
        method_signature: signature,
        class_name: classOrigin,
        class_var: classVarName,
        method_name: methodName,
        method_var: methodVarName,
        overload_args: formatOverloadArgs(methodArgs),
        implementation_args: formatImplementationArgs(methodArgs),
        call_args: formatCallArgs(methodArgs)
    };

    return utils.renderTemplate(fridaCallTemplate, methodData);
};
