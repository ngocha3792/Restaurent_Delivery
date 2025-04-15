const express = require('express');
const router = express.Router();
const orderController = require('../controllers/tableOrderController'); 

// Route tạo đơn hàng
router.post('/', orderController.createOrderController);

// Route cập nhật đơn hàng
router.put('/:orderId', orderController.updateOrderController);

// Route xóa đơn hàng
router.delete('/:orderId', orderController.deleteOrderController);

// Route tìm đơn theo số bàn
router.get('/:tableNumber', orderController.findOrdersByTableController);

// Route lấy danh sách tất cả các đơn hàng
router.get('/', orderController.getListOrderController);

module.exports = router;
