const employeeModel = require("../models/employeeModel")

const createEmployeeHandler = async (req, res) => {
    try {
        const employeeData = req.body;
        const result = await employeeModel.createEmployee(employeeData);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.status(201).json({
            success: true,
            employee: result.employee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateEmployeeHandler = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const updateData = req.body;
        const result = await employeeModel.updateEmployee(id, updateData);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            employee: result.employee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Xóa nhân viên
const deleteEmployeeHandler = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const result = await employeeModel.deleteEmployee(id);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Tìm nhân viên theo ID
const getEmployeeByIdHandler = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const result = await employeeModel.findEmployee(id);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            employee: result.employee
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy tất cả nhân viên
const getAllEmployeesHandler = async (req, res) => {
    try {
        const result = await employeeModel.getAllEmployee();

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            employees: result.employees
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createEmployeeHandler,
    updateEmployeeHandler,
    getAllEmployeesHandler,
    getEmployeeByIdHandler,
    deleteEmployeeHandler
}
