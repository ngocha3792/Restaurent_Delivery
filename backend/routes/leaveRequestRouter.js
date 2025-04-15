const express = require("express");
const router = express.Router();
const leaveRequestController = require("../controllers/leaveRequestController");

// Tạo yêu cầu nghỉ phép mới
router.post("/", leaveRequestController.createLeaveRequestHandler);

// Cập nhật yêu cầu nghỉ phép (phê duyệt hoặc từ chối)
router.put("/:leaveRequestId", leaveRequestController.updateLeaveRequestHandler);

// Lấy yêu cầu nghỉ phép của nhân viên theo ID
router.get("/employee/:employeeId", leaveRequestController.getLeaveRequestsByEmployeeHandler);

// Lấy yêu cầu nghỉ phép theo trạng thái (Pending, Approved, Rejected)
router.get("/status/:status", leaveRequestController.getLeaveRequestsByStatusHandler);

// Xóa yêu cầu nghỉ phép
router.delete("/:leaveRequestId", leaveRequestController.deleteLeaveRequestHandler);

module.exports = router;