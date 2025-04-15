const Ingredient = require("../schema/ingredientSchema");

// Tạo mới nguyên liệu
const createIngredient = async (ingredientData) => {
    try {
        const existingIngredient = await Ingredient.findOne({ name: ingredientData.name.toLowerCase() });

        if (existingIngredient) {
            return {
                success: false,
                message: `Ingredient "${ingredientData.name}" already exists. Cannot create a new ingredient with the same name.`
            };
        }

        const newIngredient = new Ingredient(ingredientData);
        await newIngredient.save();  

        return {
            success: true,
            ingredient: newIngredient
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Cập nhật tồn kho của nguyên liệu
const updateIngredientStock = async (ingredientId, quantityChange) => {
    try {
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }

        if (typeof quantityChange !== 'number' || isNaN(quantityChange)) {
            throw new Error("Quantity change must be a valid number");
        }

        ingredient.stock += quantityChange;
        if (ingredient.stock < 0) ingredient.stock = 0;
        await ingredient.save();  

        return {
            success: true,
            ingredient
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Đưa ra những nguyên liệu dưới ngưỡng cảnh báo
const getLowStockIngredients = async () => {
    try {
        const lowStockIngredients = await Ingredient.find({
            stock: { $lte: "$threshold" }
        });

        return {
            success: true,
            lowStockIngredients
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Xóa nguyên liệu(chỉ có admin mới có quyền)
const deleteIngredient = async (ingredientId) => {
    try {
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }

        await Ingredient.findByIdAndDelete(ingredientId); 

        return {
            success: true,
            message: "Ingredient deleted successfully"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Tìm nguyên liệu theo ID
const getIngredientById = async (ingredientId) => {
    try {
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }
        return {
            success: true,
            ingredient
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Cập nhật thông tin nguyên liệu
const updateIngredientInfo = async (ingredientId, updatedData) => {
    try {
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            throw new Error("Ingredient not found");
        }

        Object.assign(ingredient, updatedData);
        await ingredient.save();

        return {
            success: true,
            ingredient
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Tìm nguyên liệu theo tên
const getIngredientByName = async (name) => {
    try {
        const ingredients = await Ingredient.find({
            name: { $regex: new RegExp(name, "i") } 
        });

        if (ingredients.length === 0) {
            return {
                success: false,
                message: `No ingredients found with the name "${name}"`
            };
        }

        return {
            success: true,
            ingredients
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Lấy tất cả nguyên liệu
const getAllIngredients = async () => {
    try {
        const ingredients = await Ingredient.find();
        return {
            success: true,
            ingredients
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const getIngredientHistory = async (ingredientId) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
            throw new Error("Invalid Ingredient ID format");
        }

        const historyLogs = await InventoryLog.find({
            "items.ingredientId": ingredientId 
        }).sort({ date: -1 }) 
          .populate('employeeId', 'name'); 

        return {
            success: true,
            history: historyLogs 
        };

    } catch (error) {
        console.error(`Error fetching history for ingredient ${ingredientId}:`, error);
        return {
            success: false,
            message: `Database error fetching ingredient history: ${error.message}`
        };
    }
};

module.exports = {
    createIngredient,
    updateIngredientStock,
    getLowStockIngredients,
    deleteIngredient,
    getAllIngredients,
    getIngredientById,
    getIngredientByName,
    updateIngredientInfo,
    getIngredientHistory
    
};
