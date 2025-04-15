const userSchema = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter both email and password"
            });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_TOKEN,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "Login successful",
            token, 
            role: user.role
        });
    } catch (err) {
        return res.status(500).json({
            message: `Login failed: ${err.message}`
        });
    }
};

const handleLogout = (req, res) => {
    return res.status(200).json({
        message: "Logout successful"
    });
};

module.exports = {
    handleLogin,
    handleLogout
};
