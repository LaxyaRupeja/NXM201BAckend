const jwt = require('jsonwebtoken');
const { Blacklist } = require('../Models/Blacklist.model');
const Authentication = async (req, res, next) => {
    const token = req.headers.authorization;
    const BlacklistArr = await Blacklist.findOne({ token: token });
    if (BlacklistArr) {
        return res.status(404).json({ "Msg": "User is blacklisted" });
    }
    if (!token) {
        return res.status(404).json({ "Msg": "Please login first" });
    }
    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
        if (err) {
            return res.status(404).json({ "Msg": "Some error encountered/Maybe your token is expired" });
        }
        if (!decoded) {
            return res.status(404).json({ "Msg": "Please login first/Wrong Login Credentials" });
        }
        else {
            next();
        }
    });
}
module.exports = { Authentication }