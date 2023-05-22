const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    email: String,
    name: String,
    password: String,
    role: { type: String, enum: ['seller', 'buyer'], default: 'buyer' }
}, {
    versionKey: false
})
const User = mongoose.model("user", UserSchema)
module.exports = { User };