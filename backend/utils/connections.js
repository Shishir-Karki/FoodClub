const mongoose = require('mongoose');
require("dotenv").config();

exports.connectMongoDB = () => {
    const connectionUrl = `${process.env.MONGODB_URL}/${process.env.MONGO_DB}`;
    mongoose
        .connect(connectionUrl)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));
};

