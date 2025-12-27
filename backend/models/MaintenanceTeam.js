const mongoose = require('mongoose');

const maintenanceTeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

maintenanceTeamSchema.virtual('requestCount', {
    ref: 'MaintenanceRequest',
    localField: '_id',
    foreignField: 'maintenanceTeam',
    count: true
});

module.exports = mongoose.model('MaintenanceTeam', maintenanceTeamSchema);
