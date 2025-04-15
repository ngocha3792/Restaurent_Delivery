const multer = require("multer")
const contractModel = require("../models/contractModel")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../../frontend/public/upload/');  
    },
    filename: (req, file, cb) => {
      
        cb(null, Date.now() + path.extname(file.originalname));  
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true); 
        } else {
            cb(new Error("Only image files are allowed!"), false);  
        }
    }
});

const createContractHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });
        }

        const contractData = {
            employeeId: req.body.employeeId,
            contractType: req.body.contractType,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            salaryType: req.body.salaryType,
            baseSalary: req.body.baseSalary,
            hourlyRate: req.body.hourlyRate,
            imagePath: req.file.path,  
            imageType: req.file.mimetype
        };

        const newContract = await contractModel.createContract(contractData);
        await newContract.save();

        return res.status(201).json({
            success: true,
            contract: newContract
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateContractHandler = async (req, res) => {
    try {
        const { contractId } = req.params;
        const updateData = req.body;

        if (req.file) {
            updateData.imagePath = req.file.path; 
            updateData.imageType = req.file.mimetype;
        }

        const result = await contractModel.updateContract(contractId, updateData);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            contract: result.contract
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const getActiveContractsHandler = async (req, res) => {
    try {
        const {
            employeeId
        } = req.params;
        const result = await contractModel.getActiveContractsByEmployeeId(employeeId);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            contracts: result.contracts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getExpiredContractsHandler = async (req, res) => {
    try {
        const result = await contractModel.getExpiredContracts();

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            contracts: result.contracts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const terminateContractHandler = async (req, res) => {
    try {
        const {
            contractId
        } = req.params;

        const result = await contractModel.terminateContract(contractId);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        return res.json({
            success: true,
            message: result.message,
            contract: result.contract
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const uploadContractImage = upload.single('image');

module.exports = {
    getActiveContractsHandler,
    getExpiredContractsHandler,
    terminateContractHandler,
    updateContractHandler,
    createContractHandler,
    uploadContractImage
}