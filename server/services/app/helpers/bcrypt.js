const bcrypt = require("bcrypt")

const hashPassword = (plaintext) => {
    return bcrypt.hashSync(plaintext, 8)
}

const comparePasswordWithHash = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hashPassword,
    comparePasswordWithHash
}