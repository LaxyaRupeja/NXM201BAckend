const express = require('express');
const { HashingModel } = require('../Models/Hashing.model');
const HashingRouter = express.Router();
const bcrypt = require('bcrypt');
HashingRouter.post("/hashmypwd", async (req, res) => {
    try {
        const myPlaintextPassword = req.body.password;
        bcrypt.hash(myPlaintextPassword, 6, async function (err, hash) {
            if (err) {
                return res.status(404).json({ Err: "Unsucessfull", err: error })
            }
            let newPWD = new HashingModel({ password: hash });
            await newPWD.save();
            res.status(200).json({ msg: "Hash of the Password stored successfully." })
        });
    } catch (error) {
        console.log(error)
        res.status(404).json({ Err: "Unsucessfull", err: error })
    }
})
HashingRouter.get("/verifymypwd", async (req, res) => {
    try {
        const { id, password } = req.body;
        const pass = await HashingModel.findOne({ _id: id })
        if (!pass) { return res.status(404).json({ err: "Password not find" }) }
        bcrypt.compare(password, pass.password, function (err, result) {
            res.status(200).json({ Result: result })
        });
    }
    catch (err) {
        console.log(err)
        res.status(404).json({ Err: "Unsucessfull", err: err })
    }
})




module.exports = { HashingRouter };