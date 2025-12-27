const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const totalEquipment = await Equipment.countDocuments();
        const activeEquipment = await Equipment.countDocuments({ active: true });
        const scrappedEquipment = await Equipment.countDocuments({ active: false });

        const totalRequests = await MaintenanceRequest.countDocuments();
        const openRequests = await MaintenanceRequest.countDocuments({ state: { $in: ['new', 'in_progress'] } });
        const inProgressRequests = await MaintenanceRequest.countDocuments({ state: 'in_progress' });
        const completedRequests = await MaintenanceRequest.countDocuments({ state: 'repaired' });
        const overdueRequests = await MaintenanceRequest.countDocuments({ isOverdue: true });

        // Calculate Critical Equipment (equipment with 3+ open requests or multiple overdue requests)
        // For now, we'll consider equipment with 3+ open requests as critical
        const equipmentWithOpenRequests = await MaintenanceRequest.aggregate([
            { $match: { state: { $in: ['new', 'in_progress'] } } },
            { $group: { _id: '$equipment', count: { $sum: 1 } } },
            { $match: { count: { $gte: 3 } } }
        ]);
        const criticalEquipmentCount = equipmentWithOpenRequests.length;

        // Calculate Technician Utilization
        const totalTechnicians = await User.countDocuments({ role: 'technician' });
        const assignedTechnicians = await MaintenanceRequest.distinct('technician', {
            state: { $in: ['new', 'in_progress'] },
            technician: { $ne: null }
        });
        const activeTechnicians = assignedTechnicians.length;
        const technicianUtilization = totalTechnicians > 0 
            ? Math.round((activeTechnicians / totalTechnicians) * 100) 
            : 0;

        const requestsByTypeFunc = MaintenanceRequest.aggregate([
            { $group: { _id: '$requestType', count: { $sum: 1 } } }
        ]);

        const totalCostFunc = MaintenanceRequest.aggregate([
            { $group: { _id: null, total: { $sum: '$maintenanceCost' } } }
        ]);

        const requestsByTeamFunc = MaintenanceRequest.aggregate([
            { $group: { _id: '$maintenanceTeam', count: { $sum: 1 } } },
            { $lookup: { from: 'maintenanceteams', localField: '_id', foreignField: '_id', as: 'team' } },
            { $unwind: '$team' },
            { $project: { teamId: '$_id', teamName: '$team.name', requestCount: '$count' } }
        ]);

        const [requestsByType, totalCostResult, requestsByTeam] = await Promise.all([
            requestsByTypeFunc,
            totalCostFunc,
            requestsByTeamFunc
        ]);

        const totalMaintenanceCost = totalCostResult.length > 0 ? totalCostResult[0].total : 0;

        const formattedRequestsByType = requestsByType.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: {
                totalEquipment,
                activeEquipment,
                scrappedEquipment,
                totalRequests,
                openRequests,
                inProgressRequests,
                completedRequests,
                overdueRequests,
                totalMaintenanceCost,
                requestsByType: formattedRequestsByType,
                requestsByTeam,
                criticalEquipmentCount,
                technicianUtilization,
                activeTechnicians,
                totalTechnicians
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

const getRecentActivity = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 20;
        const requests = await MaintenanceRequest.find()
            .sort({ updatedAt: -1 })
            .limit(limit)
            .populate('user', 'name')
            .populate('createdBy', 'name')
            .populate('equipment', 'name serialNumber company')
            .populate('technician', 'name')
            .populate('category', 'name')
            .populate('stage', 'name');

        const activity = requests.map(req => {
            const equipmentObj = req.equipment && typeof req.equipment === 'object' ? req.equipment : null;
            const companyName = equipmentObj?.company || 'My company';
            
            return {
                id: req._id.toString(),
                name: req.name,
                subject: req.subject,
                employee: req.user ? {
                    id: req.user._id.toString(),
                    name: req.user.name
                } : req.createdBy ? {
                    id: req.createdBy._id.toString(),
                    name: req.createdBy.name
                } : null,
                technician: req.technician ? {
                    id: req.technician._id.toString(),
                    name: req.technician.name
                } : null,
                category: req.category ? {
                    id: req.category._id.toString(),
                    name: req.category.name
                } : null,
                stage: req.stage ? {
                    id: req.stage._id.toString(),
                    name: req.stage.name
                } : {
                    name: req.state === 'new' ? 'New Request' : req.state === 'in_progress' ? 'In Progress' : req.state === 'repaired' ? 'Repaired' : req.state
                },
                company: companyName,
                equipmentName: equipmentObj ? equipmentObj.name : 'Unknown Equipment',
                timestamp: req.updatedAt,
                state: req.state
            };
        });

        res.status(200).json({
            success: true,
            data: activity
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
    getDashboardStats,
    getRecentActivity
};
