const Attendance = require("../schema/attendanceSchema");

const checkIn = async (employeeId) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0); 
    
    let attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: today
    });

    if (attendance) {
      throw new Error("You have already checked in today.");
    }

    attendance = new Attendance({
      employeeId: employeeId,
      date: today,
      checkIn: new Date(), 
    });

    await attendance.save();
    
    return {
      success: true,
      message: "Check-in successful.",
      attendance
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

const checkOut = async (employeeId) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: today
    });

    if (!attendance) {
      throw new Error("You must check-in before checking out.");
    }

    if (attendance.checkOut) {
      throw new Error("You have already checked out today.");
    }

    attendance.checkOut = new Date();
    attendance.totalHours = (attendance.checkOut - attendance.checkIn) / (1000 * 3600); 
    await attendance.save();

    return {
      success: true,
      message: "Check-out successful.",
      attendance
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};


module.exports = {
  checkIn,
  checkOut
};