const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        sparse: true
    },
    subject: {
        type: String,
        required: true
    },
    description: String,
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    maintenanceTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceTeam',
        required: true
    },
    technician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    stage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceStage',
        required: true
    },
    requestType: {
        type: String,
        enum: ['corrective', 'preventive'],
        default: 'corrective'
    },
    priority: {
        type: String,
        enum: ['0', '1', '2', '3'],
        default: '1'
    },
    state: {
        type: String,
        enum: ['new', 'in_progress', 'repaired', 'scrap'],
        default: 'new'
    },
    scheduledDate: Date,
    dateRequest: {
        type: Date,
        default: Date.now
    },
    dateStart: Date,
    dateEnd: Date,
    duration: {
        type: Number,
        default: 0
    },
    maintenanceCost: {
        type: Number,
        default: 0
    },
    isOverdue: {
        type: Boolean,
        default: false
    },
    note: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

maintenanceRequestSchema.pre('save', async function (next) {
    if (this.isNew && !this.name) {
        const count = await mongoose.model('MaintenanceRequest').countDocuments();
        this.name = `MR${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
