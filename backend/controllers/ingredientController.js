const IngredientModel = require("../models/ingredientModel");

const createIngredient = async (req, res) => {
    try {
        console.log(req.body)
        req.body.name = req.body.name.toLowerCase()
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

const getAllIngredients = async (req, res) => {
  try {
      const options = {
          search: req.query.search || '',
          unit: req.query.unit || '',
          status: req.query.status || '',
          sortBy: req.query.sortBy || 'name',
          sortOrder: req.query.sortOrder || 'asc',
          page: req.query.page || 1,
          limit: req.query.limit || 10 
      };

      const result = await IngredientModel.getAllIngredients(options);

      if (!result.success) {
          return res.status(500).json({
              success: false,
              message: result.message || "Server error fetching ingredients",
          });
      }

      return res.json({
          success: true,
          ingredients: result.ingredients,
          pagination: result.pagination, 
      });

  } catch (error) {
      console.error("Unhandled error in getAllIngredients controller:", error);
      return res.status(500).json({
          success: false,
          message: error.message || "Internal server error",
      });
  }
};

const getIngredientHistory = async (req, res) => {
  try {
      const { ingredientId } = req.params; 

      if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
           return res.status(400).json({ success: false, message: 'Invalid Ingredient ID format' });
       }

      const result = await IngredientModel.getIngredientHistory(ingredientId);

      if (!result.success) {
          return res.status(500).json({
               success: false,
               message: result.message || "Server error fetching ingredient history"
           });
      }

      return res.json({
          success: true,
          history: result.history
      });

  } catch (error) {
      console.error(`Unhandled error in getIngredientHistory controller for ID ${req.params.ingredientId}:`, error);
      return res.status(500).json({
          success: false,
          message: error.message || "Internal server error",
      });
  }
};

const getIngredientById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await IngredientModel.getIngredientById(id);
  
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }
  
      return res.json({
        success: true,
        ingredient: result.ingredient,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
const updateIngredientInfo = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const result = await IngredientModel.updateIngredientInfo(id, updatedData);
  
      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.message,
        });
      }
  
      return res.json({
        success: true,
        ingredient: result.ingredient,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};
  
module.exports = {
    createIngredient,
    getLowStockIngredients,
    deleteIngredient,
    getAllIngredients,
    getIngredientById,
    updateIngredientInfo,
    getIngredientHistory
}