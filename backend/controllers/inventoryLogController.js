const InventoryLogModel = require("../models/inventoryLogModel");

const createAndCalculateInventoryLog = async (req, res) => {
    const logData = req.body;

    try {

        const result = await InventoryLogModel.createInventoryLog(logData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        const totalAmountResult = await InventoryLogModel.calculateTotalAmount(result.log._id);

        if (totalAmountResult.success) {
            return res.status(201).json({
                success: true,
                message: "Inventory log created and total amount calculated",
                log: result.log,
                totalAmount: totalAmountResult.totalAmount
            });
        } else {
            return res.status(400).json(totalAmountResult);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteInventoryLog = async (req, res) => {
    const {
        logId
    } = req.params;

    try {
        const result = await InventoryLogModel.deleteInventoryLog(logId);
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

const updateInventoryLog = async (req, res) => {
    const {
        logId
    } = req.params;
    const updatedData = req.body;

    try {
        const result = await InventoryLogModel.updateInventoryLog(logId, updatedData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        const totalAmountResult = await InventoryLogModel.calculateTotalAmount(result.log._id);

        if (!totalAmountResult.success) {
            return res.status(400).json(totalAmountResult);
        }

        return res.status(200).json({
            success: true,
            log: result.log,
            totalAmount: totalAmountResult.totalAmount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInventoryLog = async (req, res) => {
    const logId = req.params
    try {
        const result = await InventoryLogModel.getInventoryLog(logId)
        if (!result.success){
            res.status(400).json(result)
        }

        return res.status(200).json({
            sucess: true,
            log: result.log
        })

    } catch (error){
        return res.status(500).json({
            sucess: false,
            message: error.message
        })
    }
}

const getAllInventoryLog = async (req, res) => {
    try {
          const result = await InventoryLogModel.getAllInventoryLog();
          console.log(result)
          if (!result.success) {
            return res.status(400).json({
              success: false,
              message: result.message,
            });
          }
      
          return res.json({
            success: true,
            logs: result.logs,
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
    }
}

module.exports = {
    createAndCalculateInventoryLog,
    updateInventoryLog,
    deleteInventoryLog,
    getInventoryLog,
    getAllInventoryLog
};