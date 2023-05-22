const mongoose = require('mongoose');
const hashingSchema = mongoose.Schema({
    password: String
}, {
    versionKey: false
})
const HashingModel = mongoose.model("hashedpwds", hashingSchema)
module.exports = { HashingModel };