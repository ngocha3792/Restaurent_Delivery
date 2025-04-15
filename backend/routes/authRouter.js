// routes/auth.js
const express = require('express');
const { handleLogin, handleLogout } = require('../controllers/authController'); 
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware'); 

const router = express.Router();
router.post('/login', handleLogin);


router.post('/logout', handleLogout); 

router.get('/admin-only-data', authMiddleware,  authorizeRoles('admin'), (req, res) => {
        res.json({
            message: "Đây là dữ liệu bí mật chỉ dành cho Admin!",
            user: req.user 
        });
    }
);


module.exports = router;