const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

// Tạo mới nhân viên
router.post("/", employeeController.createEmployeeHandler);

// Cập nhật thông tin nhân viên
router.put("/:id", employeeController.updateEmployeeHandler);

// Xóa nhân viên
router.delete("/:id", employeeController.deleteEmployeeHandler);

// Lấy nhân viên theo ID
router.get("/:id", employeeController.getEmployeeByIdHandler);

// Lấy tất cả nhân viên
router.get("/", employeeController.getAllEmployeesHandler);

module.exports = router;
