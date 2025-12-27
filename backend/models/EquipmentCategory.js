const mongoose = require('mongoose');

const equipmentCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    responsible: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('EquipmentCategory', equipmentCategorySchema);
