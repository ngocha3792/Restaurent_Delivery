const MenuItemModel = require("../models/menuItemModel")
//Tạo món ăn mới
const createMenuItem = async (req, res) => {
    try {
        const result = await MenuItemModel.createMenuItem(req.body);
        if (result.success) {
            return res.status(201).json(result);
        }
        return res.status(400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Lấy danh sách tất cả các món ăn
const getAllMenuItems = async (req, res) => {
    try {
        const result = await MenuItemModel.getAllMenuItems();
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Cập nhật món ăn
const updateMenuItem = async (req, res) => {
    const {
        menuItemId
    } = req.params;
    try {
        const result = await MenuItemModel.updateMenuItem(menuItemId, req.body);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Xóa món ăn
const deleteMenuItem = async (req, res) => {
    const {
        menuItemId
    } = req.params;
    try {
        const result = await MenuItemModel.deleteMenuItem(menuItemId);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Lấy món ăn theo tên
const getMenuItemByName = async (req, res) => {
    const {
        name
    } = req.params;
    try {
        const result = await MenuItemModel.getMenuItemByName(name);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Kiểm tra tồn kho của nguyên liệu trong món ăn
const checkIngredientStockForMenuItem = async (req, res) => {
    const {
        menuItemId
    } = req.params;
    try {
        const result = await MenuItemModel.checkIngredientStockForMenuItem(menuItemId);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(400).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createMenuItem,
    getAllMenuItems,
    updateMenuItem,
    deleteMenuItem,
    getMenuItemByName,
    checkIngredientStockForMenuItem
};
