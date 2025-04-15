const leaveRequestModel = require("../models/leaveRequestModel");
  
  // Tạo yêu cầu nghỉ phép mới
  const createLeaveRequestHandler = async (req, res) => {
    try {
      const leaveRequestData = req.body; 
      leaveRequestData.duration = leaveRequestModel.calculateLeaveDuration(leaveRequestData.startTime, leaveRequestData.endTime); 
      const result = await leaveRequestModel.createLeaveRequest(leaveRequestData);
  
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }
  
      return res.status(201).json({
        success: true,
        leaveRequest: result.leaveRequest
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const updateLeaveRequestHandler = async (req, res) => {
    try {
      const { leaveRequestId } = req.params;
      const updateData = req.body; 
      const result = await leaveRequestModel.updateLeaveRequest(leaveRequestId, updateData);
  
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message
        });
      }
  
      return res.json({
        success: true,
        leaveRequest: result.leaveRequest
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getLeaveRequestsByEmployeeHandler = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const result = await leaveRequestModel.getLeaveRequestsByEmployeeId(employeeId);
  
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message
        });
      }
  
      return res.json({
        success: true,
        leaveRequests: result.leaveRequests
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const getLeaveRequestsByStatusHandler = async (req, res) => {
    try {
      const { status } = req.params;
      const result = await leaveRequestModel.getLeaveRequestsByStatus(status);
  
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message
        });
      }
  
      return res.json({
        success: true,
        leaveRequests: result.leaveRequests
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  const deleteLeaveRequestHandler = async (req, res) => {
    try {
      const { leaveRequestId } = req.params;
      const result = await leaveRequestModel.deleteLeaveRequest(leaveRequestId);
  
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message
        });
      }
  
      return res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  module.exports = {
    createLeaveRequestHandler,
    updateLeaveRequestHandler,
    getLeaveRequestsByEmployeeHandler,
    getLeaveRequestsByStatusHandler,
    deleteLeaveRequestHandler
  }