const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// API routes
router.post('/', taskController.createTask);  // Thêm task
router.put('/:id', taskController.updateTask);  // Sửa task
router.get('/', taskController.getAllTask);  // Lấy tất cả task
router.get('/:id', taskController.getTaskById);  // Lấy task theo ID
router.delete('/:id', taskController.deleteTask);  // Xóa task

module.exports = router;
