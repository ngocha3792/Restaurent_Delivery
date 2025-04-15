const mongoose = require("mongoose");

//Nhập, xuất kho
const inventoryLogSchema = new mongoose.Schema({
  type: { type: String, enum: ["import", "export"], required: true }, 
  notes: { type: String },
  items: [{
    ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    totalCost: { type: Number }
  }],
  totalAmount: { type: Number, default: 0 }, 
  date: { type: Date, default: Date.now },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: false },
});
module.exports = mongoose.model("InventoryLog", inventoryLogSchema);