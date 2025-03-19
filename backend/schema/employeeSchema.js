const mongoose = require("mongoose");

//Nhân viên
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: {
    type: String,
    enum: ["assistant", "chef", "waiter", "cashier", "manager", "shipper"],
    required: true
  },
  contract: { type: mongoose.Schema.Types.ObjectId, ref: "Contract"}, 
  attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
  leaveRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "LeaveRequest" }]
})
module.exports = mongoose.model("Employee", employeeSchema);