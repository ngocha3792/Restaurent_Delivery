const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

// Tạo nguyên liệu mới
router.post("/", ingredientController.createIngredient);

// Kiểm tra xem nguyên liệu nào đang ở ngưỡng cảnh báo
router.get("/low-stock", ingredientController.getLowStockIngredients);

// Xóa nguyên liệu
router.delete("/:ingredientId", ingredientController.deleteIngredient);
router.put("/:id", ingredientController.updateIngredientInfo)
router.get("/:id", ingredientController.getIngredientById)
router.get("/", ingredientController.getAllIngredients)
router.get("/:ingredientId/history", ingredientController.getIngredientHistory);

module.exports = router;
