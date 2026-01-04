const assert = require('assert');
const fridaGenerator = require('../src/generators/frida/index.js');
const xposedGenerator = require('../src/generators/xposed/index.js');
const smaliHelpers = require('../src/helpers/smali.js');
const utils = require('../src/helpers/utils.js');

console.log("Testing Generators...");

// Mock Data
const signature = "LX/3jy;-><init>(LX/7zK;LX/7zL;I)V";
const directive = "invoke-direct {v0}, " + signature;
const classOrigin = "X.3jy";
const methodName = "$init";
const methodArgs = [
    { java: "X.7zK", smali: "LX/7zK;", arrayLevel: 0, isPrimitive: false },
    { java: "X.7zL", smali: "LX/7zL;", arrayLevel: 0, isPrimitive: false },
    { java: "int", smali: "I", arrayLevel: 0, isPrimitive: true }
];
const classVarName = "ClassX3jy";
const methodVarName = "FuncX3jy$init";

const methodInfo = {
    directive,
    signature,
    classOrigin,
    methodName,
    classVarName,
    methodVarName,
    methodArgs,
    isVoid: true
};

// 1. Test Frida Generator
const fridaOutput = fridaGenerator(methodInfo);
assert.ok(fridaOutput.includes('Java.perform'), 'Frida output should contain Java.perform');
assert.ok(fridaOutput.includes('Java.use("X.3jy")'), 'Frida output should hook correct class');
assert.ok(fridaOutput.includes('.$init.overload('), 'Frida output should overload $init');
assert.ok(fridaOutput.includes('"int"'), 'Frida output should handle primitive int');

// 2. Test Xposed Generator (Constructor)
const xposedOutput = xposedGenerator(methodInfo);
assert.ok(xposedOutput.includes('XposedHelpers.findAndHookConstructor'), 'Xposed output should hook constructor');
assert.ok(xposedOutput.includes('X.3jy'), 'Xposed output should target class');
assert.ok(!xposedOutput.includes('"$init"'), 'Xposed output should NOT pass $init as method name');
assert.ok(xposedOutput.includes('int.class'), 'Xposed output should handle primitive int as .class');

console.log("Generator tests passed.");
