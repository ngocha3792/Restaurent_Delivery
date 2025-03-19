const InventoryLog = require("../schema/inventoryLogSchema");
const Ingredient = require("../schema/ingredientSchema");
const IngredientModel = require("./ingredientModel");  

// Tạo bản ghi mới
const createInventoryLog = async (logData) => {
    try {
        const newLog = new InventoryLog(logData);
        
        for (let item of newLog.items) {
            let ingredient = await Ingredient.findById(item.ingredientId);

            if (!ingredient && newLog.type === "import" && !item.ingredientId) {
                ingredient = new Ingredient({
                    name: item.name,
                    stock: item.quantity,
                    unit: item.unit,
                    threshold: item.threshold || 5,
                });
                await ingredient.save();  
                item.ingredientId = ingredient._id; 
            } else if (ingredient) {
                const quantityChange = newLog.type === "import" ? item.quantity : -item.quantity;
                const result = await IngredientModel.updateIngredientStock(ingredient._id, quantityChange);
                if (!result.success) {
                    throw new Error(result.message);
                }
            } else if (newLog.type === "export") {
                throw new Error(`Ingredient with ID ${item.ingredientId} does not exist`);
            }
        }

        await newLog.save();  

        return {
            success: true,
            log: newLog
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Tính tổng tiền của nhập hàng
const calculateTotalAmount = async (logId) => {
    try {
        const log = await InventoryLog.findById(logId);
        if (!log) {
            throw new Error("Log not found");
        }

        let totalAmount = 0;
        log.items.forEach(item => {
            if (log.type === "import") {
                totalAmount += item.totalCost;
            }
        });

        log.totalAmount = totalAmount;
        await log.save();
        return {
            success: true,
            totalAmount
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Chỉnh sửa bản ghi (chỉ có admin mới có quyền)
const updateInventoryLog = async (logId, updatedData) => {
    try {
        const existingLog = await InventoryLog.findById(logId);
        if (!existingLog) {
            throw new Error("Inventory log not found");
        }

        existingLog.type = updatedData.type || existingLog.type;
        existingLog.items = updatedData.items || existingLog.items;
        existingLog.date = updatedData.date || existingLog.date;
        existingLog.totalAmount = updatedData.totalAmount || existingLog.totalAmount;
        existingLog.employeeId = updatedData.employeeId || existingLog.employeeId;

        for (let item of existingLog.items) {
            let ingredient = await Ingredient.findById(item.ingredientId);

            if (!ingredient && existingLog.type === "import") {
                ingredient = new Ingredient({
                    name: item.name,
                    stock: item.quantity,
                    unit: item.unit,
                    threshold: item.threshold || 5,
                });
                await ingredient.save();  
            } else if (ingredient) {
                const quantityChange = existingLog.type === "import" ? item.quantity : -item.quantity;
                const result = await IngredientModel.updateIngredientStock(ingredient._id, quantityChange);
                if (!result.success) {
                    throw new Error(result.message);
                }
            } else if (existingLog.type === "export") {
                throw new Error(`Ingredient with ID ${item.ingredientId} does not exist`);
            }
        }

        await existingLog.save();  

        return {
            success: true,
            log: existingLog
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Xóa bản ghi (chỉ có admin mới có quyền)
const deleteInventoryLog = async (logId) => {
    try {
        const log = await InventoryLog.findById(logId);
        if (!log) {
            throw new Error("Inventory log not found");
        }

        await InventoryLog.findByIdAndDelete(logId); 

        return {
            success: true,
            message: "Inventory log deleted successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    createInventoryLog,
    calculateTotalAmount,
    updateInventoryLog,
    deleteInventoryLog
};
