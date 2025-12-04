const express = require("express");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`)
})

const dbConnect = require("./config/database");
dbConnect();