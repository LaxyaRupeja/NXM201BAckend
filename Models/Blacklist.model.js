const mongoose = require('mongoose');
const blacklistSchema = mongoose.Schema({
    token: String,
}, {
    versionKey: false
})
const Blacklist = mongoose.model("blacklist", blacklistSchema)
module.exports = { Blacklist };