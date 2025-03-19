const Employee = require("../schema/employeeSchema")
const Contract = require("../schema/contractSchema");
const mongoose = require("mongoose")


// Tạo mới một nhân viên cùng với hợp đồng
const createEmployeeWithContract = async (employeeData, contractData) => {
  const session = await mongoose.startSession();  
  session.startTransaction();

  try {
      const newEmployee = new Employee(employeeData);
      await newEmployee.save({ session }); 

      const contract = new Contract({
          ...contractData,
          employeeId: newEmployee._id, 
      });
      await contract.save({ session });  

      newEmployee.contract = contract._id;
      await newEmployee.save({ session });  

      await session.commitTransaction();
      session.endSession(); 

      return { success: true, employee: newEmployee, contract };
  } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: error.message };
  }
}
  

// Lấy tất cả các nhân viên có hợp đồng đang có hiệu lực
const getActiveEmployees = async () => {
  try {
        const activeContracts = await Contract.find({ status: "active" })
        const activeEmployeeIds = activeContracts.map(contract => contract.employeeId)
        const activeEmployees = await Employee.find({ _id: { $in: activeEmployeeIds } })
        return { success: true, employees: activeEmployees }
  } catch (error) {
        return { success: false, message: error.message }
  }
}

// Lấy tất cả nhân viên ở vị trí làm việc cụ thể
const getEmployeesByPosition = async (position) => {
  try {
    const employees = await Employee.find({ position })
    return { success: true, employees }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Cập nhật thông tin nhân viên
const updateEmployeeById = async (employeeId, updateData) => {
  const session = await mongoose.startSession();  
  session.startTransaction();

  try {
      const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, { new: true, session }); 
      await session.commitTransaction();
      session.endSession();  
      return { success: true, employee: updatedEmployee };
  } catch (error) {
      await session.abortTransaction();  
      session.endSession(); 
      return { success: false, message: error.message };
  }
}

// Xóa nhân viên
const deleteEmployeeById = async (employeeId) => {
  const session = await mongoose.startSession(); 
  session.startTransaction();

  try {
      const deletedEmployee = await Employee.findByIdAndDelete(employeeId, { session }); 
      await session.commitTransaction();
      session.endSession(); 
      return { success: true, message: "Employee deleted successfully", employee: deletedEmployee };
  } catch (error) {
      await session.abortTransaction(); 
      session.endSession(); 
      return { success: false, message: error.message };
  }
};
module.exports = {
  createEmployeeWithContract,
  getActiveEmployees,
  getEmployeesByPosition,
  updateEmployeeById,
  deleteEmployeeById
}
