const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const mongoose = require('mongoose');

const getEquipment = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        let query = {};

        if (req.query.active !== undefined) {
            query.active = req.query.active === 'true';
        }

        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { serialNumber: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.departmentId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.departmentId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID',
                    message: 'Invalid department ID format'
                });
            }
            query.departmentId = req.query.departmentId;
        }
        if (req.query.categoryId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.categoryId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID',
                    message: 'Invalid category ID format'
                });
            }
            query.categoryId = req.query.categoryId;
        }
        if (req.query.employeeId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.employeeId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID',
                    message: 'Invalid employee ID format'
                });
            }
            query.employeeId = req.query.employeeId;
        }
        if (req.query.teamId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.teamId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid ID',
                    message: 'Invalid team ID format'
                });
            }
            query.maintenanceTeamId = req.query.teamId;
        }

        const total = await Equipment.countDocuments(query);

        const equipmentList = await Equipment.find(query)
            .populate({
                path: 'departmentId',
                select: 'name',
                strictPopulate: false
            })
            .populate({
                path: 'categoryId',
                select: 'name',
                strictPopulate: false
            })
            .populate({
                path: 'employeeId',
                select: 'name',
                strictPopulate: false
            })
            .populate({
                path: 'maintenanceTeamId',
                select: 'name',
                strictPopulate: false
            })
            .populate({
                path: 'technicianId',
                select: 'name email',
                strictPopulate: false
            })
            .populate({
                path: 'workCenterId',
                select: 'name',
                strictPopulate: false
            })
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Helper function to extract ID from populated field or ObjectId
        const extractId = (field) => {
            if (!field) return undefined;
            if (typeof field === 'object' && field._id) return field._id.toString();
            if (typeof field === 'string') return field;
            return field.toString();
        };
        
        // Helper function to format populated object
        const formatPopulated = (field, nameField = 'name') => {
            if (!field) return undefined;
            // Handle populated Mongoose documents
            if (typeof field === 'object') {
                // Check if it's a populated document with _id
                if (field._id) {
                    const name = field[nameField] || field.name;
                    if (name) {
                        return {
                            id: field._id.toString(),
                            name: name
                        };
                    }
                }
            }
            return undefined;
        };

        // Transform equipment list to match frontend expectations
        const formattedEquipment = equipmentList.map(eq => {
            const eqObj = eq.toObject();
            return {
                id: eqObj._id.toString(),
                name: eqObj.name,
                serialNumber: eqObj.serialNumber,
                company: eqObj.company,
                model: eqObj.model,
                manufacturer: eqObj.manufacturer,
                technicalSpecifications: eqObj.technicalSpecifications,
                purchaseDate: eqObj.purchaseDate,
                warrantyStartDate: eqObj.warrantyStartDate,
                warrantyEndDate: eqObj.warrantyEndDate,
                location: eqObj.location,
                departmentId: extractId(eqObj.departmentId),
                department: formatPopulated(eqObj.departmentId),
                categoryId: extractId(eqObj.categoryId),
                category: formatPopulated(eqObj.categoryId),
                employeeId: extractId(eqObj.employeeId),
                employee: formatPopulated(eqObj.employeeId),
                maintenanceTeamId: extractId(eqObj.maintenanceTeamId),
                maintenanceTeam: formatPopulated(eqObj.maintenanceTeamId),
                technicianId: extractId(eqObj.technicianId),
                technician: eqObj.technicianId && typeof eqObj.technicianId === 'object' && eqObj.technicianId._id ? {
                    id: eqObj.technicianId._id.toString(),
                    name: eqObj.technicianId.name,
                    email: eqObj.technicianId.email
                } : undefined,
                workCenterId: extractId(eqObj.workCenterId),
                workCenter: formatPopulated(eqObj.workCenterId),
                active: eqObj.active,
                note: eqObj.note,
                createdAt: eqObj.createdAt,
                updatedAt: eqObj.updatedAt
            };
        });

        res.status(200).json({
            success: true,
            data: {
                equipment: formattedEquipment,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error in getEquipment:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch equipment'
        });
    }
};

const getEquipmentById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID',
                message: 'Invalid equipment ID format'
            });
        }

        const equipment = await Equipment.findById(req.params.id)
            .populate('departmentId', 'name')
            .populate('categoryId', 'name')
            .populate('employeeId', 'name')
            .populate('maintenanceTeamId', 'name')
            .populate('technicianId', 'name email')
            .populate('workCenterId', 'name');

        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Equipment not found'
            });
        }

        const requests = await MaintenanceRequest.find({ equipment: equipment._id })
            .sort({ createdAt: -1 })
            .limit(5);

        const openRequestCount = await MaintenanceRequest.countDocuments({
            equipment: equipment._id,
            state: { $in: ['new', 'in_progress'] }
        });

        const requestCount = await MaintenanceRequest.countDocuments({
            equipment: equipment._id
        });

        const equipmentObj = equipment.toObject();
        
        // Helper function to extract ID from populated field or ObjectId
        const extractId = (field) => {
            if (!field) return undefined;
            if (typeof field === 'object' && field._id) return field._id.toString();
            if (typeof field === 'string') return field;
            if (field && field.toString) return field.toString();
            return undefined;
        };
        
        // Helper function to format populated object
        const formatPopulated = (field, nameField = 'name') => {
            if (!field) return undefined;
            // Handle populated Mongoose documents
            if (typeof field === 'object' && field._id) {
                const name = field[nameField] || field.name;
                if (name) {
                    return {
                        id: field._id.toString(),
                        name: name
                    };
                }
            }
            return undefined;
        };
        
        // Transform the response to match frontend expectations
        const formattedData = {
            id: equipmentObj._id.toString(),
            name: equipmentObj.name,
            serialNumber: equipmentObj.serialNumber,
            company: equipmentObj.company,
            model: equipmentObj.model,
            manufacturer: equipmentObj.manufacturer,
            technicalSpecifications: equipmentObj.technicalSpecifications,
            purchaseDate: equipmentObj.purchaseDate,
            warrantyStartDate: equipmentObj.warrantyStartDate,
            warrantyEndDate: equipmentObj.warrantyEndDate,
            location: equipmentObj.location,
            departmentId: extractId(equipmentObj.departmentId),
            department: formatPopulated(equipmentObj.departmentId),
            categoryId: extractId(equipmentObj.categoryId),
            category: formatPopulated(equipmentObj.categoryId),
            employeeId: extractId(equipmentObj.employeeId),
            employee: formatPopulated(equipmentObj.employeeId),
            maintenanceTeamId: extractId(equipmentObj.maintenanceTeamId),
            maintenanceTeam: formatPopulated(equipmentObj.maintenanceTeamId),
            technicianId: extractId(equipmentObj.technicianId),
            technician: equipmentObj.technicianId && typeof equipmentObj.technicianId === 'object' && equipmentObj.technicianId._id ? {
                id: equipmentObj.technicianId._id.toString(),
                name: equipmentObj.technicianId.name || 'Unknown',
                email: equipmentObj.technicianId.email
            } : undefined,
            workCenterId: extractId(equipmentObj.workCenterId),
            workCenter: formatPopulated(equipmentObj.workCenterId),
            active: equipmentObj.active,
            note: equipmentObj.note,
            scrapDate: equipmentObj.scrapDate,
            scrapReason: equipmentObj.scrapReason,
            createdAt: equipmentObj.createdAt,
            updatedAt: equipmentObj.updatedAt,
            requests,
            openRequestCount,
            requestCount
        };
        
        // Debug logging (can be removed in production)
        if (process.env.NODE_ENV === 'development') {
            console.log('Equipment transformation:', {
                departmentId: equipmentObj.departmentId,
                department: formattedData.department,
                categoryId: equipmentObj.categoryId,
                category: formattedData.category,
                employeeId: equipmentObj.employeeId,
                employee: formattedData.employee,
                maintenanceTeamId: equipmentObj.maintenanceTeamId,
                maintenanceTeam: formattedData.maintenanceTeam,
                technicianId: equipmentObj.technicianId,
                technician: formattedData.technician
            });
        }

        res.status(200).json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error('Error in getEquipmentById:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch equipment details'
        });
    }
};

const createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create({
            ...req.body,
            createdBy: req.user.id
        });

        const populatedEquipment = await Equipment.findById(equipment._id)
            .populate('departmentId', 'name')
            .populate('categoryId', 'name')
            .populate('employeeId', 'name')
            .populate('maintenanceTeamId', 'name')
            .populate('technicianId', 'name email')
            .populate('workCenterId', 'name');

        res.status(201).json({
            success: true,
            data: populatedEquipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const updateEquipment = async (req, res) => {
    try {
        let equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Equipment not found'
            });
        }

        equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user.id },
            { new: true, runValidators: true }
        )
            .populate('departmentId', 'name')
            .populate('categoryId', 'name')
            .populate('employeeId', 'name')
            .populate('maintenanceTeamId', 'name')
            .populate('technicianId', 'name email')
            .populate('workCenterId', 'name');

        res.status(200).json({
            success: true,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Equipment not found'
            });
        }

        equipment.active = false;
        await equipment.save();

        res.status(200).json({
            success: true,
            message: 'Equipment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const getEquipmentRequests = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID',
                message: 'Invalid equipment ID format'
            });
        }

        const { state, requestType } = req.query;
        const equipment = await Equipment.findById(req.params.id).select('name');

        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Equipment not found'
            });
        }

        let query = { equipment: req.params.id };
        if (state) query.state = state;
        if (requestType) query.requestType = requestType;

        const requests = await MaintenanceRequest.find(query)
            .populate('technician', 'name')
            .sort({ createdAt: -1 });

        const total = await MaintenanceRequest.countDocuments({ equipment: req.params.id });
        const openCount = await MaintenanceRequest.countDocuments({
            equipment: req.params.id,
            state: { $in: ['new', 'in_progress'] }
        });

        res.status(200).json({
            success: true,
            data: {
                equipment,
                requests,
                total,
                openCount
            }
        });
    } catch (error) {
        console.error('Error in getEquipmentRequests:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch equipment requests'
        });
    }
};

module.exports = {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentRequests
};
