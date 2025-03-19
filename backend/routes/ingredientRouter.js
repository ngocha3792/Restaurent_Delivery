const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

// Tạo nguyên liệu mới
router.post("/", ingredientController.createIngredient);

// Kiểm tra xem nguyên liệu nào đang ở ngưỡng cảnh báo
router.get("/low-stock", ingredientController.getLowStockIngredients);

// Xóa nguyên liệu
router.delete("/:ingredientId", ingredientController.deleteIngredient);

module.exports = router;
