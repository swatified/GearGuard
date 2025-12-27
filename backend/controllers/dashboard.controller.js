const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const MaintenanceTeam = require('../models/MaintenanceTeam');

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
                requestsByTeam
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
            .populate('equipment', 'name');

        const activity = requests.map(req => ({
            id: req._id,
            type: req.state === 'new' ? 'request_created' : 'request_updated',
            message: `${req.subject} - ${req.state}`,
            equipmentName: req.equipment ? req.equipment.name : 'Unknown Equipment',
            timestamp: req.updatedAt,
            user: req.user
        }));

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
