const express = require("express");
const app = express();
const cors = require('cors');

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`)
})

const dbConnect = require("./config/database");
dbConnect();