const taskModel = require("../models/taskModel")

// Thêm task
const createTask = async (req, res) => {
    try {
        const taskData = req.body;
        const result = await taskModel.createTask(taskData);

        if (result.success) {
            res.status(201).json({
                success: true,
                task: result.task
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating task: ' + error.message
        });
    }
};

// Sửa task
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const updateData = req.body;
        const result = await taskModel.updateTask(taskId, updateData);

        if (result.success) {
            res.status(200).json({
                success: true,
                task: result.task
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating task: ' + error.message
        });
    }
};

// Lấy tất cả task
const getAllTask = async (req, res) => {
    try {
        const result = await taskModel.getAllTask();

        if (result.success) {
            res.status(200).json({
                success: true,
                tasks: result.tasks
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks: ' + error.message
        });
    }
};

// Lấy task theo ID
const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const result = await taskModel.getTaskById(taskId);

        if (result.success) {
            res.status(200).json({
                success: true,
                task: result.task
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching task: ' + error.message
        });
    }
};

// Xóa task
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const result = await taskModel.deleteTask(taskId);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message,
                task: result.task
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting task: ' + error.message
        });
    }
};

module.exports = {
    deleteTask,
    getAllTask,
    getTaskById,
    createTask,
    updateTask
}