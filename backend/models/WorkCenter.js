const mongoose = require('mongoose');

const workCenterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        trim: true,
        sparse: true
    },
    tag: {
        type: String,
        trim: true
    },
    alternativeWorkcenters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkCenter'
    }],
    cost: {
        type: Number,
        default: 0
    },
    rate: {
        type: Number,
        default: 0
    },
    allocation: {
        type: Number,
        default: 0
    },
    costPerHour: {
        type: Number,
        default: 0
    },
    capacityTime: {
        type: Number,
        default: 0,
        comment: 'Capacity Time in Hours per day'
    },
    capacityTimeEfficiency: {
        type: Number,
        default: 100,
        comment: 'Capacity Time Efficiency percentage'
    },
    oeeTarget: {
        type: Number,
        default: 0,
        comment: 'OEE (Overall Equipment Effectiveness) Target percentage'
    },
    active: {
        type: Boolean,
        default: true
    },
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

module.exports = mongoose.model('WorkCenter', workCenterSchema);

