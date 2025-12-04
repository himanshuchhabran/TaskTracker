const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect =() =>{
    mongoose.connect(process.env.DB_URL,{})
    .then(()=> console.log("DB Connected successfully"))
    .catch((error)=>
    console.log(error)
)
}

module.exports = dbConnect;