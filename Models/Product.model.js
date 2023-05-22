const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
    title: String,
    price: Number
}, {
    versionKey: false
})
const Product = mongoose.model("product", ProductSchema)
module.exports = { Product };