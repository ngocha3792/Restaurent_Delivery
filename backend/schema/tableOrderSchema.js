const mongoose = require("mongoose")

// Bàn
const tableOrderSchema = new mongoose.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    waiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    orderTime: { type: Date, default: Date.now },
    items: [
      {
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        quantity: Number,
        status: { type: String, enum: ["Ordered", "Served"], default: "Ordered" }
      }
    ],
    customerFeedback: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  
module.exports = mongoose.model("TableOrder", tableOrderSchema);