const EquipmentCategory = require('../models/EquipmentCategory');

const getCategories = async (req, res) => {
    try {
        const categories = await EquipmentCategory.find().sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const category = await EquipmentCategory.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

module.exports = { getCategories, createCategory };
