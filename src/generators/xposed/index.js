const helpers = require("../../helpers/index.js");
const xposedCallTemplate = require("../../templates/xposed_hook/index.js");

const formatXposedArgs = (args) => {
    return args.map(arg => {
        if (arg.isPrimitive && arg.arrayLevel === 0) {
            return `	${arg.java}.class,`;
        }
        return `	"${arg.java}",`;
    }).join("\n");
};

const formatXposedBeforeArgs = (args) => {
    return args.map((arg, i) => `			// ${arg.java} arg${i + 1} = (${arg.java}) param.args[${i}];`).join("\n");
};

module.exports = (methodInfo) => {
    const {
        classOrigin,
        methodName,
        methodArgs,
        isVoid
    } = methodInfo;

    const isConstructor = methodName === "$init";

    const methodData = {
        class_name: classOrigin,
        xposed_helper: isConstructor ? "findAndHookConstructor" : "findAndHookMethod",
        method_name_arg: isConstructor ? "" : `	"${methodName}",`,
        xposed_args: formatXposedArgs(methodArgs),
        before_hook_args: formatXposedBeforeArgs(methodArgs),
        after_hook_args: `			// ${isVoid ? "void" : "Object"} ret = param.getResult();`
    };

    return helpers.renderTemplate(xposedCallTemplate, methodData);
};
