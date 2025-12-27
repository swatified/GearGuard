const mongoose = require('mongoose');

const maintenanceStageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sequence: {
        type: Number,
        default: 10
    },
    fold: {
        type: Boolean,
        default: false
    },
    isDone: {
        type: Boolean,
        default: false
    },
    isScrap: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MaintenanceStage', maintenanceStageSchema);
