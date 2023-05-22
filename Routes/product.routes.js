const express = require('express');
const { User } = require('../Models/User.model');
const ProductRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Authentication } = require('../Middleware/Authentication');
const { Product } = require('../Models/Product.model');
const { Blacklist } = require('../Models/Blacklist.model');
require('dotenv').config();
ProductRouter.post("/signup", async (req, res) => {
    const { email, name, password, role } = req.body;
    try {
        const userInfo = await User.findOne({ email: email });
        if (userInfo) {
            console.log(userInfo)
            return res.status(404).json({ Err: "User already exists" })
        }
        bcrypt.hash(password, 5, async function (err, hash) {
            if (err) {
                return res.status(404).json({ "Msg": "Unsuccesfull" });
            }
            if (role) {
                const newUser = new User({ email: email, name: name, password: hash, role: role })
                await newUser.save();
                res.status(200).json({ msg: "Registerd!!!!" })
            }
            else {
                const newUser = new User({ email: email, name: name, password: hash })
                await newUser.save();
                res.status(200).json({ msg: "Registerd!!!!" })
            }
        });

    }
    catch (error) {
        res.status(404).json({ Err: "Unsucessfull", err: error })

    }
})
ProductRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userInfo = await User.findOne({ email: email });
        if (!userInfo) {
            return res.status(404).json({ Err: "Wrong email/User not exist" })
        }
        bcrypt.compare(password, userInfo.password, function (err, result) {
            if (err) {
                res.status(404).json({ Err: "Unsucessfull", err: err })
                return
            }
            if (result) {
                const token = jwt.sign({ userID: userInfo._id }, process.env.JWT_KEY, { expiresIn: 60 });
                const Refreshtoken = jwt.sign({ userID: userInfo._id }, process.env.JWT_KEY, { expiresIn: 60 * 5 });
                res.status(200).json({ token: token, Refreshtoken: Refreshtoken })
            }
            else {
                res.status(404).json({ Err: "Wrong Password" })
            }
        });
    } catch (error) {
        res.status(404).json({ Err: "Unsucessfull", err: error })
    }
})
ProductRouter.get("/products", Authentication, async (req, res) => {
    try {
        res.send(await Product.find());
    } catch (error) {
        res.status(404).json({ Err: "Unsucessfull", err: error })
    }
})
ProductRouter.delete("/deleteproducts/:id", Authentication, async (req, res) => {
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_KEY);
    const user = await User.findOne({ _id: decoded.userID });
    if (user.role != "seller") {
        res.status(404).json({ Err: "Unsucessfull You're not a Seller" })
        return;
    }
    else {
        try {
            const { id } = req.params;
            await Product.findByIdAndDelete(id);
            res.status(200).json({ msg: "Product Deleted!!!!" })
        } catch (error) {
            res.status(404).json({ Err: "Unsucessfull", err: error })

        }
    }
})
ProductRouter.post("/addproducts", Authentication, async (req, res) => {
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_KEY);
    const user = await User.findOne({ _id: decoded.userID });
    if (user.role != "seller") {
        res.status(404).json({ Err: "Unsucessfull You're not a Seller" })
        return;
    }
    else {
        try {
            await Product.insertMany(req.body);
            res.status(200).json({ msg: "Product Added!!!!" })
        } catch (error) {
            res.status(404).json({ Err: "Unsucessfull", err: error })
        }
    }
})
ProductRouter.post("/logout", async (req, res) => {
    try {
        const { token } = req.query;
        let newToken = new Blacklist({ token: token });
        await newToken.save();
        res.status(200).json({ msg: "Logged Out" })

    } catch (error) {
        res.status(404).json({ Err: "Unsucessfull", err: error })

    }
})
ProductRouter.post("/refresh", async (req, res) => {
    const decoded = jwt.verify(req.query.refreshtoken, process.env.JWT_KEY);
    const user = await User.findOne({ _id: decoded.userID });
    if (!user) {
        return res.status(404).json({ Err: "Refresh token is wrong" })
    }
    else {
        const token = jwt.sign({ userID: user._id }, process.env.JWT_KEY, { expiresIn: 60 });
        const Refreshtoken = jwt.sign({ userID: user._id }, process.env.JWT_KEY, { expiresIn: 60 * 5 });
        res.status(200).json({ token: token, Refreshtoken: Refreshtoken })
    }
})
module.exports = { ProductRouter };