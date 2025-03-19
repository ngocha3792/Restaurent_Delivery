const IngredientModel = require("../models/ingredientModel");

const createIngredient = async (req, res) => {
    try {
        console.log(req.body)
        const result = await IngredientModel.createIngredient(req.body);
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

const getLowStockIngredients = async (req, res) => {
    try {
        const result = await IngredientModel.getLowStockIngredients();
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

const deleteIngredient = async (req, res) => {
    const {
        ingredientId
    } = req.params;

    try {
        const result = await IngredientModel.deleteIngredient(ingredientId);
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
    createIngredient,
    getLowStockIngredients,
    deleteIngredient
}