const randomstring = require("randomstring");

function generateKey(length) {
    // Generiere einen zufälligen Schlüssel mit einer Länge von X Zeichen
    return randomstring.generate({
        length,
        charset: ["alphanumeric", "!?$_-+#:.,;"]
    });
}

module.exports = generateKey

