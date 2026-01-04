module.exports = `
Java.perform(function() {
    var {{className}} = Java.use("{{class}}");
    {{className}}.{{methodName}}.overload({{javaCallFormat}}).implementation = function({{arguments}}) {
        console.log("{{methodName}} called");
        var ret = this.{{methodName}}({{arguments}});
        return ret;
    };
});
`;
