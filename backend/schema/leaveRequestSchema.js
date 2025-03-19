const mongoose = require("mongoose")

//Nghỉ phép
const leaveRequestSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
  });
  
module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);