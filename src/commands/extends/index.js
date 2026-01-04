const h = require("../../helpers/index.js");

module.exports = (argv) => {
    if (argv.class.slice(0, 1) !== "L") {
        argv.class = h.javaClassToSmali(argv.class);
    }

    const className = argv.class;

    h.search(`\\.super ${className}`).then(result => {
        console.log(result.response);
    });
};
