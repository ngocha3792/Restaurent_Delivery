const Contract = require("../schema/contractSchema")
const createContract = async (contractData) => {
    try {
        const newContract = new Contract(contractData);
        await newContract.save();
        return {
            success: true,
            contract: newContract
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Phương thức cập nhật hợp đồng
const updateContract = async (contractId, updateData) => {
    try {
        const updatedContract = await Contract.findByIdAndUpdate(contractId, updateData, {
            new: true
        });
        if (!updatedContract) {
            throw new Error("Contract not found");
        }
        return {
            success: true,
            contract: updatedContract
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Phương thức lấy các hợp đồng đang hoạt động của nhân viên
const getActiveContractsByEmployeeId = async (employeeId) => {
    try {
        const activeContracts = await Contract.find({
            employeeId: employeeId,
            status: "active"
        });
        return {
            success: true,
            contracts: activeContracts
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// Phương thức lấy tất cả hợp đồng đã hết hạn
const getExpiredContracts = async () => {
    try {
        const expiredContracts = await Contract.find({
            status: "expired"
        });
        return {
            success: true,
            contracts: expiredContracts
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const terminateContract = async (contractId) => {
    try {
        const contract = await Contract.findById(contractId);
        if (!contract) {
            throw new Error("Contract not found");
        }

        contract.status = "terminated";
        await contract.save();

        return {
            success: true,
            message: "Contract terminated successfully",
            contract: contract
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    createContract,
    updateContract,
    getExpiredContracts,
    terminateContract,
    getActiveContractsByEmployeeId
}