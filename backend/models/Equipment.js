const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    serialNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    purchaseDate: Date,
    warrantyStartDate: Date,
    warrantyEndDate: Date,
    location: String,
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EquipmentCategory'
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    },
    maintenanceTeamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaintenanceTeam',
        required: true
    },
    technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    scrapDate: Date,
    scrapReason: String,
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

equipmentSchema.virtual('requests', {
    ref: 'MaintenanceRequest',
    localField: '_id',
    foreignField: 'equipment'
});

equipmentSchema.virtual('requestCount', {
    ref: 'MaintenanceRequest',
    localField: '_id',
    foreignField: 'equipment',
    count: true
});

equipmentSchema.virtual('openRequestCount', {
    ref: 'MaintenanceRequest',
    localField: '_id',
    foreignField: 'equipment',
    count: true,
    match: { state: { $in: ['new', 'in_progress'] } }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
