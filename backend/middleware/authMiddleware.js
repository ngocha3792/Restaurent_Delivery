const jwt = require("jsonwebtoken")
require("dotenv").config()

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(403).json({message: "Unauthorized"})
    
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        req.user = decode
        next()
    } catch (err) {
        res.status(403).json({message: "Token invaild"})
    }
}

const authorizeRoles = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)){
            res.status(403).json({message: "You do not authorize"})
        }
        next()
    }
}

module.exports = {
    authMiddleware,
    authorizeRoles
}