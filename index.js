const express = require('express');
const { connection } = require('./Configs/db');
const { EncryptRouter } = require('./Routes/encryption.routes');
const { HashingRouter } = require('./Routes/hashing.routes');
const { ProductRouter } = require('./Routes/product.routes');
const app = express();
app.use(express.json());
app.use("/", EncryptRouter)
app.use("/", HashingRouter)
app.use("/", ProductRouter)
app.listen(8080, connection());
