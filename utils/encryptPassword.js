const bcrypt = require("bcrypt")

const password = "12345"

const encrypt = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10)

    console.log(passwordHash);
}

encrypt(password)
