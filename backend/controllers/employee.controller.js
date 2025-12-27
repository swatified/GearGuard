const Employee = require('../models/Employee');

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('department', 'name').sort({ name: 1 });
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error', message: error.message });
    }
};

module.exports = { getEmployees, createEmployee };
