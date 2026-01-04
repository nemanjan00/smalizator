const hook = require("./hook/index.js");
const implementsCommand = require("./implements/index.js");
const extendsCommand = require("./extends/index.js");

module.exports = {
    hook,
    implements: implementsCommand,
    extends: extendsCommand
};
