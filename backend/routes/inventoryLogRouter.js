const express = require("express");
const router = express.Router();
const inventoryLogController = require("../controllers/inventoryLogController");

// tạo bản ghi nhập xuất kho
router.post("/", inventoryLogController.createAndCalculateInventoryLog);

// Xóa bản ghi nhập xuất kho
router.delete("/:logId", inventoryLogController.deleteInventoryLog);

// Sửa bản ghi nhập xuất kho
router.put("/:logId", inventoryLogController.updateInventoryLog);

router.get("/:logId", inventoryLogController.getInventoryLog)

router.get("/", inventoryLogController.getAllInventoryLog)

module.exports = router;