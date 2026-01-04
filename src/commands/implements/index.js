const helpers = require("../../helpers/index.js");

module.exports = (argv) => {
    if (argv.interface.slice(0, 1) !== "L") {
        argv.interface = helpers.javaClassToSmali(argv.interface);
    }

    const interface = argv.interface;

    helpers.search(`\\.implements ${interface}`).then(result => {
        console.log(result.response);
    });
};
