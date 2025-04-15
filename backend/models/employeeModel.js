const Employee = require("../schema/employeeSchema")

const createEmployee = async (employeeData) => {
  try {

    const existingEmployee = await Employee.findOne({
      phoneNumber: employeeData.phoneNumber
    })
    if (existingEmployee) {
      throw new Error("Employee with the same phone number already exists");
    }
    const newEmployee = new Employee(employeeData)
    await newEmployee.save();
    return {
      success: true,
      employee: newEmployee
    }
  } catch (error) {
    return {
      sucess: false,
      message: error.message
    }
  }
}

const updateEmployee = async (employeeId, updateData) => {
  try {
    const updateEmployee = await Employee.findByIdAndUpdate(employeeId, updateData)
    return {
      sucess: true,
      employee: updateEmployee
    }
  } catch (error) {
    return {
      sucess: false,
      message: error.message
    }
  }
}

const deleteEmployee = async (employeeId) => {
  try {
    const deleteEmployee = await Employee.findByIdAndDelete(employeeId)
    return {
      sucess: true,
      message: "Xóa nhân viên thành công"
    }
  } catch (error) {
    return {
      sucess: false,
      message: error.message
    }
  }
}

const findEmployee = async (employeeId) => {
  try {
    const employee = await Employee.findById(employeeId).populate("userId contractId attendances leaveRequests")
    return {
      sucess: true,
      employee: employee
    }
  } catch (error){
    return {
      sucess: false,
      message: error.message
    }
  }
}

const getAllEmployee = async () => {
  try {
    const employees = await Employee.find().populate("userId, contractId attendances leaveRequests")
    return {
      success: true,
      employees: employees
    }
  } catch (error) {
    return {
      sucess: false,
      message: error.message
    }
  }
}

module.exports = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  findEmployee,
  getAllEmployee
}