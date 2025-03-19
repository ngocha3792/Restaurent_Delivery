const Ingredient = require("../schema/ingredientSchema");

// Tạo mới nguyên liệu
const createIngredient = async (ingredientData) => {
    try {
        const existingIngredient = await Ingredient.findOne({ name: ingredientData.name });

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
            $expr: {
                $lte: ["$stock", "$threshold"]
            }
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

module.exports = {
    createIngredient,
    updateIngredientStock,
    getLowStockIngredients,
    deleteIngredient
};
