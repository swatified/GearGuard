const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

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

        if (req.query.departmentId) query.departmentId = req.query.departmentId;
        if (req.query.categoryId) query.categoryId = req.query.categoryId;
        if (req.query.employeeId) query.employeeId = req.query.employeeId;
        if (req.query.teamId) query.maintenanceTeamId = req.query.teamId;

        const equipmentList = await Equipment.find(query)
            .populate('departmentId', 'name')
            .populate('categoryId', 'name')
            .populate('employeeId', 'name')
            .populate('maintenanceTeamId', 'name')
            .populate('technicianId', 'name email')
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                equipment: equipmentList,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate('departmentId', 'name')
            .populate('categoryId', 'name')
            .populate('employeeId', 'name')
            .populate('maintenanceTeamId', 'name')
            .populate('technicianId', 'name email');

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

        res.status(200).json({
            success: true,
            data: {
                ...equipment.toObject(),
                requests,
                openRequestCount,
                requestCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
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
            .populate('technicianId', 'name email');

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
            .populate('technicianId', 'name email');

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
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
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
