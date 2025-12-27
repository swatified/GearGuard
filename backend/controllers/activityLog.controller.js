const ActivityLog = require('../models/ActivityLog');
const mongoose = require('mongoose');

const getActivityLogs = async (req, res) => {
    try {
        const { requestId } = req.params;
        const limit = parseInt(req.query.limit, 10) || 50;

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID',
                message: 'Invalid maintenance request ID format'
            });
        }

        const logs = await ActivityLog.find({ maintenanceRequest: requestId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit);

        const formattedLogs = logs.map(log => {
            const logObj = log.toObject();
            return {
                id: logObj._id.toString(),
                action: logObj.action,
                description: logObj.description,
                fieldName: logObj.fieldName,
                oldValue: logObj.oldValue,
                newValue: logObj.newValue,
                user: logObj.user ? {
                    id: logObj.user._id.toString(),
                    name: logObj.user.name,
                    email: logObj.user.email
                } : null,
                metadata: logObj.metadata,
                createdAt: logObj.createdAt,
                updatedAt: logObj.updatedAt
            };
        });

        res.status(200).json({
            success: true,
            data: formattedLogs
        });
    } catch (error) {
        console.error('Error in getActivityLogs:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error.message || 'Failed to fetch activity logs'
        });
    }
};

module.exports = {
    getActivityLogs
};

