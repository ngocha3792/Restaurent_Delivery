const TableOrder = require("../schema/tableOrderSchema");
const MenuItem = require("../schema/menuItemSchema");
const TaskModel = require("./taskModel")
const TaskOrder = require("../schema/taskSchema")
const createOrder = async (orderData) => {

    try {
        if (!orderData.totalPrice){
            let total = 0;
            for (const item of orderData.items){
                const menuItem = await MenuItem.findById(item.menuItemId)
                total += menuItem.price * item.quantity
            }
            orderData.totalPrice = total
        }

        const selectedWaiter = await TaskModel.assignWaiterToOrder(orderData)

        const order = new TableOrder({
            ...orderData,
            waiterId: selectedWaiter._id,
            status: "Ordered"
        });
        await order.save()
        const servingTask = {
            taskName: "Phục vụ đơn hàng",
            description: `Phục vụ đơn hàng ${order._id} cho bàn ${order.tableNumber}`,
            assignedTo: selectedWaiter._id,
            status: "pending",
            startTime: new Date(),
            taskType: "waiting",
            taskDetail: {
                orderId: order._id,
                tableNumber: order.tableNumber
            }
        } 
        const task = new TaskOrder(servingTask)
        await task.save();
        return {
            sucess: true,
            Order: order,
            Task: task
        }
    } catch (error){
        return {
            sucess: false,
            message: error.message
        }
    }
}

const updateOrder = async (orderId, updateData) => {
    try {
      if (updateData.items) {
        let total = 0;
        for (const item of updateData.items) {
          const menuItem = await MenuItem.findById(item.menuItemId);
          total += menuItem.price * item.quantity;
        }
        updateData.totalPrice = total;
      }
  
    const update = await TableOrder.findByIdAndUpdate(orderId,updateData);
    return {
        sucess: true,
        order: update
    }
    } catch (error) {
       return {
        sucess: false,
        message: error.message
       }
    }
};

const deleteOrder = async (orderId) => {
    try {
      const exits = await TableOrder.findByIdAndDelete(orderId);
      return {
        sucess: true,
        order: exits
      }
    } catch (error) {
        return {
            sucess: false,
            message: error.message
        }
    }
};

const findOrdersByTable = async (tableNumber) => {
    try {
        const orders =  await TableOrder.find({tableNumber}).populate('waiterId').populate('items.menuItemId')
        return {
            sucess: true,
            orders: orders
        }
    } catch (error) {
        return {
            sucess: false,
            message: error.message
        }
    }
}

const getListOrder = async () => {
    try {
        const orders =  await TableOrder.find().populate('waiterId').populate('items.menuItemId')
        return {
            sucess: true,
            orders: orders
        }
    } catch (error) {
        return {
            sucess: false,
            message: error.message
        }
    }
}

module.exports = {
   createOrder,
   updateOrder,
   deleteOrder,
   getListOrder,
   findOrdersByTable
}