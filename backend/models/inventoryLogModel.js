const InventoryLog = require("../schema/inventoryLogSchema");
const Ingredient = require("../schema/ingredientSchema");
const IngredientModel = require("./ingredientModel");

const createInventoryLog = async (logData) => {
    try {
        const newLog = new InventoryLog(logData);

        for (let item of newLog.items) {
            const lowerCaseName = item.name.toLowerCase();
            item.name = lowerCaseName; 

            let ingredient = await Ingredient.findOne({ name: lowerCaseName });

            if (!ingredient && newLog.type === "import") {
                ingredient = new Ingredient({
                    name: lowerCaseName,
                    stock: item.quantity, 
                    unit: item.unit,
                    threshold: item.threshold || 5, 
                });
                await ingredient.save();
                item.ingredientId = ingredient._id; 
                console.log(`Created and stocked new ingredient: ${item.name}`);

            } else if (ingredient) {
                let quantityChange;

                if (newLog.type === "export") {
                    if (item.quantity > ingredient.stock) {
                        throw new Error(`Không thể xuất ${item.quantity} ${ingredient.unit} "${item.name}". Chỉ còn ${ingredient.stock} trong kho.`);
                    }
                    quantityChange = -item.quantity;
                } else {
                    quantityChange = item.quantity;
                }

                const result = await IngredientModel.updateIngredientStock(ingredient._id, quantityChange);
                if (!result.success) {
                    throw new Error(`Failed to update stock for ${item.name}: ${result.message}`);
                }
                item.ingredientId = ingredient._id; 
                 item.unit = ingredient.unit;

            } else if (newLog.type === "export") {
                throw new Error(`Nguyên liệu "${item.name}" không tồn tại để thực hiện xuất kho.`);
            }
        }

        await newLog.save();

        return {
            success: true,
            log: newLog,
        };

    } catch (error) {
        console.error("Error creating inventory log:", error); 
        return {
            success: false,
            message: error.message, 
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
            if (log.type === "import" && item.totalCost) {
                totalAmount += item.totalCost;
            }
        });

        log.totalAmount = totalAmount;
        await log.save();
        return {
            success: true,
            totalAmount,
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

const updateInventoryLog = async (logId, updatedData) => {
   
    try {
        const existingLog = await InventoryLog.findById(logId); 
        if (!existingLog) {
            throw new Error("Inventory log not found");
        }

        const oldType = existingLog.type;
        const oldItemsMap = new Map();
        existingLog.items.forEach(item => {
            if (item.ingredientId) {
                oldItemsMap.set(item.ingredientId.toString(), { quantity: item.quantity });
            }
        });

        const newType = updatedData.type || oldType;
        const newItems = updatedData.items || [];
        const newItemsMap = new Map();
        const processedNewItems = [];

        for (const newItemData of newItems) {
             if (!newItemData.name || newItemData.quantity == null || newItemData.quantity <=0 || !newItemData.unit) {
                 throw new Error(`Invalid data for item: ${newItemData.name || 'Unnamed'}. Name, quantity (>0), and unit are required.`);
             }
            const lowerCaseName = newItemData.name.toLowerCase();
            let ingredient = await Ingredient.findOne({ name: lowerCaseName }); 
            if (!ingredient && newType === "import") {
                ingredient = new Ingredient({
                    name: lowerCaseName, stock: 0, unit: newItemData.unit,
                    threshold: newItemData.threshold || 5,
                });
                await ingredient.save(); 
            } else if (!ingredient && newType === "export") {
                throw new Error(`Ingredient "${newItemData.name}" does not exist for export.`);
            }
             if (!ingredient) { throw new Error(`Failed to find or create ingredient: ${newItemData.name}`); }

            const processedItem = {
                ingredientId: ingredient._id, name: ingredient.name,
                quantity: Number(newItemData.quantity), unit: ingredient.unit,
                ...(newType === 'import' && { totalCost: Number(newItemData.totalCost || 0) })
            };
            processedNewItems.push(processedItem);
            newItemsMap.set(ingredient._id.toString(), { quantity: processedItem.quantity });
        }

        const allIngredientIds = new Set([ ...oldItemsMap.keys(), ...newItemsMap.keys() ]);

        for (const ingredientIdStr of allIngredientIds) {
            const oldItem = oldItemsMap.get(ingredientIdStr);
            const newItem = newItemsMap.get(ingredientIdStr);

            const oldQuantity = oldItem ? oldItem.quantity : 0;
            const newQuantity = newItem ? newItem.quantity : 0;

            const oldEffect = oldType === 'import' ? oldQuantity : -oldQuantity;
            const newEffect = newType === 'import' ? newQuantity : -newQuantity;

            const netChange = newEffect - oldEffect;

            if (netChange !== 0) {
                if (netChange < 0) { 
                    const ingredient = await Ingredient.findById(ingredientIdStr).select('stock name unit'); 
                    if (!ingredient) {
                        throw new Error(`Ingredient with ID ${ingredientIdStr} not found during stock check.`);
                    }
                    if (ingredient.stock + netChange < 0) {
                        throw new Error(
                            `Không thể cập nhật phiếu: Thay đổi này sẽ làm số lượng "${ingredient.name}" (${ingredient.unit}) ` +
                            `thành ${ingredient.stock + netChange} (âm). Hiện chỉ còn ${ingredient.stock} trong kho.`
                        );
                    }
                }
                const stockUpdateResult = await IngredientModel.updateIngredientStock(ingredientIdStr, netChange); 
                if (!stockUpdateResult.success) {
                    const failedIngredient = await Ingredient.findById(ingredientIdStr).select('name');
                    const failedName = failedIngredient ? failedIngredient.name : `ID ${ingredientIdStr}`;
                    throw new Error(`Failed to update stock for ingredient "${failedName}": ${stockUpdateResult.message}`);
                }
            }
        }
       
        existingLog.type = newType;
        existingLog.items = processedNewItems; 
        existingLog.notes = updatedData.notes !== undefined ? updatedData.notes : existingLog.notes;
        existingLog.date = updatedData.date || existingLog.date;
        existingLog.employeeId = updatedData.employeeId !== undefined ? updatedData.employeeId : existingLog.employeeId;

        let calculatedTotal = 0;
        if (existingLog.type === 'import') {
            existingLog.items.forEach(item => { calculatedTotal += item.totalCost || 0; });
        }
        existingLog.totalAmount = calculatedTotal;

        await existingLog.save(); 

        return { success: true, log: existingLog };

    } catch (error) {
        console.error("Error updating inventory log:", error);
        return { success: false, message: error.message };
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
            message: "Inventory log deleted successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

// Lấy bản ghi
const getInventoryLog = async (logId) => {
    try {
      const log = await InventoryLog.findById(logId);
      if (!log) {
        throw new Error('Inventory Log không tồn tại');
      }
      return {
        sucess: true,
        log: log
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      }
    }
};

// Lấy tất cả bản ghi
const getAllInventoryLog = async () => {
    try {
        const log = await InventoryLog.find()
        return {
            success: true,
            logs: log
        }
    } catch (error) {
        return {
          success: false,
          message: error.message
        }
      }
}

module.exports = {
    createInventoryLog,
    calculateTotalAmount,
    updateInventoryLog,
    deleteInventoryLog,
    getInventoryLog,
    getAllInventoryLog
};
