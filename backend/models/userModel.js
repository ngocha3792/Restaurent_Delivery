const bcrypt = require("bcryptjs");
const User = require("../schema/userSchema");
const Employee = require("../schema/employeeSchema");

const createUserForExistingEmployee = async (employeeId, userData) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error("Employee not found");
    }

    if (employee.userId) {
      throw new Error("Employee already has an associated user account.");
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = new User({
      username: userData.username,
      passwordHash: hashedPassword,
      email: userData.email,
      role: userData.role || "employee", 
    });

    await user.save();

    employee.userId = user._id;
    await employee.save();

    return {
      success: true,
      message: "User account created and linked to employee.",
      user,
      employee
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = {
  createUserForExistingEmployee
};
