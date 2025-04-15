const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");

// Tạo hợp đồng mới với ảnh
router.post("/", contractController.uploadContractImage, contractController.createContractHandler);

// Cập nhật hợp đồng
router.put("/:contractId", contractController.uploadContractImage, contractController.updateContractHandler);

// Lấy các hợp đồng đang hoạt động của nhân viên
router.get("/active/:employeeId", contractController.getActiveContractsHandler);

// Lấy các hợp đồng đã hết hạn
router.get("/expired", contractController.getExpiredContractsHandler);

// Hủy hợp đồng
router.patch("/:contractId/terminate", contractController.terminateContractHandler);

module.exports = router;