const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");

// Tạo món ăn mới
router.post("/", menuItemController.createMenuItem);

// Lấy danh sách tất cả các món ăn
router.get("/", menuItemController.getAllMenuItems);

// Cập nhật món ăn
router.put("/:menuItemId", menuItemController.updateMenuItem);

// Xóa món ăn
router.delete("/:menuItemId", menuItemController.deleteMenuItem);

// Lấy món ăn theo tên
router.get("/name/:name", menuItemController.getMenuItemByName);

// Kiểm tra tồn kho nguyên liệu trong món ăn
router.get("/:menuItemId/stock", menuItemController.checkIngredientStockForMenuItem);

module.exports = router;