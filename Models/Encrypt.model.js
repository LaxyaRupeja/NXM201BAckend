const mongoose = require('mongoose');
const encryptSchema = mongoose.Schema({
    password: String
}, {
    versionKey: false
})
const EncryptModel = mongoose.model("encryptedpwds", encryptSchema)
module.exports = { EncryptModel };