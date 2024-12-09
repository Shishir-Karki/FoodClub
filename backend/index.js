const express = require('express');
const { connectMongoDB } = require('./utils/connections');
const User = require('./models/user');
const server = express();
const authRouter = require("./routes/authRouter")
const foodRouter = require("./routes/foodRouter")
const PORT = process.env.PORT||5000;
const cors = require('cors');


connectMongoDB()
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended:true}))

server.get("/", (req,res)=>{
    res.send("Welcome to the foodclub Api")
});

server.use("/auth", authRouter);
server.use("/food", foodRouter);

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

//

