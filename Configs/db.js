require('dotenv').config();
const mongoose = require('mongoose');
const connection = () => {
    try {
        mongoose.connect(process.env.mongoURL);
        console.log("Connected to DB");
        console.log("Server running at 8080")
    }
    catch (err) {
        console.log("Some error occurred while connecting to db", err)
    }
}
module.exports = { connection };