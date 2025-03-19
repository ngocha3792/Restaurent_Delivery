const Contract = require("../schema/contractSchema")
const Employee = require("../schema/employeeSchema")
const mongoose = require("mongoose")


const updateContractById = async (contractId, updateData) => {
    const session = await mongoose.startSession();  
    session.startTransaction();

    try {
        const contract = await Contract.findById(contractId).session(session); 
        if (!contract) {
            throw new Error("Contract not found");
        }

        Object.assign(contract, updateData);
        await contract.save({ session });  

        await session.commitTransaction();  
        session.endSession();  

        return { success: true, contract };
    } catch (error) {
        await session.abortTransaction();  
        session.endSession();  
        return { success: false, message: error.message };
    }
};

const getActiveContracts = async () => {
    try {
        const activeContracts = await Contract.find({ status: "active" }).populate("employeeId", "name position"); 
        return { success: true, contracts: activeContracts };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getContractByEmployee = async (employeeId) => {
    try {
        const contract = await Contract.findOne({ employeeId }).populate("employeeId", "name position"); 
        if (!contract) {
            return { success: false, message: "Contract for the employee not found" };
        }
        return { success: true, contract };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    updateContractById,
    getActiveContracts,
    getContractByEmployee
};
module.exports = {
    updateContractById,
    getActiveContracts,
    getContractByEmployee
};


