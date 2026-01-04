const { expect } = require('chai');
const fridaGenerator = require('../src/generators/frida/index.js');
const xposedGenerator = require('../src/generators/xposed/index.js');

describe('Generators', () => {
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

    describe('Frida Generator', () => {
        it('should generate valid Frida script structure', () => {
            const output = fridaGenerator(methodInfo);
            expect(output).to.include('Java.perform');
            expect(output).to.include('Java.use("X.3jy")');
            expect(output).to.include('.$init.overload(');
            expect(output).to.include('"int"');
        });
    });

    describe('Xposed Generator', () => {
        it('should generate valid Xposed hook structure for constructors', () => {
            const output = xposedGenerator(methodInfo);
            expect(output).to.include('XposedHelpers.findAndHookConstructor');
            expect(output).to.include('X.3jy');
            expect(output).to.not.include('"$init"');
            expect(output).to.include('int.class');
        });
    });
});
