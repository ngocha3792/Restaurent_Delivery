const TableOrder = require('../models/tableOrderModel'); 


const createOrderController = async (req, res) => {
    try {
        const orderData = req.body; 
        const result = await TableOrder.createOrder(orderData); 

        if (result.sucess) {
            return res.status(201).json({
                success: true,
                message: 'Đơn hàng đã được tạo thành công',
                order: result.Order
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo đơn hàng: ' + error.message
        });
    }
};

// Cập nhật đơn hàng
const updateOrderController = async (req, res) => {
    try {
        const { orderId } = req.params; 
        const updateData = req.body; 

        const result = await TableOrder.updateOrder(orderId, updateData);

        if (result.sucess) {
            return res.status(200).json({
                success: true,
                message: 'Đơn hàng đã được cập nhật thành công',
                order: result.order
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật đơn hàng: ' + error.message
        });
    }
};

// Xóa đơn hàng
const deleteOrderController = async (req, res) => {
    try {
        const { orderId } = req.params; 

        const result = await TableOrder.deleteOrder(orderId);

        if (result.sucess) {
            return res.status(200).json({
                success: true,
                message: 'Đơn hàng đã được xóa thành công',
                order: result.order
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa đơn hàng: ' + error.message
        });
    }
};

// Tìm đơn theo số bàn
const findOrdersByTableController = async (req, res) => {
    try {
        const { tableNumber } = req.params;

        const result = await TableOrder.findOrdersByTable(tableNumber);

        if (result.sucess) {
            return res.status(200).json({
                success: true,
                orders: result.orders
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tìm đơn hàng theo bàn: ' + error.message
        });
    }
};

// Lấy danh sách tất cả các đơn
const getListOrderController = async (req, res) => {
    try {
        const result = await TableOrder.getListOrder();

        if (result.sucess) {
            return res.status(200).json({
                success: true,
                orders: result.orders
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng: ' + error.message
        });
    }
};

module.exports = {
    createOrderController,
    updateOrderController,
    deleteOrderController,
    getListOrderController,
    findOrdersByTableController
};
