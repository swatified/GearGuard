const MaintenanceRequest = require('../models/MaintenanceRequest');
const MaintenanceStage = require('../models/MaintenanceStage');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const mongoose = require('mongoose');

const getRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        let query = {};

        // Personalization based on user role (as per GearGuard requirements)
        const userRole = req.user.role;
        const userId = req.user._id;

        if (userRole === 'admin' || userRole === 'manager') {
            // Admins and Managers see all requests
            // No additional filtering needed
        } else if (userRole === 'technician') {
            // Technicians see requests assigned to them OR requests for their teams
            // Find teams where this technician is a member
            const userTeams = await MaintenanceTeam.find({ members: userId }).select('_id');
            const teamIds = userTeams.map(team => team._id);
            
            // Show requests where:
            // 1. Technician is assigned to the request, OR
            // 2. Request is for a team the technician belongs to
            query.$or = [
                { technician: userId },
                { maintenanceTeam: { $in: teamIds } }
            ];
        } else {
            // Regular users see:
            // 1. Requests they created, OR
            // 2. Requests for equipment assigned to them
            const userEquipment = await Equipment.find({ employeeId: userId }).select('_id');
            const equipmentIds = userEquipment.map(eq => eq._id);
            
            query.$or = [
                { user: userId },
                { createdBy: userId },
                { equipment: { $in: equipmentIds } }
            ];
        }

        // Apply additional filters from query parameters
        // Note: Explicit query parameters (equipmentId, teamId, technicianId) will narrow down the results
        // but still respect the role-based personalization
        if (req.query.state) query.state = req.query.state;
        if (req.query.requestType) query.requestType = req.query.requestType;
        if (req.query.equipmentId) {
            // If equipmentId is specified, add it to the query
            // For regular users, this will work with their $or condition
            // For others, it will filter by specific equipment
            query.equipment = req.query.equipmentId;
        }
        if (req.query.teamId) {
            // If teamId is specified, add it to the query
            // For technicians, this will work with their $or condition
            query.maintenanceTeam = req.query.teamId;
        }
        if (req.query.technicianId) {
            // If technicianId is specified, add it to the query
            // For technicians, this will work with their $or condition
            query.technician = req.query.technicianId;
        }
        if (req.query.isOverdue === 'true') query.isOverdue = true;

        if (req.query.scheduledDateFrom || req.query.scheduledDateTo) {
            query.scheduledDate = {};
            if (req.query.scheduledDateFrom) query.scheduledDate.$gte = new Date(req.query.scheduledDateFrom);
            if (req.query.scheduledDateTo) query.scheduledDate.$lte = new Date(req.query.scheduledDateTo);
        }

        if (req.query.search) {
            // Combine search with existing $or if present
            const searchConditions = [
                { subject: { $regex: req.query.search, $options: 'i' } },
                { name: { $regex: req.query.search, $options: 'i' } }
            ];
            
            if (query.$or) {
                // If we have role-based $or, combine with search using $and
                query.$and = [
                    { $or: query.$or },
                    { $or: searchConditions }
                ];
                delete query.$or;
            } else {
                query.$or = searchConditions;
            }
        }

        const total = await MaintenanceRequest.countDocuments(query);
        const requests = await MaintenanceRequest.find(query)
            .populate('equipment', 'name serialNumber')
            .populate('maintenanceTeam', 'name')
            .populate('category', 'name')
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
            .populate('equipment', 'name serialNumber location company')
            .populate('maintenanceTeam', 'name members')
            .populate('category', 'name')
            .populate('technician', 'name email')
            .populate('user', 'name')
            .populate('createdBy', 'name')
            .populate('stage', 'name sequence');

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        const requestObj = request.toObject();
        
        // Format the response to match frontend expectations
        const formattedData = {
            id: requestObj._id.toString(),
            name: requestObj.name,
            subject: requestObj.subject,
            description: requestObj.description,
            equipmentId: requestObj.equipment?._id?.toString() || requestObj.equipment?.toString(),
            equipment: requestObj.equipment ? {
                id: requestObj.equipment._id?.toString() || requestObj.equipment.toString(),
                name: requestObj.equipment.name,
                serialNumber: requestObj.equipment.serialNumber,
                location: requestObj.equipment.location,
                company: requestObj.equipment.company
            } : null,
            maintenanceTeamId: requestObj.maintenanceTeam?._id?.toString() || requestObj.maintenanceTeam?.toString(),
            maintenanceTeam: requestObj.maintenanceTeam ? {
                id: requestObj.maintenanceTeam._id.toString(),
                name: requestObj.maintenanceTeam.name,
                members: requestObj.maintenanceTeam.members?.map(m => ({
                    id: m._id.toString(),
                    name: m.name,
                    email: m.email
                })) || []
            } : null,
            categoryId: requestObj.category?._id?.toString() || requestObj.category?.toString(),
            category: requestObj.category ? {
                id: requestObj.category._id.toString(),
                name: requestObj.category.name
            } : null,
            technicianId: requestObj.technician?._id?.toString() || requestObj.technician?.toString(),
            technician: requestObj.technician ? {
                id: requestObj.technician._id.toString(),
                name: requestObj.technician.name,
                email: requestObj.technician.email
            } : null,
            userId: requestObj.user?._id?.toString() || requestObj.user?.toString() || requestObj.createdBy?._id?.toString(),
            user: requestObj.user ? {
                id: requestObj.user._id.toString(),
                name: requestObj.user.name
            } : requestObj.createdBy ? {
                id: requestObj.createdBy._id.toString(),
                name: requestObj.createdBy.name
            } : null,
            requestType: requestObj.requestType,
            priority: requestObj.priority,
            state: requestObj.state,
            stageId: requestObj.stage?._id?.toString() || requestObj.stage?.toString(),
            stage: requestObj.stage ? {
                id: requestObj.stage._id.toString(),
                name: requestObj.stage.name,
                sequence: requestObj.stage.sequence
            } : null,
            scheduledDate: requestObj.scheduledDate,
            dateRequest: requestObj.dateRequest,
            dateStart: requestObj.dateStart,
            dateEnd: requestObj.dateEnd,
            duration: requestObj.duration,
            maintenanceCost: requestObj.maintenanceCost,
            isOverdue: requestObj.isOverdue,
            note: requestObj.note,
            createdAt: requestObj.createdAt,
            updatedAt: requestObj.updatedAt
        };

        res.status(200).json({
            success: true,
            data: formattedData
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

        const requestData = {
            ...rest,
            equipment: equipmentId,
            maintenanceTeam: equipment.maintenanceTeamId,
            category: equipment.categoryId,
            technician: equipment.technicianId,
            user: req.user.id,
            state: 'new',
            stage: stage._id,
            createdBy: req.user.id
        };

        const request = await MaintenanceRequest.create(requestData);

        const populatedRequest = await MaintenanceRequest.findById(request._id)
            .populate('equipment', 'name')
            .populate('maintenanceTeam', 'name')
            .populate('category', 'name')
            .populate('technician', 'name')
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
        )
            .populate('equipment', 'name')
            .populate('maintenanceTeam', 'name')
            .populate('category', 'name')
            .populate('technician', 'name')
            .populate('stage', 'name');

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

        // Workflow Logic: Check if the technician belongs to the assigned maintenance team
        const team = await MaintenanceTeam.findById(request.maintenanceTeam);
        if (!team.members.includes(technicianId) && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                message: 'Assigned technician must be a member of the maintenance team'
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
        
        if (!stageId) {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                message: 'stageId is required'
            });
        }

        let request = await MaintenanceRequest.findById(req.params.id)
            .populate('maintenanceTeam', 'members');
        
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance request not found'
            });
        }

        const stage = await MaintenanceStage.findById(stageId);
        
        if (!stage) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: 'Maintenance stage not found'
            });
        }

        const userRole = req.user.role;
        const userId = req.user._id;
        const stageName = stage.name.toLowerCase();

        // Role-based workflow restrictions (as per GearGuard PDF requirements)
        // Flow 1: The Breakdown - Only technicians/managers can move to "In Progress" and "Repaired"
        
        // Regular users can only create requests (New stage) - they cannot move stages
        if (userRole === 'user') {
            // Regular users can only view, not change stages
            // Exception: They can move back to "New" if it's their own request (though this is unusual)
            if (stageName !== 'new' && request.user.toString() !== userId.toString() && request.createdBy.toString() !== userId.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'Regular users cannot change request stages. Only technicians and managers can update request status.'
                });
            }
        }

        // Moving to "In Progress" - Only assigned technician or team member can do this
        if (stageName === 'in progress' || stageName === 'in_progress') {
            // Check if user is admin/manager (they can always move)
            if (userRole !== 'admin' && userRole !== 'manager') {
                // For technicians: Must be assigned technician OR member of the maintenance team
                if (userRole === 'technician') {
                    const isAssignedTechnician = request.technician && request.technician.toString() === userId.toString();
                    const isTeamMember = request.maintenanceTeam && 
                        request.maintenanceTeam.members && 
                        request.maintenanceTeam.members.some(member => member.toString() === userId.toString());
                    
                    if (!isAssignedTechnician && !isTeamMember) {
                        return res.status(403).json({
                            success: false,
                            error: 'Forbidden',
                            message: 'Only the assigned technician or a member of the maintenance team can move requests to "In Progress"'
                        });
                    }
                } else {
                    return res.status(403).json({
                        success: false,
                        error: 'Forbidden',
                        message: 'Only technicians and managers can move requests to "In Progress"'
                    });
                }
            }
        }

        // Moving to "Repaired" - Only assigned technician can complete the work
        if (stageName === 'repaired' || stage.isDone) {
            if (userRole !== 'admin' && userRole !== 'manager') {
                if (userRole === 'technician') {
                    // Technician must be assigned to the request
                    if (!request.technician || request.technician.toString() !== userId.toString()) {
                        return res.status(403).json({
                            success: false,
                            error: 'Forbidden',
                            message: 'Only the assigned technician can mark requests as "Repaired"'
                        });
                    }
                } else {
                    return res.status(403).json({
                        success: false,
                        error: 'Forbidden',
                        message: 'Only technicians and managers can mark requests as "Repaired"'
                    });
                }
            }
        }

        // Moving to "Scrap" - Only managers/admins can scrap equipment
        if (stageName === 'scrap') {
            if (userRole !== 'admin' && userRole !== 'manager') {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'Only managers and administrators can mark requests as "Scrap"'
                });
            }
        }

        // Update the stage
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
        console.error('Error in updateStage:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to update request stage'
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
