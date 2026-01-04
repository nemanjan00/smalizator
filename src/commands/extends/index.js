const helpers = require("../../helpers/index.js");

module.exports = (argv) => {
    if (argv.class.slice(0, 1) !== "L") {
        argv.class = helpers.javaClassToSmali(argv.class);
    }

    const className = argv.class;

    helpers.search(`\\.super ${className}`).then(result => {
        console.log(result.response);
    });
};
