const mongoose = require("mongoose");

//Hợp đồng
const contractSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  contractType: { type: String, enum: ["permanent", "temporary", "internship"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  salaryType: { type: String, enum: ["fixed", "hourly"], required: true },
  baseSalary: { type: Number, required: function() { return this.salaryType === "fixed"; } },
  hourlyRate: { type: Number, required: function() { return this.salaryType === "hourly"; } },
  status: { type: String, enum: ["active", "expired", "terminated"], default: "active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Contract", contractSchema);
