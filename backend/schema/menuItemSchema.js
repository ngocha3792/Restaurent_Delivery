const mongoose = require("mongoose")

// Món ăn
const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ["main", "drink", "dessert", "combo"], required: true },
    ingredients: [
      {
        ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    available: { type: Boolean, default: true }, 
    outOfStock: { type: Boolean, default: false }, 
    timeCook: {type: Number, required: true },
    image: {type: String},
  });

module.exports = mongoose.model("MenuItem",menuItemSchema)
