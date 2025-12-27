const ActivityLog = require('../models/ActivityLog');

/**
 * Log an activity for a maintenance request
 * @param {Object} params
 * @param {String} params.requestId - Maintenance request ID
 * @param {String} params.action - Action type (created, stage_changed, etc.)
 * @param {String} params.description - Human-readable description
 * @param {String} params.userId - User who performed the action
 * @param {String} [params.fieldName] - Field that was changed
 * @param {*} [params.oldValue] - Previous value
 * @param {*} [params.newValue] - New value
 * @param {Object} [params.metadata] - Additional metadata
 */
const logActivity = async ({
    requestId,
    action,
    description,
    userId,
    fieldName,
    oldValue,
    newValue,
    metadata
}) => {
    try {
        await ActivityLog.create({
            maintenanceRequest: requestId,
            action,
            description,
            user: userId,
            fieldName,
            oldValue,
            newValue,
            metadata
        });
    } catch (error) {
        // Log error but don't throw - activity logging shouldn't break the main flow
        console.error('Error logging activity:', error);
    }
};

module.exports = { logActivity };

