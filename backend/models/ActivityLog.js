const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    maintenanceRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceRequest',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'created',
            'stage_changed',
            'technician_assigned',
            'technician_unassigned',
            'field_updated',
            'priority_changed',
            'state_changed',
            'scheduled_date_changed',
            'note_added',
            'note_updated'
        ]
    },
    description: {
        type: String,
        required: true
    },
    fieldName: {
        type: String
    },
    oldValue: {
        type: mongoose.Schema.Types.Mixed
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster queries
activityLogSchema.index({ maintenanceRequest: 1, createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);

