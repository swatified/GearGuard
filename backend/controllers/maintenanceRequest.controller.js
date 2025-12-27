const MaintenanceRequest = require('../models/MaintenanceRequest');
const MaintenanceStage = require('../models/MaintenanceStage');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');

const getRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        let query = {};

        if (req.query.state) query.state = req.query.state;
        if (req.query.requestType) query.requestType = req.query.requestType;
        if (req.query.equipmentId) query.equipment = req.query.equipmentId;
        if (req.query.teamId) query.maintenanceTeam = req.query.teamId;
        if (req.query.technicianId) query.technician = req.query.technicianId;
        if (req.query.isOverdue === 'true') query.isOverdue = true;

        if (req.query.scheduledDateFrom || req.query.scheduledDateTo) {
            query.scheduledDate = {};
            if (req.query.scheduledDateFrom) query.scheduledDate.$gte = new Date(req.query.scheduledDateFrom);
            if (req.query.scheduledDateTo) query.scheduledDate.$lte = new Date(req.query.scheduledDateTo);
        }

        if (req.query.search) {
            query.$or = [
                { subject: { $regex: req.query.search, $options: 'i' } },
                { name: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const total = await MaintenanceRequest.countDocuments(query);
        const requests = await MaintenanceRequest.find(query)
            .populate('equipment', 'name serialNumber')
            .populate('maintenanceTeam', 'name')
            .populate('technician', 'name email')
            .populate('user', 'name')
            .populate('stage', 'name sequence')
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                requests,
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

const getRequestById = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id)
            .populate('equipment', 'name serialNumber location')
            .populate('maintenanceTeam', 'name members')
            .populate('technician', 'name email')
            .populate('user', 'name')
            .populate('stage', 'name sequence');

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const createRequest = async (req, res) => {
    try {
        const { equipmentId, ...rest } = req.body;

        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Equipment not found'
            });
        }

        let stage = await MaintenanceStage.findOne({ sequence: 10 });
        if (!stage) {
            stage = await MaintenanceStage.create({ name: 'New', sequence: 10 });
        }

        const request = await MaintenanceRequest.create({
            ...rest,
            equipment: equipmentId,
            maintenanceTeam: equipment.maintenanceTeamId,
            user: req.user.id,
            state: 'new',
            stage: stage._id,
            createdBy: req.user.id
        });

        // Populate for response
        const populatedRequest = await MaintenanceRequest.findById(request._id)
            .populate('equipment', 'name')
            .populate('maintenanceTeam', 'name')
            .populate('stage', 'name');

        res.status(201).json({
            success: true,
            data: populatedRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const updateRequest = async (req, res) => {
    try {
        let request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        request = await MaintenanceRequest.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedBy: req.user.id },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const assignTechnician = async (req, res) => {
    try {
        const { technicianId } = req.body;
        let request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        request.technician = technicianId;
        await request.save();

        request = await request.populate('technician', 'name');

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const updateStage = async (req, res) => {
    try {
        const { stageId } = req.body;
        let request = await MaintenanceRequest.findById(req.params.id);
        const stage = await MaintenanceStage.findById(stageId);

        if (!request || !stage) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Resource not found'
            });
        }

        request.stage = stageId;

        if (stage.name === 'New') request.state = 'new';
        else if (stage.name === 'Scrap') {
            request.state = 'scrap';
            await Equipment.findByIdAndUpdate(request.equipment, { active: false });
        }
        else if (stage.isDone) request.state = 'repaired';
        else request.state = 'in_progress';

        await request.save();
        request = await request.populate('stage', 'name');

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const completeRequest = async (req, res) => {
    try {
        let request = await MaintenanceRequest.findById(req.params.id);

        let doneStage = await MaintenanceStage.findOne({ isDone: true });
        if (!doneStage) doneStage = await MaintenanceStage.findOne({ name: 'Repaired' });

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        const { duration, dateEnd, maintenanceCost, note } = req.body;

        request.stage = doneStage ? doneStage._id : request.stage;
        request.state = 'repaired';
        if (duration) request.duration = duration;
        if (dateEnd) request.dateEnd = dateEnd;
        else request.dateEnd = Date.now();
        if (maintenanceCost) request.maintenanceCost = maintenanceCost;
        if (note) request.note = note;

        await request.save();
        request = await request.populate('stage', 'name');

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const scrapRequest = async (req, res) => {
    try {
        const { scrapReason } = req.body;
        let request = await MaintenanceRequest.findById(req.params.id);

        let scrapStage = await MaintenanceStage.findOne({ isScrap: true });
        if (!scrapStage) scrapStage = await MaintenanceStage.findOne({ name: 'Scrap' });

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        request.stage = scrapStage ? scrapStage._id : request.stage;
        request.state = 'scrap';
        await request.save();

        const equipment = await Equipment.findByIdAndUpdate(
            request.equipment,
            {
                active: false,
                scrapDate: Date.now(),
                scrapReason: scrapReason
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                ...request.toObject(),
                stage: scrapStage,
                equipment
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

const getCalendarRequests = async (req, res) => {
    try {
        const { startDate, endDate, teamId } = req.query;
        let query = { requestType: 'preventive' };

        if (startDate && endDate) {
            query.scheduledDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (teamId) query.maintenanceTeam = teamId;

        const requests = await MaintenanceRequest.find(query)
            .populate('equipment', 'name')
            .populate('maintenanceTeam', 'name')
            .populate('technician', 'name');

        res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message
        });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        if (request.state !== 'new') {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Only requests in new state can be deleted'
            });
        }

        await MaintenanceRequest.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Request deleted successfully'
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
    getRequests,
    getRequestById,
    createRequest,
    updateRequest,
    assignTechnician,
    updateStage,
    completeRequest,
    scrapRequest,
    getCalendarRequests,
    deleteRequest
};
