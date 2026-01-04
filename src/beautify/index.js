const exec = require("../shell/index.js");

module.exports = (code) => {
    return new Promise((resolve) => {
        exec("which", ["bat"]).then((response) => {
            if (response.code !== 0) {
                return resolve(code);
            }

            exec("bat", ["-l", "javascript", "-p", "-f"], code).then(response => {
                resolve(response.response);
            });
        }).catch(() => {
            resolve(code);
        })
    });
};
