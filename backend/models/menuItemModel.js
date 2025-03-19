const MenuItem = require("../schema/menuItemSchema");
const mongoose = require("mongoose");

// Tạo món ăn mới
const createMenuItem = async (menuItemData) => {
    try {
        const newMenuItem = new MenuItem(menuItemData);
        await newMenuItem.save();  

        return {
            success: true,
            menuItem: newMenuItem
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Lấy danh sách tất cả các món ăn
const getAllMenuItems = async () => {
    try {
        const menuItems = await MenuItem.find().populate("ingredients.ingredientId");
        return {
            success: true,
            menuItems
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Cập nhật món ăn
const updateMenuItem = async (menuItemId, updateData) => {
    try {
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, updateData, {
            new: true
        }); 

        return {
            success: true,
            menuItem: updatedMenuItem
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Xóa món ăn
const deleteMenuItem = async (menuItemId) => {
    try {
        const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);  // Không sử dụng session

        return {
            success: true,
            message: "Menu item deleted",
            menuItem: deletedMenuItem
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Lấy món ăn theo tên
const getMenuItemByName = async (name) => {
    try {
        const menuItem = await MenuItem.findOne({
            name: new RegExp(name, "i")
        }).populate("ingredients.ingredientId");

        if (!menuItem) {
            throw new Error("Menu item not found");
        }

        return {
            success: true,
            menuItem
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Kiểm tra tồn kho của nguyên liệu trong món ăn
const checkIngredientStockForMenuItem = async (menuItemId) => {
    try {
        const menuItem = await MenuItem.findById(menuItemId).populate("ingredients.ingredientId");
        if (!menuItem) {
            throw new Error("Menu item not found");
        }

        let outOfStock = false;
        let missingIngredients = [];

        for (let item of menuItem.ingredients) {
            const ingredient = item.ingredientId;
            if (!ingredient || ingredient.stock < item.quantity) {
                outOfStock = true;
                missingIngredients.push({
                    ingredientName: ingredient ? ingredient.name : item.name,
                    requiredQuantity: item.quantity,
                    availableQuantity: ingredient ? ingredient.stock : 0
                });
            }
        }

        await MenuItem.findByIdAndUpdate(menuItemId, { outOfStock });

        if (outOfStock) {
            return {
                success: false,
                message: "One or more ingredients are out of stock",
                missingIngredients
            };
        } else {
            return {
                success: true,
                message: "All ingredients are available"
            };
        }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    createMenuItem,
    getAllMenuItems,
    getMenuItemByName,
    checkIngredientStockForMenuItem,
    deleteMenuItem,
    updateMenuItem
};
