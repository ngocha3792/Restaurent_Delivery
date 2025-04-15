const TableOrder = require('../schema/tableOrderSchema');
const Employee = require('../schema/employeeSchema');
const Task = require("../schema/taskSchema")
const moment = require('moment');

let chefs = [];
let pendingDishes = [];
let activeOrders = [];
let updateInterval = null;

const initialize = async () => {
    const today = moment().startOf('day').toDate();

    chefs = await Employee.find({
        position: 'chef'
    }).populate({
        path: "attendances",
        match: {
            checkIn: {
                $gte: today
            }
        }
    }).exec();

    await loadPendingOrders();

    updateInterval = setInterval(() => updateKitchenStatus(), 30000);
}

// Tải đơn hàng chưa hoàn thành từ database
const loadPendingOrders = async () => {
    activeOrders = await TableOrder.find({
        'items.status': {
            $ne: 'Served'
        }
    }).populate('items.menuItemId');

    pendingDishes = extractDishesFromOrders(activeOrders);
}

// Trích xuất món ăn từ các đơn hàng
const extractDishesFromOrders = (orders) => {
    const dishes = [];

    orders.forEach(order => {
        order.items.forEach(item => {
            if (item.status === 'Ordered') {
                dishes.push({
                    orderId: order._id,
                    tableNumber: order.tableNumber,
                    menuItemId: item.menuItemId._id,
                    name: item.menuItemId.name,
                    cookTime: item.menuItemId.timeCook,
                    quantity: item.quantity,
                    addedAt: order.orderTime
                });
            }
        });
    });
    return dishes;
}

const assignDishes = async () => {
    for (const chef of chefs) {
        const canTakeMore = await canChefTakeMoreDishes(chef._id);

        if (canTakeMore && pendingDishes.length > 0) {
            const prioritizedDishes = prioritizeDishes(pendingDishes);

            const dishToAssign = prioritizedDishes[0];

            await assignDishToChef(chef._id, dishToAssign);

            await updateOrderItemStatus(
                dishToAssign.orderId,
                dishToAssign.menuItemId,
                'Cooking'
            );
            
            pendingDishes = pendingDishes.filter(
                d => !(d.orderId.equals(dishToAssign.orderId) && d.menuItemId.equals(dishToAssign.menuItemId))
            );
        }
    }
}
// Kiểm tra đầu bếp có thể nhận thêm món không
const canChefTakeMoreDishes = async (chefId) => {
    const taskCount = await Task.countDocuments({
        assignedTo: chefId,        
        taskType: 'cooking',      
        status: 'in_progress'
    });
    return taskCount < 3;
}

// Tính toán độ ưu tiên của các món
const prioritizeDishes = (dishes) => {
    return dishes.map(dish => {
            const waitTime = (new Date() - dish.addedAt) / (1000 * 60);
            const totalTime = waitTime + dish.timeCook
            // Độ ưu tiên = (Số lượng * Thời gian chờ) / Thời gian nấu
            const priority = (dish.quantity * waitTime) / dish.cookTime;

            if (totalTime >= 30) {
                priority *= 1.5
            }

            if (totalTime < 10) {
                priority *= 0.9
            }

            return {
                ...dish,
                priority
            };
        })
        .sort((a, b) => b.priority - a.priority);
}

// Phân công món cho đầu bếp
const assignDishToChef = async (chefId, dish) => {
    const taskData = {
        taskName: 'Cooking',  
        description: `Cook ${dish.name} for table ${dish.tableNumber} - Order ID: ${dish.orderId}`,
        assignedTo: chefId,  
        status: 'in_progress',  
        startTime: new Date(), 
        taskType: 'cooking',  
        taskDetails: {
            orderId: dish.orderId,
            tableNumber: dish.tableNumber,
            menuItemId: dish.menuItemId,
            quantity: dish.quantity
        }
    };

    const task = new Task(taskData);
    await task.save();  

    await TableOrder.updateOne(
        { _id: dish.orderId, 'items.menuItemId': dish.menuItemId },
        {
            $set: {
                'items.$.status': 'Cooking',
                'items.$.startedCookingAt': new Date()  
            }
        }
    );
};
const updateOrderItemStatus = async (orderId, menuItemId, status) => {
    await TableOrder.updateOne({
        _id: orderId,
        'items.menuItemId': menuItemId
    }, {
        $set: {
            'items.$.status': status
        }
    });
}

// Kiểm tra và cập nhật trạng thái món ăn
const updateKitchenStatus = async () => {
    await checkCompletedDishes();
    await loadPendingOrders();
    await assignDishes();
}

const updateTaskStatus = async (taskId) => {
    await Task.updateOne(
        { _id: taskId },
        { $set: { status: 'completed', endTime: new Date() } }
    );
};

// Kiểm tra món đã hoàn thành
const checkCompletedDishes = async () => {
    const cookingItems = await TableOrder.find({
        'items.status': 'Cooking'
    }).populate('items.menuItemId');

    const now = new Date();

    for (const order of cookingItems) {
        for (const item of order.items) {
            if (item.status === 'Cooking' && item.startedCookingAt) {
                const cookingDuration = (now - item.startedCookingAt) / (1000 * 60); 

                if (cookingDuration >= item.menuItemId.timeCook) {
                    await updateOrderItemStatus(
                        order._id,
                        item.menuItemId._id,
                        'Served'
                    );
                    const task = await Task.findOne({
                        'taskDetails.orderId': order._id,
                        'taskDetails.menuItemId': item.menuItemId._id
                    });

                    if (task) {
                        await updateTaskStatus(task._id);
                    }
                }
            }
        }
    }
}


// Dừng scheduler
const stop = () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
}

module.exports = {
    initialize,
    stop,
    loadPendingOrders,
    assignDishes,
    updateKitchenStatus
};