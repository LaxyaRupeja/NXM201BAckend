const express = require('express');
const EncryptRouter = express.Router();
const jwt = require('jsonwebtoken');
const { EncryptModel } = require('../Models/Encrypt.model');
require('dotenv').config();
EncryptRouter.post("/encryptmypwd", async (req, res) => {
    try {
        const encryptedPassword = jwt.sign({ password: req.body.password }, process.env.JWT_KEY);
        let newPWD = new EncryptModel({ password: encryptedPassword });
        await newPWD.save();
        res.status(200).json({ msg: "Password stored successfully in encrypted form" })
    } catch (error) {
        console.log(error)
        res.status(404).json({ Err: "Unsucessfull", err: error })
    }
})
EncryptRouter.get("/getmypwd", async (req, res) => {
    const { id } = req.query;
    const pass = await EncryptModel.findOne({ _id: id })
    if (!pass) { return res.status(404).json({ err: "Password not find" }) }
    try {
        console.log(pass)
        const decoded = jwt.verify(pass.password, process.env.JWT_KEY);
        res.status(200).json({ Password: decoded.password })
    }
    catch (err) {
        console.log(err)
        res.status(404).json({ Err: "Unsucessfull", err: err })
    }
})

module.exports = { EncryptRouter };