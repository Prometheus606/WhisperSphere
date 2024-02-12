const nounce = require("./nouns")
const adjectives = require("./adjectives")

function generateRandomUserName() {
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nounce[Math.floor(Math.random() * nounce.length)]}`
}

module.exports = generateRandomUserName