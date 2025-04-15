const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "employee", "customer"], default: "employee" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);