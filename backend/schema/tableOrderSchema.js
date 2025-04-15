const mongoose = require("mongoose")

// Bàn
const tableOrderSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
    unique: true
  },
  waiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  orderTime: {
    type: Date,
    default: Date.now
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
    quantity: Number,
    status: {type: String, enum: ["Ordered","Cooking", "Served"], default: "Ordered"},
    startedCookingAt:{type: Date}

  }],
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Ordered, Served"],
    default: "Ordered"
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Pending"],
    default: "Unpaid"
  },
  customerFeedback: {
    type: String
  },
});

module.exports = mongoose.model("TableOrder", tableOrderSchema);
