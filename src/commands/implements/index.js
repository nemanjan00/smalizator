const h = require("../../helpers/index.js");

module.exports = (argv) => {
    if (argv.interface.slice(0, 1) !== "L") {
        argv.interface = h.javaClassToSmali(argv.interface);
    }

    const interface = argv.interface;

    h.search(`\\.implements ${interface}`).then(result => {
        console.log(result.response);
    });
};
