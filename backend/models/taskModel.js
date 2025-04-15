const Employee = require("../schema/employeeSchema")
const TableOrder = require("../schema/tableOrderSchema")
const Task = require("../schema/taskSchema")
const moment = require('moment');


const assignWaiterToOrder = async (orderData) => {
    try {
        const today = moment().startOf('day').toDate();
        const waiters = await Employee.find({
            position: "waiter"
        }).populate({
            path: "attendances",
            match: {
                checkIn: {
                    $gte: today
                }
            }
        }).exec();
        const avaiablewaiters = waiters.filter(waiter => waiter.attendances.length > 0)

        if (avaiablewaiters.length === 0) {
            throw new Error("Không có bồi bàn nào check in ngày hôm nay")
        }
        const waiterWorkLoads = await Promise.all(avaiablewaiters.map(async waiter => {
            const ordersAssignedToWaiter = await TableOrder.find({
                waiterId: waiter._id,
                status: "Ordered"
            })

            const tableCount = ordersAssignedToWaiter.length
            return {
                waiter,
                tableCount,
                ordersAssignedToWaiter
            }
        }))

        waiterWorkLoads.sort((a, b) => a.tableCount - b.tableCount);
        const selectedWaiter = waiterWorkLoads[0].waiter
        return selectedWaiter
    } catch (error) {
        throw new Error("Đã xảy ra lỗi khi phân công: " + error.message);
    }
}

const createTask = async (taskData) => {
    try {
        const newTask = new Task(taskData);
        await newTask.save();

        return {
            success: true,
            task: newTask
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

const updateTask = async (taskId, updateData) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskID, updateData, {
            new: true
        }); 

        return {
            success: true,
            task: updatedTask
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const getAllTask = async () => {
    try {
        const listtask = await Task.find();
        return {
            success: true,
            tasks: listtask
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const getTaskById = async (taskId) => {
    try {
        const task = await Task.findById(taskId);
        return {
            success: true,
            task: task
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const deleteTask = async (taskId) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);  

        return {
            success: true,
            message: "Task deleted",
            task: deletedTask
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};


module.exports = {
    assignWaiterToOrder,
    updateTask,
    createTask,
    deleteTask,
    getTaskById,
    getAllTask
}