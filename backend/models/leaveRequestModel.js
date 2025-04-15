const LeaveRequests = require("../schema/leaveRequestSchema")

const createLeaveRequest = async (leaveRequestData) => {
  try {
    const newLeaveRequest = new LeaveRequests(leaveRequestData);
    await newLeaveRequest.save();
    return {
      success: true,
      leaveRequest: newLeaveRequest
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Phương thức cập nhật yêu cầu nghỉ phép (ví dụ: phê duyệt, từ chối)
const updateLeaveRequest = async (leaveRequestId, updateData) => {
  try {
    const updatedLeaveRequest = await LeaveRequests.findByIdAndUpdate(leaveRequestId, updateData, {
      new: true
    });
    if (!updatedLeaveRequest) {
      throw new Error("Leave request not found");
    }
    return {
      success: true,
      leaveRequest: updatedLeaveRequest
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Phương thức lấy yêu cầu nghỉ phép theo nhân viên
const getLeaveRequestsByEmployeeId = async (employeeId) => {
  try {
    const leaveRequests = await LeaveRequests.find({
      employeeId
    });
    return {
      success: true,
      leaveRequests
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Phương thức lấy tất cả yêu cầu nghỉ phép với trạng thái cụ thể
const getLeaveRequestsByStatus = async (status) => {
  try {
    const leaveRequests = await LeaveRequests.find({
      status
    });
    return {
      success: true,
      leaveRequests
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

// Phương thức tính toán thời gian nghỉ (duration)
const calculateLeaveDuration = (startTime, endTime) => {
  const duration = (endTime - startTime) / (1000 * 3600 * 24); // Tính bằng ngày
  return duration;
};

// Phương thức xóa yêu cầu nghỉ phép
const deleteLeaveRequest = async (leaveRequestId) => {
  try {
    const deletedLeaveRequest = await LeaveRequests.findByIdAndDelete(leaveRequestId);
    if (!deletedLeaveRequest) {
      throw new Error("Leave request not found");
    }
    return {
      success: true,
      message: "Leave request deleted successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  createLeaveRequest,
  updateLeaveRequest,
  getLeaveRequestsByEmployeeId,
  getLeaveRequestsByStatus,
  calculateLeaveDuration,
  deleteLeaveRequest
};