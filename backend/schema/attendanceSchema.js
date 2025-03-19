const mongoose = require("mongoose")

//Chấm công
const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    totalHours: { type: Number },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
  