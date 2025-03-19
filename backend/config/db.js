const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect to Database successfully");
    } catch (err) {
        console.error("MongoDB connection Failed:", err);
        process.exit(1); 
    }
};

module.exports = connectDB;
