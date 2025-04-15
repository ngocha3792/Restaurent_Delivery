const mongoose = require("mongoose");

//Nhân viên
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  position: {
    type: String,
    enum: ["assistant", "chef", "waiter", "cashier", "manager", "shipper"],
    required: true
  },
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: "Contract"}, 
  attendances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }],
  leaveRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "LeaveRequest" }]
})
module.exports = mongoose.model("Employee", employeeSchema);