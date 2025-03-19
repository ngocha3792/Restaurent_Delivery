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
        const result = await inventoryLogService.deleteInventoryLog(logId);
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
        const result = await inventoryLogService.updateInventoryLog(logId, updatedData);

        if (!result.success) {
            return res.status(400).json(result);
        }

        const totalAmountResult = await inventoryLogService.calculateTotalAmount(result.log._id);

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

module.exports = {
    createAndCalculateInventoryLog,
    updateInventoryLog,
    deleteInventoryLog
};