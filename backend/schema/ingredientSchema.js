const mongoose = require("mongoose")


// Nguyên liệu
const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  stock: { type: Number, required: true, default: 0 }, 
  unit: { type: String, required: true }, 
  threshold: { type: Number, default: 5 },
  image: {type: String}
});

module.exports = mongoose.model("Ingredient", ingredientSchema);