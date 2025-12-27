const Department = require('../models/Department');

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        res.status(200).json({ success: true, data: departments });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

const createDepartment = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

module.exports = { getDepartments, createDepartment };
