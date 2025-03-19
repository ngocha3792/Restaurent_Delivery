const userModel = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const handleLogin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const user = await userModel.findOne({
            email
        });
        if (!user) return res.status(404).json({
            message: "User not found"
        });

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) return res.status(400).json({
            message: "Password is wrong"
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false
        })
        res.status(200).json({
            message: "Login Sucessful",
            token,
            role: user.role
        })
    } catch (err) {
        res.status(500).json({
            message: "Login failed" + err.message
        })
    }
}

const handleLogout = (req, res) => {
    res.clearCookie("token")
    res.status.json({
        message: "Logout Success"
    })
}

module.exports = {
    handleLogin,
    handleLogout
}