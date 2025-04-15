const { createUserForExistingEmployee } = require("../models/userModel");
const userSchema = require("../schema/userSchema"); // Đảm bảo đường dẫn đúng

const createUserForEmployeeHandler = async (req, res) => {
  try {
    const { employeeId, username, password, email, role } = req.body;

    const userData = {
      username,
      password,
      email,
      role
    };

    const result = await createUserForExistingEmployee(employeeId, userData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.status(201).json({
      success: true,
      message: result.message,
      user: result.user,
      employee: result.employee
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userSchema.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            id: user._id,
            name: user.name, 
            email: user.email,
            role: user.role
           
        });

    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: `Failed to get user profile: ${err.message}` });
    }
};

module.exports = {
    createUserForEmployeeHandler,
    getUserProfile
}