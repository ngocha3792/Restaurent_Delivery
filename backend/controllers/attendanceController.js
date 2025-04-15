const { checkIn, checkOut } = require("../models/attendanceModel");

const checkInHandler = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    const result = await checkIn(employeeId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.json({
      success: true,
      message: result.message,
      attendance: result.attendance
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const checkOutHandler = async (req, res) => {
  try {
    const { employeeId } = req.body; 

    const result = await checkOut(employeeId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.json({
      success: true,
      message: result.message,
      attendance: result.attendance
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
    checkInHandler,
    checkOutHandler
}