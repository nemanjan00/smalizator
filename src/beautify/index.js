const exec = require("../shell/index.js");

module.exports = (code, language = "javascript") => {
    return new Promise((resolve) => {
        exec("which", ["bat"]).then((response) => {
            if (response.code !== 0) {
                return resolve(code);
            }

            exec("bat", ["-l", language, "-p", "-f"], code).then(response => {
                resolve(response.response);
            });
        }).catch(() => {
            resolve(code);
        })
    });
};
